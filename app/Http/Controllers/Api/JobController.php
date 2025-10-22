<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Job;
use App\Models\JobApplication;
use App\Models\SavedJob;
use Illuminate\Http\Request;

class JobController extends Controller
{
    /**
     * Display a listing of jobs.
     */
    public function index(Request $request)
    {
        $jobs = Job::with(['company', 'category'])
            ->active()
            ->when($request->search, function ($query, $search) {
                $query->where(function($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->when($request->location, function ($query, $location) {
                $query->where('location', 'like', "%{$location}%");
            })
            ->when($request->type, function ($query, $type) {
                $query->where('job_type', $type);
            })
            ->when($request->category, function ($query, $category) {
                $query->whereHas('category', function($q) use ($category) {
                    $q->where('name', $category);
                });
            })
            ->when($request->featured, function ($query) {
                $query->where('is_featured', true);
            })
            ->when($request->urgent, function ($query) {
                $query->where('is_urgent', true);
            })
            ->orderBy('is_featured', 'desc')
            ->latest()
            ->paginate($request->per_page ?? 10);

        return $this->success($jobs, 'Jobs retrieved successfully');
    }

    /**
     * Display the specified job.
     */
    public function show($id)
    {
        $job = Job::with(['company', 'category'])->findOrFail($id);

        // Increment view count
        $job->increment('views_count');

        return $this->success($job, 'Job retrieved successfully');
    }

    /**
     * Get related jobs.
     */
    public function related($id)
    {
        $job = Job::findOrFail($id);
        
        $relatedJobs = Job::with(['company', 'category'])
            ->where('job_category_id', $job->job_category_id)
            ->where('id', '!=', $id)
            ->active()
            ->take(5)
            ->get();

        return $this->success($relatedJobs, 'Related jobs retrieved successfully');
    }

    /**
     * Apply for a job.
     */
    public function apply(Request $request, $id)
    {
        $job = Job::findOrFail($id);

        // Check if job is still active
        if ($job->status !== 'active') {
            return $this->error('This job is no longer accepting applications.', 400);
        }

        // Check if user has already applied
        $existingApplication = JobApplication::where('job_id', $id)
            ->where('user_id', $request->user()->id)
            ->first();

        if ($existingApplication) {
            return $this->error('You have already applied for this job.', 400);
        }

        $application = JobApplication::create([
            'job_id' => $id,
            'user_id' => $request->user()->id,
            'applied_at' => now(),
        ]);

        // Increment application count
        $job->increment('applications_count');

        return $this->success($application, 'Application submitted successfully!');
    }

    /**
     * Save a job to user's saved jobs.
     */
    public function save(Request $request, $id)
    {
        $job = Job::findOrFail($id);

        // Check if job isn't already saved
        $existingSavedJob = SavedJob::where('job_id', $id)
            ->where('user_id', $request->user()->id)
            ->first();

        if ($existingSavedJob) {
            return $this->error('Job is already saved.', 400);
        }

        $savedJob = SavedJob::create([
            'job_id' => $id,
            'user_id' => $request->user()->id,
            'saved_at' => now(),
        ]);

        return $this->success($savedJob, 'Job saved successfully!');
    }

    /**
     * Remove a job from user's saved jobs.
     */
    public function unsave(Request $request, $id)
    {
        $savedJob = SavedJob::where('job_id', $id)
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$savedJob) {
            return $this->error('Job was not saved.', 400);
        }

        $savedJob->delete();

        return $this->success(null, 'Job removed from saved jobs!');
    }

    /**
     * Get user's saved jobs.
     */
    public function savedJobs(Request $request)
    {
        $savedJobs = SavedJob::with(['job.company', 'job.category'])
            ->where('user_id', $request->user()->id)
            ->latest()
            ->paginate($request->per_page ?? 10);

        return $this->success($savedJobs, 'Saved jobs retrieved successfully');
    }

    /**
     * Get user's applied jobs.
     */
    public function appliedJobs(Request $request)
    {
        $appliedJobs = JobApplication::with(['job.company', 'job.category'])
            ->where('user_id', $request->user()->id)
            ->latest()
            ->paginate($request->per_page ?? 10);

        return $this->success($appliedJobs, 'Applied jobs retrieved successfully');
    }
}