<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\CandidateProfile;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class AdminUserController extends Controller
{
    /**
     * Get all users with filtering and pagination.
     */
    public function index(Request $request): JsonResponse
    {
        $users = User::query()
            ->with(['candidateProfile', 'company'])
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('user_name', 'like', "%{$search}%");
                });
            })
            ->when($request->user_type, function ($query, $type) {
                $query->where('user_type', $type);
            })
            ->when($request->has('is_verified'), function ($query) use ($request) {
                $query->where('is_verified', $request->boolean('is_verified'));
            })
            ->when($request->has('is_suspended'), function ($query) use ($request) {
                $query->where('is_suspended', $request->boolean('is_suspended'));
            })
            ->when($request->sort_by, function ($query, $sortBy) use ($request) {
                $direction = $request->get('sort_direction', 'desc');
                $query->orderBy($sortBy, $direction);
            }, function ($query) {
                $query->latest();
            })
            ->paginate($request->per_page ?? 15);

        return $this->success($users, 'Users retrieved successfully');
    }

    /**
     * Get a specific user by ID.
     */
    public function show($id): JsonResponse
    {
        $user = User::with([
            'candidateProfile',
            'company',
            'jobApplications' => function ($query) {
                $query->with('job:id,title')->latest()->take(10);
            },
            'savedJobs' => function ($query) {
                $query->with('job:id,title')->latest()->take(10);
            }
        ])->findOrFail($id);

        // Add statistics
        $user->statistics = [
            'total_applications' => $user->jobApplications()->count(),
            'saved_jobs' => $user->savedJobs()->count(),
            'accepted_applications' => $user->jobApplications()->where('status', 'accepted')->count(),
        ];

        if ($user->isEmployer() && $user->company) {
            $user->statistics['posted_jobs'] = $user->company->jobs()->count();
            $user->statistics['active_jobs'] = $user->company->jobs()->where('status', 'active')->count();
        }

        return $this->success($user, 'User retrieved successfully');
    }

    /**
     * Update a user.
     */
    public function update(Request $request, $id): JsonResponse
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'first_name' => 'sometimes|string|max:255',
            'last_name' => 'sometimes|string|max:255',
            'user_name' => ['sometimes', 'string', 'max:255', Rule::unique('users')->ignore($id)],
            'email' => ['sometimes', 'email', Rule::unique('users')->ignore($id)],
            'phone_number' => 'sometimes|string|max:20',
            'user_type' => 'sometimes|in:candidate,employer,admin',
            'is_verified' => 'sometimes|boolean',
            'bio' => 'sometimes|string|max:1000',
            'job_title' => 'sometimes|string|max:255',
            'location' => 'sometimes|string|max:255',
        ]);

        // Prevent admin from changing their own role
        if ($user->id === auth()->id() && isset($validated['user_type']) && $validated['user_type'] !== 'admin') {
            return $this->error('You cannot change your own admin role', 400);
        }

        $user->update($validated);

        // Log the action
        $this->logAudit('update', $user, $validated);

        return $this->success($user, 'User updated successfully');
    }

    /**
     * Delete a user.
     */
    public function destroy($id): JsonResponse
    {
        $user = User::findOrFail($id);

        // Prevent admin from deleting themselves
        if ($user->id === auth()->id()) {
            return $this->error('You cannot delete your own account', 400);
        }

        // Prevent deleting other admins (optional safety measure)
        if ($user->isAdmin() && !auth()->user()->isSuperAdmin()) {
            return $this->error('Only super admins can delete admin accounts', 403);
        }

        // Delete associated files
        if ($user->profile_image) {
            Storage::disk('public')->delete($user->profile_image);
        }

        if ($user->candidateProfile && $user->candidateProfile->resume) {
            Storage::disk('public')->delete($user->candidateProfile->resume);
        }

        // Log before deletion
        $this->logAudit('delete', $user);

        $user->delete();

        return $this->success(null, 'User deleted successfully');
    }

    /**
     * Suspend a user.
     */
    public function suspend(Request $request, $id): JsonResponse
    {
        $user = User::findOrFail($id);

        if ($user->id === auth()->id()) {
            return $this->error('You cannot suspend your own account', 400);
        }

        if ($user->isAdmin()) {
            return $this->error('Cannot suspend admin accounts', 400);
        }

        $validated = $request->validate([
            'reason' => 'nullable|string|max:500',
        ]);

        $user->update([
            'is_suspended' => true,
            'suspended_at' => now(),
            'suspension_reason' => $validated['reason'] ?? null,
        ]);

        // Revoke all tokens
        $user->tokens()->delete();

        $this->logAudit('suspend', $user, ['reason' => $validated['reason'] ?? null]);

        return $this->success($user, 'User suspended successfully');
    }

    /**
     * Activate a suspended user.
     */
    public function activate($id): JsonResponse
    {
        $user = User::findOrFail($id);

        if (!$user->is_suspended) {
            return $this->error('User is not suspended', 400);
        }

        $user->update([
            'is_suspended' => false,
            'suspended_at' => null,
            'suspension_reason' => null,
        ]);

        $this->logAudit('activate', $user);

        return $this->success($user, 'User activated successfully');
    }

    /**
     * Verify a user's email manually.
     */
    public function verify($id): JsonResponse
    {
        $user = User::findOrFail($id);

        if ($user->email_verified_at) {
            return $this->error('User email is already verified', 400);
        }

        $user->update([
            'email_verified_at' => now(),
            'is_verified' => true,
        ]);

        $this->logAudit('verify_email', $user);

        return $this->success($user, 'User email verified successfully');
    }

    /**
     * Log admin actions for audit trail.
     */
    private function logAudit(string $action, User $user, array $data = []): void
    {
        if (class_exists(\App\Models\AuditLog::class)) {
            try {
                \App\Models\AuditLog::create([
                    'user_id' => auth()->id(),
                    'action' => $action,
                    'model_type' => User::class,
                    'model_id' => $user->id,
                    'old_values' => json_encode($user->getOriginal()),
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
