<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\CandidateProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CandidateController extends Controller
{
    /**
     * Display a listing of candidates.
     */
    public function index(Request $request)
    {
        $candidates = User::with('candidateProfile')
            ->where('user_type', 'candidate')
            ->whereHas('candidateProfile', function ($query) {
                $query->where('is_public', true);
            })
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%")
                        ->orWhere('job_title', 'like', "%{$search}%");
                });
            })
            ->when($request->location, function ($query, $location) {
                $query->where('location', 'like', "%{$location}%");
            })
            ->when($request->skills, function ($query, $skills) {
                $query->whereHas('candidateProfile', function ($q) use ($skills) {
                    $q->whereJsonContains('skills', $skills);
                });
            })
            ->when($request->experience_years, function ($query, $years) {
                $query->where('experience_years', '>=', $years);
            })
            ->latest()
            ->paginate($request->per_page ?? 10);

        return $this->success($candidates, 'Candidates retrieved successfully');
    }

    /**
     * Display the specified candidate.
     */
    public function show($username)
    {
        $candidate = User::with('candidateProfile')
            ->where('user_name', $username)
            ->where('user_type', 'candidate')
            ->firstOrFail();

        // Check if profile is public or if it's the authenticated user
        if (!$candidate->candidateProfile?->is_public) {
            if (!auth()->check() || auth()->id() !== $candidate->id) {
                return $this->error('This profile is private', 403);
            }
        }

        return $this->success($candidate, 'Candidate profile retrieved successfully');
    }

    /**
     * Get or create candidate profile for authenticated user.
     */
    public function getProfile(Request $request)
    {
        $user = $request->user();

        if (!$user->isCandidate()) {
            return $this->error('Only candidates can access this endpoint', 403);
        }

        $profile = $user->candidateProfile ?? CandidateProfile::create(['user_id' => $user->id]);

        return $this->success($profile, 'Profile retrieved successfully');
    }

    /**
     * Update candidate profile.
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        if (!$user->isCandidate()) {
            return $this->error('Only candidates can update this profile', 403);
        }

        $validated = $request->validate([
            'skills' => 'sometimes|array',
            'experience' => 'sometimes|array',
            'education' => 'sometimes|array',
            'certifications' => 'sometimes|array',
            'portfolio_url' => 'sometimes|url|nullable',
            'linkedin_url' => 'sometimes|url|nullable',
            'github_url' => 'sometimes|url|nullable',
            'is_public' => 'sometimes|boolean',
        ]);

        $profile = $user->candidateProfile ?? CandidateProfile::create(['user_id' => $user->id]);
        $profile->update($validated);

        return $this->success($profile, 'Profile updated successfully');
    }

    /**
     * Upload resume.
     */
    public function uploadResume(Request $request)
    {
        $user = $request->user();

        if (!$user->isCandidate()) {
            return $this->error('Only candidates can upload resumes', 403);
        }

        $request->validate([
            'resume' => 'required|file|mimes:pdf,doc,docx|max:5120', // 5MB max
        ]);

        $profile = $user->candidateProfile ?? CandidateProfile::create(['user_id' => $user->id]);

        // Delete old resume if exists
        if ($profile->resume) {
            Storage::disk('public')->delete($profile->resume);
        }

        // Store new resume
        $path = $request->file('resume')->store('resumes', 'public');
        $profile->update(['resume' => $path]);

        return $this->success(['resume_url' => Storage::url($path)], 'Resume uploaded successfully');
    }

    /**
     * Delete resume.
     */
    public function deleteResume(Request $request)
    {
        $user = $request->user();

        if (!$user->isCandidate()) {
            return $this->error('Only candidates can delete resumes', 403);
        }

        $profile = $user->candidateProfile;

        if (!$profile || !$profile->resume) {
            return $this->error('No resume found', 404);
        }

        // Delete resume file
        Storage::disk('public')->delete($profile->resume);
        $profile->update(['resume' => null]);

        return $this->success(null, 'Resume deleted successfully');
    }
}
