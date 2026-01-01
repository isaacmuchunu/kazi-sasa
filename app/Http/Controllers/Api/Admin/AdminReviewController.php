<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AdminReviewController extends Controller
{
    /**
     * Get all reviews with filtering.
     */
    public function index(Request $request): JsonResponse
    {
        $reviews = Review::query()
            ->with(['reviewer:id,first_name,last_name', 'reviewee:id,first_name,last_name'])
            ->when($request->status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($request->reviewee_type, function ($query, $type) {
                $query->where('reviewee_type', $type);
            })
            ->when($request->min_rating, function ($query, $rating) {
                $query->where('rating', '>=', $rating);
            })
            ->when($request->sort_by, function ($query, $sortBy) use ($request) {
                $direction = $request->get('sort_direction', 'desc');
                $query->orderBy($sortBy, $direction);
            }, function ($query) {
                $query->latest();
            })
            ->paginate($request->per_page ?? 15);

        return $this->success($reviews, 'Reviews retrieved successfully');
    }

    /**
     * Get pending reviews.
     */
    public function pending(Request $request): JsonResponse
    {
        $reviews = Review::query()
            ->with(['reviewer:id,first_name,last_name', 'reviewee:id,first_name,last_name'])
            ->where('status', 'pending')
            ->latest()
            ->paginate($request->per_page ?? 15);

        return $this->success($reviews, 'Pending reviews retrieved successfully');
    }

    /**
     * Approve a review.
     */
    public function approve($id): JsonResponse
    {
        $review = Review::findOrFail($id);

        if ($review->status === 'approved') {
            return $this->error('Review is already approved', 400);
        }

        $review->update(['status' => 'approved']);

        return $this->success($review, 'Review approved successfully');
    }

    /**
     * Reject a review.
     */
    public function reject(Request $request, $id): JsonResponse
    {
        $review = Review::findOrFail($id);

        $validated = $request->validate([
            'reason' => 'nullable|string|max:500',
        ]);

        $review->update([
            'status' => 'rejected',
            'rejection_reason' => $validated['reason'] ?? null,
        ]);

        return $this->success($review, 'Review rejected');
    }

    /**
     * Delete a review.
     */
    public function destroy($id): JsonResponse
    {
        $review = Review::findOrFail($id);
        $review->delete();

        return $this->success(null, 'Review deleted successfully');
    }
}
