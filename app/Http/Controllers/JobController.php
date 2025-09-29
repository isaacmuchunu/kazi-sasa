<?php

namespace App\Http\Controllers;

use App\Models\Job;
use App\Models\JobCategory;
use App\Models\Company;
use App\Models\JobApplication;
use App\Models\SavedJob;

class JobController extends Controller
{
    /**
     * Display a listing of jobs.
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        return $this->list($request);
    }

    /**
     * Display jobs in list format.
     */
    public function list(Request $request)
    {
        $jobs = Job::query()
            ->with(['company', 'category'])
            ->when($request->search, function ($query, $search) {
                $query->where('title', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
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
            ->where('status', 'active')
            ->latest()
            ->paginate(10);

        return view('jobs.list', compact('jobs'));
    }

    /**
     * Display jobs in grid format.
     */
    public function grid(Request $request)
    {
        $jobs = Job::query()
            ->with(['company', 'category'])
            ->when($request->search, function ($query, $search) {
                $query->where('title', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
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
            ->where('status', 'active')
            ->latest()
            ->paginate(12);

        return view('jobs.grid', compact('jobs'));
    }

    /**
     * Display the specified job.
     */
    public function show($id)
    {
        $job = Job::with(['company', 'category'])->findOrFail($id);

        // Increment view count
        $job->increment('views_count');

        return view('jobs.show', compact('job'));
    }

    /**
     * Show the form for creating a new job.
     */
    public function create()
    {
        return view('jobs.create');
    }

    /**
     * Store a newly created job in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'location' => 'required|string|max:255',
            'job_type' => 'required|in:full-time,part-time,freelance,contract',
            'experience_level' => 'required|in:entry,mid,senior,executive',
            'salary_min' => 'nullable|numeric|min:0',
            'salary_max' => 'nullable|numeric|min:0',
            'salary_period' => 'required|in:monthly,yearly,hourly',
            'apply_deadline' => 'required|date|after:today',
            'job_category_id' => 'required|exists:job_categories,id',
            'skills_required' => 'nullable|array',
            'tags' => 'nullable|array',
        ]);

        $job = Job::create([
            'title' => $request->title,
            'slug' => \Str::slug($request->title),
            'company_id' => auth()->id(), // Assuming the user is the company owner
            'job_category_id' => $request->job_category_id,
            'description' => $request->description,
            'location' => $request->location,
            'job_type' => $request->job_type,
            'experience_level' => $request->experience_level,
            'salary_min' => $request->salary_min,
            'salary_max' => $request->salary_max,
            'salary_period' => $request->salary_period,
            'apply_deadline' => $request->apply_deadline,
            'skills_required' => $request->skills_required,
            'tags' => $request->tags,
        ]);

        return redirect()->route('jobs.show', $job)->with('success', 'Job posted successfully!');
    }

    /**
     * Show the form for editing the specified job.
     */
    public function edit($id)
    {
        $job = Job::findOrFail($id);

        // Check if user owns this job
        if ($job->company_id !== auth()->id()) {
            abort(403);
        }

        return view('jobs.edit', compact('job'));
    }

    /**
     * Update the specified job in storage.
     */
    public function update(Request $request, $id)
    {
        $job = Job::findOrFail($id);

        // Check if user owns this job
        if ($job->company_id !== auth()->id()) {
            abort(403);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'location' => 'required|string|max:255',
            'job_type' => 'required|in:full-time,part-time,freelance,contract',
            'experience_level' => 'required|in:entry,mid,senior,executive',
            'salary_min' => 'nullable|numeric|min:0',
            'salary_max' => 'nullable|numeric|min:0',
            'salary_period' => 'required|in:monthly,yearly,hourly',
            'apply_deadline' => 'required|date|after:today',
            'job_category_id' => 'required|exists:job_categories,id',
            'skills_required' => 'nullable|array',
            'tags' => 'nullable|array',
        ]);

        $job->update([
            'title' => $request->title,
            'slug' => \Str::slug($request->title),
            'job_category_id' => $request->job_category_id,
            'description' => $request->description,
            'location' => $request->location,
            'job_type' => $request->job_type,
            'experience_level' => $request->experience_level,
            'salary_min' => $request->salary_min,
            'salary_max' => $request->salary_max,
            'salary_period' => $request->salary_period,
            'apply_deadline' => $request->apply_deadline,
            'skills_required' => $request->skills_required,
            'tags' => $request->tags,
        ]);

        return redirect()->route('jobs.show', $job)->with('success', 'Job updated successfully!');
    }

    /**
     * Remove the specified job from storage.
     */
    public function destroy($id)
    {
        $job = Job::findOrFail($id);

        // Check if user owns this job
        if ($job->company_id !== auth()->id()) {
            abort(403);
        }

        $job->delete();

        return redirect()->route('jobs.list')->with('success', 'Job deleted successfully!');
    }

    /**
     * Apply for a job.
     */
    public function apply($id)
    {
        $job = Job::findOrFail($id);

        // Check if job is still active
        if ($job->status !== 'active') {
            return redirect()->back()->with('error', 'This job is no longer accepting applications.');
        }

        // Check if user has already applied
        $existingApplication = JobApplication::where('job_id', $id)
            ->where('user_id', auth()->id())
            ->first();

        if ($existingApplication) {
            return redirect()->back()->with('error', 'You have already applied for this job.');
        }

        JobApplication::create([
            'job_id' => $id,
            'user_id' => auth()->id(),
            'applied_at' => now(),
        ]);

        // Increment application count
        $job->increment('applications_count');

        return redirect()->route('jobs.show', $id)->with('success', 'Application submitted successfully!');
    }

    /**
     * Save a job to user's saved jobs.
     */
    public function save($id)
    {
        $job = Job::findOrFail($id);

        // Check if job isn't already saved
        $existingSavedJob = SavedJob::where('job_id', $id)
            ->where('user_id', auth()->id())
            ->first();

        if ($existingSavedJob) {
            return redirect()->back()->with('error', 'Job is already saved.');
        }

        SavedJob::create([
            'job_id' => $id,
            'user_id' => auth()->id(),
            'saved_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Job saved successfully!');
    }

    /**
     * Remove a job from user's saved jobs.
     */
    public function unsave($id)
    {
        $savedJob = SavedJob::where('job_id', $id)
            ->where('user_id', auth()->id())
            ->first();

        if (!$savedJob) {
            return redirect()->back()->with('error', 'Job was not saved.');
        }

        $savedJob->delete();

        return redirect()->back()->with('success', 'Job removed from saved jobs!');
    }
    /**
     * Search jobs.
     */
    public function search(Request $request)
    {
        return $this->list($request);
    }

    /**
     * Get jobs by category.
     */
    public function byCategory($category, Request $request)
    {
        $request->merge(['category' => $category]);
        return $this->list($request);
    }

    /**
     * API search for AJAX requests.
     */
    public function apiSearch(Request $request)
    {
        $jobs = Job::query()
            ->with(['company', 'category'])
            ->when($request->search, function ($query, $search) {
                $query->where('title', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
            })
            ->where('status', 'active')
            ->limit(20)
            ->get();

        return response()->json([
            'jobs' => $jobs,
            'total' => $jobs->count()
        ]);
    }

    /**
     * API location search for autocomplete.
     */
    public function locationSearch(Request $request)
    {
        // For now, return sample locations
        $locations = [
            'London, UK',
            'New York, USA',
            'San Francisco, USA',
            'Berlin, Germany',
            'Toronto, Canada',
            'Sydney, Australia'
        ];

        $search = $request->get('q', '');
        $filtered = array_filter($locations, function($location) use ($search) {
            return stripos($location, $search) !== false;
        });

        return response()->json(array_values($filtered));
    }
}