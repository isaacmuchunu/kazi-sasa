<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class AdminBlogController extends Controller
{
    /**
     * Get all blog posts with filtering.
     */
    public function index(Request $request): JsonResponse
    {
        $blogs = Blog::query()
            ->with('author:id,first_name,last_name')
            ->withCount('comments')
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                        ->orWhere('excerpt', 'like', "%{$search}%");
                });
            })
            ->when($request->status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($request->category, function ($query, $category) {
                $query->where('category', $category);
            })
            ->when($request->author_id, function ($query, $authorId) {
                $query->where('author_id', $authorId);
            })
            ->when($request->sort_by, function ($query, $sortBy) use ($request) {
                $direction = $request->get('sort_direction', 'desc');
                $query->orderBy($sortBy, $direction);
            }, function ($query) {
                $query->latest();
            })
            ->paginate($request->per_page ?? 15);

        return $this->success($blogs, 'Blog posts retrieved successfully');
    }

    /**
     * Get a specific blog post.
     */
    public function show($id): JsonResponse
    {
        $blog = Blog::with([
            'author',
            'comments' => function ($query) {
                $query->with('user:id,first_name,last_name')->latest()->take(10);
            }
        ])->withCount('comments')->findOrFail($id);

        return $this->success($blog, 'Blog post retrieved successfully');
    }

    /**
     * Create a new blog post.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'excerpt' => 'required|string|max:500',
            'content' => 'required|string',
            'category' => 'required|string|max:100',
            'tags' => 'nullable|array',
            'featured_image' => 'nullable|string|max:255',
            'status' => 'sometimes|in:draft,published,archived',
        ]);

        $validated['author_id'] = auth()->id();
        $validated['slug'] = Str::slug($validated['title']) . '-' . Str::random(6);
        $validated['status'] = $validated['status'] ?? 'draft';

        if ($validated['status'] === 'published') {
            $validated['published_at'] = now();
        }

        $blog = Blog::create($validated);

        return $this->success($blog, 'Blog post created successfully', 201);
    }

    /**
     * Update a blog post.
     */
    public function update(Request $request, $id): JsonResponse
    {
        $blog = Blog::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'excerpt' => 'sometimes|string|max:500',
            'content' => 'sometimes|string',
            'category' => 'sometimes|string|max:100',
            'tags' => 'nullable|array',
            'featured_image' => 'nullable|string|max:255',
            'status' => 'sometimes|in:draft,published,archived',
        ]);

        if (isset($validated['title'])) {
            $validated['slug'] = Str::slug($validated['title']) . '-' . Str::random(6);
        }

        // Handle publishing
        if (isset($validated['status']) && $validated['status'] === 'published' && !$blog->published_at) {
            $validated['published_at'] = now();
        }

        $blog->update($validated);

        return $this->success($blog->fresh(), 'Blog post updated successfully');
    }

    /**
     * Publish a blog post.
     */
    public function publish($id): JsonResponse
    {
        $blog = Blog::findOrFail($id);

        if ($blog->status === 'published') {
            return $this->error('Blog post is already published', 400);
        }

        $blog->update([
            'status' => 'published',
            'published_at' => now(),
        ]);

        return $this->success($blog, 'Blog post published successfully');
    }

    /**
     * Delete a blog post.
     */
    public function destroy($id): JsonResponse
    {
        $blog = Blog::findOrFail($id);

        // Delete featured image if exists
        if ($blog->featured_image) {
            Storage::disk('public')->delete($blog->featured_image);
        }

        // Delete associated comments
        $blog->comments()->delete();
        $blog->delete();

        return $this->success(null, 'Blog post deleted successfully');
    }
}
