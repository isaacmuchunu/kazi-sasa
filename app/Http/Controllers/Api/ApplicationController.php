<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Job;
use App\Models\JobApplication;
use Illuminate\Http\Request;

class ApplicationController extends Controller
{
    /**
     * Get all applications for a specific job (employer only).
     */
    public function getJobApplications(Request $request, $jobId)
    {
        $user = $request->user();

        if (!$user->isEmployer()) {
            return $this->error('Only employers can view job applications', 403);
        }

        $job = Job::findOrFail($jobId);

        // Check if job belongs to user's company
        if ($job->company_id !== $user->company?->id) {
            return $this->error('Unauthorized', 403);
        }

        $applications = $job->applications()
            ->with(['user.candidateProfile'])
            ->when($request->status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->latest()
            ->paginate($request->per_page ?? 10);

        return $this->success($applications, 'Applications retrieved successfully');
    }

    /**
     * Get a specific application details.
     */
    public function show(Request $request, $id)
    {
        $application = JobApplication::with(['job', 'user.candidateProfile'])->findOrFail($id);
        $user = $request->user();

        // Check authorization
        if ($user->isEmployer()) {
            if ($application->job->company_id !== $user->company?->id) {
                return $this->error('Unauthorized', 403);
            }
        } elseif ($application->user_id !== $user->id) {
            return $this->error('Unauthorized', 403);
        }

        return $this->success($application, 'Application retrieved successfully');
    }

    /**
     * Update application status (employer only).
     */
    public function updateStatus(Request $request, $id)
    {
        $user = $request->user();

        if (!$user->isEmployer()) {
            return $this->error('Only employers can update application status', 403);
        }

        $application = JobApplication::with('job')->findOrFail($id);

        // Check if job belongs to user's company
        if ($application->job->company_id !== $user->company?->id) {
            return $this->error('Unauthorized', 403);
        }

        $validated = $request->validate([
            'status' => 'required|in:pending,reviewed,shortlisted,rejected,accepted',
            'notes' => 'nullable|string',
        ]);

        $application->update($validated);

        return $this->success($application, 'Application status updated successfully');
    }

    /**
     * Shortlist an application (employer only).
     */
    public function shortlist(Request $request, $id)
    {
        $user = $request->user();

        if (!$user->isEmployer()) {
            return $this->error('Only employers can shortlist applications', 403);
        }

        $application = JobApplication::with('job')->findOrFail($id);

        // Check if job belongs to user's company
        if ($application->job->company_id !== $user->company?->id) {
            return $this->error('Unauthorized', 403);
        }

        $application->update(['status' => 'shortlisted']);

        return $this->success($application, 'Application shortlisted successfully');
    }

    /**
     * Reject an application (employer only).
     */
    public function reject(Request $request, $id)
    {
        $user = $request->user();

        if (!$user->isEmployer()) {
            return $this->error('Only employers can reject applications', 403);
        }

        $application = JobApplication::with('job')->findOrFail($id);

        // Check if job belongs to user's company
        if ($application->job->company_id !== $user->company?->id) {
            return $this->error('Unauthorized', 403);
        }

        $validated = $request->validate([
            'notes' => 'nullable|string',
        ]);

        $application->update([
            'status' => 'rejected',
            'notes' => $validated['notes'] ?? null,
        ]);

        return $this->success($application, 'Application rejected successfully');
    }

    /**
     * Accept an application (employer only).
     */
    public function accept(Request $request, $id)
    {
        $user = $request->user();

        if (!$user->isEmployer()) {
            return $this->error('Only employers can accept applications', 403);
        }

        $application = JobApplication::with('job')->findOrFail($id);

        // Check if job belongs to user's company
        if ($application->job->company_id !== $user->company?->id) {
            return $this->error('Unauthorized', 403);
        }

        $validated = $request->validate([
            'notes' => 'nullable|string',
        ]);

        $application->update([
            'status' => 'accepted',
            'notes' => $validated['notes'] ?? null,
        ]);

        return $this->success($application, 'Application accepted successfully');
    }

    /**
     * Withdraw an application (candidate only).
     */
    public function withdraw(Request $request, $id)
    {
        $user = $request->user();
        $application = JobApplication::findOrFail($id);

        // Check if application belongs to the user
        if ($application->user_id !== $user->id) {
            return $this->error('Unauthorized', 403);
        }

        // Check if application can be withdrawn
        if (in_array($application->status, ['accepted', 'rejected'])) {
            return $this->error('Cannot withdraw an application that has been accepted or rejected', 400);
        }

        $application->delete();

        return $this->success(null, 'Application withdrawn successfully');
    }
}
