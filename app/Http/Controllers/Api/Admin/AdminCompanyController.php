<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class AdminCompanyController extends Controller
{
    /**
     * Get all companies with filtering and pagination.
     */
    public function index(Request $request): JsonResponse
    {
        $companies = Company::query()
            ->with('user:id,first_name,last_name,email')
            ->withCount(['jobs', 'jobs as active_jobs_count' => function ($query) {
                $query->where('status', 'active');
            }])
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('industry', 'like', "%{$search}%")
                        ->orWhere('location', 'like', "%{$search}%");
                });
            })
            ->when($request->has('is_verified'), function ($query) use ($request) {
                $query->where('is_verified', $request->boolean('is_verified'));
            })
            ->when($request->has('is_active'), function ($query) use ($request) {
                $query->where('is_active', $request->boolean('is_active'));
            })
            ->when($request->industry, function ($query, $industry) {
                $query->where('industry', $industry);
            })
            ->when($request->sort_by, function ($query, $sortBy) use ($request) {
                $direction = $request->get('sort_direction', 'desc');
                $query->orderBy($sortBy, $direction);
            }, function ($query) {
                $query->latest();
            })
            ->paginate($request->per_page ?? 15);

        return $this->success($companies, 'Companies retrieved successfully');
    }

    /**
     * Get companies pending verification.
     */
    public function pending(Request $request): JsonResponse
    {
        $companies = Company::query()
            ->with('user:id,first_name,last_name,email')
            ->where('is_verified', false)
            ->withCount('jobs')
            ->latest()
            ->paginate($request->per_page ?? 15);

        return $this->success($companies, 'Pending companies retrieved successfully');
    }

    /**
     * Get a specific company by ID.
     */
    public function show($id): JsonResponse
    {
        $company = Company::with([
            'user',
            'jobs' => function ($query) {
                $query->withCount('applications')->latest()->take(10);
            },
        ])->withCount([
            'jobs',
            'jobs as active_jobs_count' => function ($query) {
                $query->where('status', 'active');
            }
        ])->findOrFail($id);

        // Calculate total applications
        $company->total_applications = $company->jobs()->withCount('applications')->get()->sum('applications_count');

        return $this->success($company, 'Company retrieved successfully');
    }

    /**
     * Update a company.
     */
    public function update(Request $request, $id): JsonResponse
    {
        $company = Company::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'website' => 'sometimes|url|nullable',
            'industry' => 'sometimes|string|max:255',
            'size' => 'sometimes|string|max:50',
            'location' => 'sometimes|string|max:255',
            'is_active' => 'sometimes|boolean',
            'is_featured' => 'sometimes|boolean',
        ]);

        $company->update($validated);

        $this->logAudit('update', $company, $validated);

        return $this->success($company, 'Company updated successfully');
    }

    /**
     * Verify a company.
     */
    public function verify(Request $request, $id): JsonResponse
    {
        $company = Company::findOrFail($id);

        if ($company->is_verified) {
            return $this->error('Company is already verified', 400);
        }

        $company->update([
            'is_verified' => true,
            'verified_at' => now(),
            'verified_by' => auth()->id(),
            'rejection_reason' => null,
        ]);

        // Also verify the associated user
        $company->user->update(['is_verified' => true]);

        $this->logAudit('verify', $company);

        // TODO: Send verification notification to company owner

        return $this->success($company, 'Company verified successfully');
    }

    /**
     * Reject company verification.
     */
    public function reject(Request $request, $id): JsonResponse
    {
        $company = Company::findOrFail($id);

        $validated = $request->validate([
            'reason' => 'required|string|max:500',
        ]);

        $company->update([
            'is_verified' => false,
            'verified_at' => null,
            'rejection_reason' => $validated['reason'],
        ]);

        $this->logAudit('reject', $company, ['reason' => $validated['reason']]);

        // TODO: Send rejection notification to company owner

        return $this->success($company, 'Company verification rejected');
    }

    /**
     * Delete a company.
     */
    public function destroy($id): JsonResponse
    {
        $company = Company::findOrFail($id);

        // Check if company has active jobs
        $activeJobs = $company->jobs()->where('status', 'active')->count();
        if ($activeJobs > 0) {
            return $this->error("Cannot delete company with {$activeJobs} active job(s). Please close all jobs first.", 400);
        }

        // Delete logo if exists
        if ($company->logo) {
            Storage::disk('public')->delete($company->logo);
        }

        $this->logAudit('delete', $company);

        // Delete all associated jobs first
        $company->jobs()->delete();
        $company->delete();

        return $this->success(null, 'Company deleted successfully');
    }

    /**
     * Log admin actions for audit trail.
     */
    private function logAudit(string $action, Company $company, array $data = []): void
    {
        if (class_exists(\App\Models\AuditLog::class)) {
            try {
                \App\Models\AuditLog::create([
                    'user_id' => auth()->id(),
                    'action' => $action,
                    'model_type' => Company::class,
                    'model_id' => $company->id,
                    'old_values' => json_encode($company->getOriginal()),
                    'new_values' => json_encode($data),
                    'ip_address' => request()->ip(),
                    'user_agent' => request()->userAgent(),
                ]);
            } catch (\Exception $e) {
                // Silently fail
            }
        }
    }
}
