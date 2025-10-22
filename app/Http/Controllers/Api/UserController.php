<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * Get authenticated user profile.
     */
    public function profile(Request $request)
    {
        $user = $request->user()->load(['candidateProfile', 'company']);
        return $this->success($user, 'Profile retrieved successfully');
    }

    /**
     * Update user profile.
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'first_name' => 'sometimes|string|max:255',
            'last_name' => 'sometimes|string|max:255',
            'user_name' => ['sometimes', 'string', 'max:255', Rule::unique('users')->ignore($user->id)],
            'email' => ['sometimes', 'email', Rule::unique('users')->ignore($user->id)],
            'phone_number' => 'sometimes|string|max:20',
            'gender' => 'sometimes|in:male,female,other',
            'dob' => 'sometimes|date|before:today',
            'location' => 'sometimes|string|max:255',
            'country' => 'sometimes|string|max:255',
            'city' => 'sometimes|string|max:255',
            'zip_code' => 'sometimes|string|max:10',
            'bio' => 'sometimes|string|max:1000',
            'job_title' => 'sometimes|string|max:255',
            'experience_years' => 'sometimes|integer|min:0',
            'social_links' => 'sometimes|array',
        ]);

        $user->update($validated);

        return $this->success($user, 'Profile updated successfully');
    }

    /**
     * Upload profile image.
     */
    public function uploadProfileImage(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $user = $request->user();

        // Delete old image if exists
        if ($user->profile_image) {
            Storage::disk('public')->delete($user->profile_image);
        }

        // Store new image
        $path = $request->file('image')->store('profile-images', 'public');
        $user->update(['profile_image' => $path]);

        return $this->success(['image_url' => Storage::url($path)], 'Profile image uploaded successfully');
    }

    /**
     * Change password.
     */
    public function changePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8|confirmed',
        ]);

        $user = $request->user();

        if (!Hash::check($validated['current_password'], $user->password)) {
            return $this->error('Current password is incorrect', 400);
        }

        $user->update(['password' => Hash::make($validated['new_password'])]);

        return $this->success(null, 'Password changed successfully');
    }

    /**
     * Delete user account.
     */
    public function deleteAccount(Request $request)
    {
        $request->validate([
            'password' => 'required|string',
        ]);

        $user = $request->user();

        if (!Hash::check($request->password, $user->password)) {
            return $this->error('Password is incorrect', 400);
        }

        // Delete profile image if exists
        if ($user->profile_image) {
            Storage::disk('public')->delete($user->profile_image);
        }

        // Delete user account
        $user->delete();

        return $this->success(null, 'Account deleted successfully');
    }

    /**
     * Get user statistics.
     */
    public function statistics(Request $request)
    {
        $user = $request->user();

        $stats = [
            'total_applications' => $user->jobApplications()->count(),
            'saved_jobs' => $user->savedJobs()->count(),
            'pending_applications' => $user->jobApplications()->where('status', 'pending')->count(),
            'accepted_applications' => $user->jobApplications()->where('status', 'accepted')->count(),
            'rejected_applications' => $user->jobApplications()->where('status', 'rejected')->count(),
        ];

        if ($user->isEmployer()) {
            $stats['posted_jobs'] = $user->company?->jobs()->count() ?? 0;
            $stats['active_jobs'] = $user->company?->jobs()->where('status', 'active')->count() ?? 0;
            $stats['total_applications_received'] = $user->company?->jobs()
                ->withCount('applications')
                ->get()
                ->sum('applications_count') ?? 0;
        }

        return $this->success($stats, 'Statistics retrieved successfully');
    }
}
