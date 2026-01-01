<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Job;
use App\Models\JobCategory;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class AdminJobController extends Controller
{
    /**
     * Get all jobs with filtering and pagination.
     */
    public function index(Request $request): JsonResponse
    {
        $jobs = Job::query()
            ->with(['company:id,name,logo', 'category:id,name'])
            ->withCount('applications')
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                        ->orWhere('location', 'like', "%{$search}%");
                });
            })
            ->when($request->status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($request->company_id, function ($query, $companyId) {
                $query->where('company_id', $companyId);
            })
            ->when($request->category_id, function ($query, $categoryId) {
                $query->where('job_category_id', $categoryId);
            })
            ->when($request->job_type, function ($query, $jobType) {
                $query->where('job_type', $jobType);
            })
            ->when($request->has('is_featured'), function ($query) use ($request) {
                $query->where('is_featured', $request->boolean('is_featured'));
            })
            ->when($request->has('is_urgent'), function ($query) use ($request) {
                $query->where('is_urgent', $request->boolean('is_urgent'));
            })
            ->when($request->sort_by, function ($query, $sortBy) use ($request) {
                $direction = $request->get('sort_direction', 'desc');
                $query->orderBy($sortBy, $direction);
            }, function ($query) {
                $query->latest();
            })
            ->paginate($request->per_page ?? 15);

        return $this->success($jobs, 'Jobs retrieved successfully');
    }

    /**
     * Get jobs pending approval.
     */
    public function pending(Request $request): JsonResponse
    {
        $jobs = Job::query()
            ->with(['company:id,name,logo', 'category:id,name'])
            ->where('status', 'pending')
            ->withCount('applications')
            ->latest()
            ->paginate($request->per_page ?? 15);

        return $this->success($jobs, 'Pending jobs retrieved successfully');
    }

    /**
     * Get a specific job by ID.
     */
    public function show($id): JsonResponse
    {
        $job = Job::with([
            'company',
            'category',
            'applications' => function ($query) {
                $query->with('user:id,first_name,last_name,email')->latest()->take(10);
            }
        ])->withCount('applications')->findOrFail($id);

        return $this->success($job, 'Job retrieved successfully');
    }

    /**
     * Update a job.
     */
    public function update(Request $request, $id): JsonResponse
    {
        $job = Job::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'requirements' => 'sometimes|string|nullable',
            'job_category_id' => 'sometimes|exists:job_categories,id',
            'location' => 'sometimes|string|max:255',
            'job_type' => 'sometimes|in:full-time,part-time,contract,freelance,internship',
            'experience_level' => 'sometimes|in:entry,mid,senior,executive',
            'salary_min' => 'sometimes|numeric|min:0|nullable',
            'salary_max' => 'sometimes|numeric|min:0|nullable',
            'status' => 'sometimes|in:active,inactive,pending,expired,filled',
            'is_featured' => 'sometimes|boolean',
            'is_urgent' => 'sometimes|boolean',
        ]);

        if (isset($validated['title'])) {
            $validated['slug'] = Str::slug($validated['title']) . '-' . Str::random(6);
        }

        $job->update($validated);

        $this->logAudit('update', $job, $validated);

        return $this->success($job->fresh(), 'Job updated successfully');
    }

    /**
     * Approve a pending job.
     */
    public function approve(Request $request, $id): JsonResponse
    {
        $job = Job::findOrFail($id);

        if ($job->status !== 'pending') {
            return $this->error('Only pending jobs can be approved', 400);
        }

        $job->update([
            'status' => 'active',
            'approved_at' => now(),
            'approved_by' => auth()->id(),
            'rejection_reason' => null,
        ]);

        $this->logAudit('approve', $job);

        // TODO: Send approval notification to employer

        return $this->success($job, 'Job approved successfully');
    }

    /**
     * Reject a job.
     */
    public function reject(Request $request, $id): JsonResponse
    {
        $job = Job::findOrFail($id);

        $validated = $request->validate([
            'reason' => 'required|string|max:500',
        ]);

        $job->update([
            'status' => 'rejected',
            'rejection_reason' => $validated['reason'],
        ]);

        $this->logAudit('reject', $job, ['reason' => $validated['reason']]);

        // TODO: Send rejection notification to employer

        return $this->success($job, 'Job rejected');
    }

    /**
     * Toggle featured status.
     */
    public function toggleFeatured($id): JsonResponse
    {
        $job = Job::findOrFail($id);

        $job->update(['is_featured' => !$job->is_featured]);

        $this->logAudit('toggle_featured', $job, ['is_featured' => $job->is_featured]);

        return $this->success($job, 'Job featured status updated');
    }

    /**
     * Delete a job.
     */
    public function destroy($id): JsonResponse
    {
        $job = Job::findOrFail($id);

        // Check if job has applications
        $applicationsCount = $job->applications()->count();
        if ($applicationsCount > 0) {
            // Soft approach: just mark as inactive
            $job->update(['status' => 'inactive']);
            return $this->success(null, "Job deactivated (had {$applicationsCount} applications)");
        }

        $this->logAudit('delete', $job);

        $job->delete();

        return $this->success(null, 'Job deleted successfully');
    }

    /**
     * Log admin actions for audit trail.
     */
    private function logAudit(string $action, Job $job, array $data = []): void
    {
        if (class_exists(\App\Models\AuditLog::class)) {
            try {
                \App\Models\AuditLog::create([
                    'user_id' => auth()->id(),
                    'action' => $action,
                    'model_type' => Job::class,
                    'model_id' => $job->id,
                    'old_values' => json_encode($job->getOriginal()),
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
