<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class BlogController extends Controller
{
    /**
     * Display a listing of blog posts.
     */
    public function index(Request $request)
    {
        // For now, return a simple view
        // In a real application, you would query blog posts from database

        return view('blog.index');
    }

    /**
     * Display blog in style two format.
     */
    public function styleTwo(Request $request)
    {
        // For now, return a simple view
        return view('blog.style-two');
    }

    /**
     * Display the specified blog post.
     */
    public function show($id)
    {
        // For now, use sample data
        $post = (object) [
            'id' => $id,
            'title' => 'How to Find Your Dream Job',
            'slug' => 'how-to-find-your-dream-job',
            'content' => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
            'excerpt' => 'Tips and strategies for finding your perfect career opportunity.',
            'image' => asset('assets/img/blog/1.jpg'),
            'author' => 'Jane Smith',
            'published_at' => now()->subDays(3),
            'tags' => ['Career', 'Job Search', 'Tips']
        ];

        return view('blog.show', compact('post'));
    }
}