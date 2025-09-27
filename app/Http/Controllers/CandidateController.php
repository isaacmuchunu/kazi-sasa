<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CandidateController extends Controller
{
    /**
     * Display a listing of candidates.
     */
    public function index(Request $request)
    {
        // For now, return a simple view
        // In a real application, you would query candidates from database

        return view('candidates.index');
    }

    /**
     * Display the specified candidate.
     */
    public function show($id)
    {
        // For now, use sample data
        $candidate = (object) [
            'id' => $id,
            'name' => 'John Doe',
            'avatar' => asset('assets/img/client-1.png'),
            'title' => 'Web Developer',
            'location' => 'London, UK',
            'email' => 'john@example.com',
            'phone' => '+44 123 456 7890',
            'experience' => '5 Years',
            'skills' => ['PHP', 'Laravel', 'JavaScript', 'Vue.js'],
            'bio' => 'Experienced web developer with expertise in Laravel and Vue.js...',
            'education' => 'Bachelor of Computer Science',
            'languages' => ['English', 'Spanish']
        ];

        return view('candidates.show', compact('candidate'));
    }

    /**
     * Hire a candidate.
     */
    public function hire($id)
    {
        // For now, just redirect back with success message
        // In a real application, you would:
        // 1. Create a hiring record
        // 2. Send notifications

        return redirect()->back()->with('success', 'Hiring request sent successfully!');
    }
}