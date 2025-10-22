<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\Job;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class EmployerController extends Controller
{
    /**
     * Get employer's company profile.
     */
    public function getCompany(Request $request)
    {
        $user = $request->user();

        if (!$user->isEmployer()) {
            return $this->error('Only employers can access this endpoint', 403);
        }

        $company = $user->company()->with('jobs')->first();

        if (!$company) {
            return $this->error('Company profile not found. Please create one.', 404);
        }

        return $this->success($company, 'Company retrieved successfully');
    }

    /**
     * Create company profile.
     */
    public function createCompany(Request $request)
    {
        $user = $request->user();

        if (!$user->isEmployer()) {
            return $this->error('Only employers can create companies', 403);
        }

        if ($user->company) {
            return $this->error('Company already exists', 400);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'website' => 'nullable|url',
            'industry' => 'required|string|max:255',
            'size' => 'required|string|max:50',
            'location' => 'required|string|max:255',
        ]);

        $validated['user_id'] = $user->id;
        $validated['slug'] = Str::slug($validated['name']);

        $company = Company::create($validated);

        return $this->success($company, 'Company created successfully', 201);
    }

    /**
     * Update company profile.
     */
    public function updateCompany(Request $request)
    {
        $user = $request->user();

        if (!$user->isEmployer()) {
            return $this->error('Only employers can update companies', 403);
        }

        $company = $user->company;

        if (!$company) {
            return $this->error('Company not found', 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'website' => 'nullable|url',
            'industry' => 'sometimes|string|max:255',
            'size' => 'sometimes|string|max:50',
            'location' => 'sometimes|string|max:255',
        ]);

        if (isset($validated['name'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $company->update($validated);

        return $this->success($company, 'Company updated successfully');
    }

    /**
     * Upload company logo.
     */
    public function uploadLogo(Request $request)
    {
        $user = $request->user();

        if (!$user->isEmployer()) {
            return $this->error('Only employers can upload logos', 403);
        }

        $company = $user->company;

        if (!$company) {
            return $this->error('Company not found', 404);
        }

        $request->validate([
            'logo' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        // Delete old logo if exists
        if ($company->logo) {
            Storage::disk('public')->delete($company->logo);
        }

        // Store new logo
        $path = $request->file('logo')->store('company-logos', 'public');
        $company->update(['logo' => $path]);

        return $this->success(['logo_url' => Storage::url($path)], 'Logo uploaded successfully');
    }

    /**
     * Create a new job posting.
     */
    public function createJob(Request $request)
    {
        $user = $request->user();

        if (!$user->isEmployer()) {
            return $this->error('Only employers can create jobs', 403);
        }

        $company = $user->company;

        if (!$company) {
            return $this->error('Please create a company profile first', 400);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'job_category_id' => 'required|exists:job_categories,id',
            'description' => 'required|string',
            'location' => 'required|string|max:255',
            'job_type' => 'required|in:full-time,part-time,contract,freelance,internship',
            'experience_level' => 'required|in:entry,mid,senior,executive',
            'salary_min' => 'nullable|numeric|min:0',
            'salary_max' => 'nullable|numeric|min:0',
            'salary_period' => 'nullable|in:hour,day,week,month,year',
            'apply_deadline' => 'nullable|date|after:today',
            'skills_required' => 'nullable|array',
            'tags' => 'nullable|array',
            'is_featured' => 'sometimes|boolean',
            'is_urgent' => 'sometimes|boolean',
        ]);

        $validated['company_id'] = $company->id;
        $validated['slug'] = Str::slug($validated['title']) . '-' . Str::random(6);
        $validated['status'] = 'active';

        $job = Job::create($validated);

        return $this->success($job, 'Job created successfully', 201);
    }

    /**
     * Update a job posting.
     */
    public function updateJob(Request $request, $id)
    {
        $user = $request->user();

        if (!$user->isEmployer()) {
            return $this->error('Only employers can update jobs', 403);
        }

        $job = Job::findOrFail($id);

        // Check if job belongs to user's company
        if ($job->company_id !== $user->company?->id) {
            return $this->error('Unauthorized', 403);
        }

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'job_category_id' => 'sometimes|exists:job_categories,id',
            'description' => 'sometimes|string',
            'location' => 'sometimes|string|max:255',
            'job_type' => 'sometimes|in:full-time,part-time,contract,freelance,internship',
            'experience_level' => 'sometimes|in:entry,mid,senior,executive',
            'salary_min' => 'nullable|numeric|min:0',
            'salary_max' => 'nullable|numeric|min:0',
            'salary_period' => 'nullable|in:hour,day,week,month,year',
            'apply_deadline' => 'nullable|date|after:today',
            'skills_required' => 'nullable|array',
            'tags' => 'nullable|array',
            'status' => 'sometimes|in:active,inactive,closed',
            'is_featured' => 'sometimes|boolean',
            'is_urgent' => 'sometimes|boolean',
        ]);

        $job->update($validated);

        return $this->success($job, 'Job updated successfully');
    }

    /**
     * Delete a job posting.
     */
    public function deleteJob(Request $request, $id)
    {
        $user = $request->user();

        if (!$user->isEmployer()) {
            return $this->error('Only employers can delete jobs', 403);
        }

        $job = Job::findOrFail($id);

        // Check if job belongs to user's company
        if ($job->company_id !== $user->company?->id) {
            return $this->error('Unauthorized', 403);
        }

        $job->delete();

        return $this->success(null, 'Job deleted successfully');
    }

    /**
     * Get all jobs posted by employer's company.
     */
    public function getJobs(Request $request)
    {
        $user = $request->user();

        if (!$user->isEmployer()) {
            return $this->error('Only employers can access this endpoint', 403);
        }

        $company = $user->company;

        if (!$company) {
            return $this->error('Company not found', 404);
        }

        $jobs = $company->jobs()
            ->with('category')
            ->withCount('applications')
            ->when($request->status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->latest()
            ->paginate($request->per_page ?? 10);

        return $this->success($jobs, 'Jobs retrieved successfully');
    }

    /**
     * Get employer dashboard statistics.
     */
    public function getDashboard(Request $request)
    {
        $user = $request->user();

        if (!$user->isEmployer()) {
            return $this->error('Only employers can access this endpoint', 403);
        }

        $company = $user->company;

        if (!$company) {
            return $this->error('Company not found', 404);
        }

        $stats = [
            'total_jobs' => $company->jobs()->count(),
            'active_jobs' => $company->jobs()->where('status', 'active')->count(),
            'total_applications' => $company->jobs()->withCount('applications')->get()->sum('applications_count'),
            'pending_applications' => $company->jobs()
                ->join('job_applications', 'jobs.id', '=', 'job_applications.job_id')
                ->where('job_applications.status', 'pending')
                ->count(),
            'recent_applications' => $company->jobs()
                ->join('job_applications', 'jobs.id', '=', 'job_applications.job_id')
                ->with(['user'])
                ->latest('job_applications.created_at')
                ->limit(5)
                ->get(),
        ];

        return $this->success($stats, 'Dashboard data retrieved successfully');
    }
}
