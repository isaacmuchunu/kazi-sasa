<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class JobController extends Controller
{
    /**
     * Display a listing of jobs.
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
        // For now, we'll use sample data since there's no Job model yet
        // In a real application, you would query the database like this:
        // $jobs = Job::query()
        //     ->when($request->search, function ($query, $search) {
        //         $query->where('title', 'like', "%{$search}%")
        //               ->orWhere('description', 'like', "%{$search}%");
        //     })
        //     ->when($request->location, function ($query, $location) {
        //         $query->where('location', 'like', "%{$location}%");
        //     })
        //     ->when($request->type, function ($query, $type) {
        //         $query->where('type', $type);
        //     })
        //     ->when($request->category, function ($query, $category) {
        //         $query->where('category', $category);
        //     })
        //     ->latest()
        //     ->paginate(10);

        $jobs = collect(); // Empty collection for now

        return view('jobs.list', compact('jobs'));
    }

    /**
     * Display jobs in grid format.
     */
    public function grid(Request $request)
    {
        // For now, we'll use sample data since there's no Job model yet
        $jobs = collect(); // Empty collection for now

        return view('jobs.grid', compact('jobs'));
    }

    /**
     * Display the specified job.
     */
    public function show($id)
    {
        // For now, we'll use sample data since there's no Job model yet
        // In a real application, you would do:
        // $job = Job::findOrFail($id);

        $job = (object) [
            'id' => $id,
            'title' => 'Web Designer, Graphic Designer, UI/UX Designer',
            'company_name' => 'Tourt Design LTD',
            'company_logo' => 'https://via.placeholder.com/80x80/3b82f6/ffffff?text=TD',
            'location' => 'Wellesley Rd, London',
            'category' => 'Accountancy',
            'employment_type' => 'Freelance',
            'type' => 'Full Time',
            'salary_range' => '$35,000-$38,000',
            'experience' => '2 Years',
            'language' => 'English',
            'contact_email' => 'hello@company.com',
            'company_website' => 'www.company.com',
            'deadline' => now()->addDays(30),
            'description' => '<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into essentially unchanged.</p><p>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don\'t look even slightly believable.</p>',
            'requirements' => null,
            'skills' => ['Web Design', 'UI/UX', 'Photoshop', 'Figma'],
            'posted_by_name' => 'John Doe',
            'posted_by_title' => 'CEO of Tourt Design LTD',
            'posted_by_avatar' => 'https://via.placeholder.com/80x80/667eea/ffffff?text=JD',
            'latitude' => 40.697670063539654,
            'longitude' => -74.25987556253516,
            'created_at' => now()->subDays(5)
        ];

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
            'salary_range' => 'nullable|string|max:255',
            'type' => 'required|in:full-time,part-time,contract,freelance',
            'category' => 'required|string|max:255',
            'experience' => 'nullable|string|max:255',
            'deadline' => 'required|date|after:today',
        ]);

        // For now, just redirect back with success message
        // In a real application, you would create the job:
        // $job = Job::create($request->all());

        return redirect()->route('jobs.list')->with('success', 'Job posted successfully!');
    }

    /**
     * Show the form for editing the specified job.
     */
    public function edit($id)
    {
        // For now, we'll use sample data
        $job = (object) [
            'id' => $id,
            'title' => 'Web Designer, Graphic Designer, UI/UX Designer',
            'description' => 'Lorem ipsum dolor sit amet...',
            'location' => 'Wellesley Rd, London',
            'salary_range' => '$35,000-$38,000',
            'type' => 'full-time',
            'category' => 'Design',
            'experience' => '2 Years',
            'deadline' => now()->addDays(30)->format('Y-m-d'),
        ];

        return view('jobs.edit', compact('job'));
    }

    /**
     * Update the specified job in storage.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'location' => 'required|string|max:255',
            'salary_range' => 'nullable|string|max:255',
            'type' => 'required|in:full-time,part-time,contract,freelance',
            'category' => 'required|string|max:255',
            'experience' => 'nullable|string|max:255',
            'deadline' => 'required|date|after:today',
        ]);

        // For now, just redirect back with success message
        // In a real application, you would update the job:
        // $job = Job::findOrFail($id);
        // $job->update($request->all());

        return redirect()->route('jobs.show', $id)->with('success', 'Job updated successfully!');
    }

    /**
     * Remove the specified job from storage.
     */
    public function destroy($id)
    {
        // For now, just redirect back with success message
        // In a real application, you would delete the job:
        // $job = Job::findOrFail($id);
        // $job->delete();

        return redirect()->route('jobs.list')->with('success', 'Job deleted successfully!');
    }

    /**
     * Apply for a job.
     */
    public function apply($id)
    {
        // For now, just redirect back with success message
        // In a real application, you would:
        // 1. Check if user hasn't already applied
        // 2. Create a job application record
        // 3. Send notification to employer

        return redirect()->route('jobs.show', $id)->with('success', 'Application submitted successfully!');
    }

    /**
     * Save a job to user's saved jobs.
     */
    public function save($id)
    {
        // For now, just redirect back with success message
        // In a real application, you would:
        // 1. Check if job isn't already saved
        // 2. Create a saved job record

        return redirect()->back()->with('success', 'Job saved successfully!');
    }

    /**
     * Remove a job from user's saved jobs.
     */
    public function unsave($id)
    {
        // For now, just redirect back with success message
        // In a real application, you would:
        // 1. Find and delete the saved job record

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
        // For now, return empty results
        // In a real application, you would search jobs and return JSON

        return response()->json([
            'jobs' => [],
            'total' => 0
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