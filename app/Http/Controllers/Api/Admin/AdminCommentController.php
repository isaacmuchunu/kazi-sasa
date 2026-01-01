<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AdminCommentController extends Controller
{
    /**
     * Get all comments with filtering.
     */
    public function index(Request $request): JsonResponse
    {
        $comments = Comment::query()
            ->with(['user:id,first_name,last_name', 'blog:id,title'])
            ->when($request->status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($request->blog_id, function ($query, $blogId) {
                $query->where('blog_id', $blogId);
            })
            ->when($request->search, function ($query, $search) {
                $query->where('comment', 'like', "%{$search}%");
            })
            ->when($request->sort_by, function ($query, $sortBy) use ($request) {
                $direction = $request->get('sort_direction', 'desc');
                $query->orderBy($sortBy, $direction);
            }, function ($query) {
                $query->latest();
            })
            ->paginate($request->per_page ?? 15);

        return $this->success($comments, 'Comments retrieved successfully');
    }

    /**
     * Get pending comments.
     */
    public function pending(Request $request): JsonResponse
    {
        $comments = Comment::query()
            ->with(['user:id,first_name,last_name', 'blog:id,title'])
            ->where('status', 'pending')
            ->latest()
            ->paginate($request->per_page ?? 15);

        return $this->success($comments, 'Pending comments retrieved successfully');
    }

    /**
     * Approve a comment.
     */
    public function approve($id): JsonResponse
    {
        $comment = Comment::findOrFail($id);

        if ($comment->status === 'approved') {
            return $this->error('Comment is already approved', 400);
        }

        $comment->update(['status' => 'approved']);

        return $this->success($comment, 'Comment approved successfully');
    }

    /**
     * Reject a comment.
     */
    public function reject(Request $request, $id): JsonResponse
    {
        $comment = Comment::findOrFail($id);

        $comment->update(['status' => 'rejected']);

        return $this->success($comment, 'Comment rejected');
    }

    /**
     * Delete a comment.
     */
    public function destroy($id): JsonResponse
    {
        $comment = Comment::findOrFail($id);

        // Also delete replies
        Comment::where('parent_id', $id)->delete();
        $comment->delete();

        return $this->success(null, 'Comment deleted successfully');
    }
}
