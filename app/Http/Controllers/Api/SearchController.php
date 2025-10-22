<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Job;
use App\Models\JobCategory;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    /**
     * Search jobs.
     */
    public function jobs(Request $request)
    {
        $jobs = Job::with(['company', 'category'])
            ->active()
            ->when($request->q, function ($query, $search) {
                $query->where(function($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%")
                      ->orWhere('location', 'like', "%{$search}%");
                });
            })
            ->when($request->category, function ($query, $category) {
                $query->whereHas('category', function($q) use ($category) {
                    $q->where('name', $category);
                });
            })
            ->when($request->type, function ($query, $type) {
                $query->where('job_type', $type);
            })
            ->limit(20)
            ->get();

        return $this->success([
            'jobs' => $jobs,
            'total' => $jobs->count()
        ], 'Jobs search completed successfully');
    }

    /**
     * Search locations.
     */
    public function locations(Request $request)
    {
        // Get unique locations from jobs
        $locations = Job::active()
            ->where('location', 'like', "%{$request->q}%")
            ->select('location')
            ->distinct()
            ->limit(20)
            ->pluck('location');

        return $this->success($locations, 'Locations search completed successfully');
    }

    /**
     * Search categories.
     */
    public function categories(Request $request)
    {
        $categories = JobCategory::where('name', 'like', "%{$request->q}%")
            ->select('id', 'name', 'icon')
            ->limit(20)
            ->get();

        return $this->success($categories, 'Categories search completed successfully');
    }
}