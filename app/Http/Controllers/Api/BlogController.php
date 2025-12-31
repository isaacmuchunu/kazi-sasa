<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BlogController extends Controller
{
    /**
     * Get all published blog posts
     */
    public function index(Request $request)
    {
        $blogs = Blog::published()
            ->with('author')
            ->withCount('comments')
            ->when($request->category, function($query, $category) {
                $query->where('category', $category);
            })
            ->when($request->search, function($query, $search) {
                $query->where('title', 'like', "%{$search}%")
                      ->orWhere('excerpt', 'like', "%{$search}%");
            })
            ->latest('published_at')
            ->paginate($request->per_page ?? 10);

        return $this->success($blogs, 'Blog posts retrieved successfully');
    }

    /**
     * Get a single blog post by slug
     */
    public function show($slug)
    {
        $blog = Blog::where('slug', $slug)
            ->published()
            ->with(['author', 'comments.user', 'comments.replies'])
            ->firstOrFail();

        // Increment views
        $blog->increment('views_count');

        return $this->success($blog, 'Blog post retrieved successfully');
    }

    /**
     * Get blog categories
     */
    public function categories()
    {
        $categories = Blog::published()
            ->select('category')
            ->groupBy('category')
            ->get()
            ->pluck('category');

        return $this->success($categories, 'Categories retrieved successfully');
    }

    /**
     * Add comment to blog post
     */
    public function addComment(Request $request, $blogId)
    {
        $validated = $request->validate([
            'comment' => 'required|string',
            'parent_id' => 'nullable|exists:comments,id',
        ]);

        $validated['user_id'] = $request->user()->id;
        $validated['blog_id'] = $blogId;

        $comment = Comment::create($validated);

        return $this->success($comment->load('user'), 'Comment added successfully', 201);
    }

    /**
     * Get comments for a blog post
     */
    public function getComments($blogId)
    {
        $comments = Comment::where('blog_id', $blogId)
            ->whereNull('parent_id')
            ->approved()
            ->with(['user', 'replies'])
            ->latest()
            ->get();

        return $this->success($comments, 'Comments retrieved successfully');
    }
}
