<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\User;
use App\Models\CompanyReview;
use App\Models\CandidateReview;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ReviewController extends Controller
{
    
    public function companyReviews($companyId)
    {
        $reviews = CompanyReview::with('reviewer', 'company.user')
            ->where('company_id', $companyId)
            ->approved()
            ->latest()
            ->paginate($request->get('per_page', 10));

        $averageRating = CompanyReview::where('company_id', $companyId)
            ->approved()
            ->avg('rating') ?? 0;

        $company = Company::with('user')->find($companyId);

        return $this->success([
            'reviews' => $reviews,
            'total_reviews' => CompanyReview::where('company_id', $companyId)
                ->approved()
                ->count(),
            'average_rating' => round($averageRating, 1),
            'company' => $company,
        ], 'Company reviews retrieved successfully');
    }

    public function candidateReviews($candidateId)
    {
        $reviews = CandidateReview::with('reviewer')
            ->where('candidate_id', $candidateId)
            ->approved()
            ->latest()
            ->paginate($request->get('per_page', 10));

        $averageRating = CandidateReview::where('candidate_id', $candidateId)
            ->approved()
            ->avg('rating') ?? 0;

        $candidate = User::where('id', $candidateId)->where('user_type', 'candidate')->first();

        return $this->success([
            'reviews' => $reviews,
            'total_reviews' => CandidateReview::where('candidate_id', $candidateId)
                ->approved()
                ->count(),
            'average_rating' => round($averageRating, 1),
            'candidate' => $candidate,
        ], 'Candidate reviews retrieved successfully');
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'reviewee_id' => 'required|exists:users,id',
            'reviewee_type' => 'required|in:company,candidate',
            'rating' => 'required|integer|min:1|max:5',
            'title' => 'nullable|string|max:255',
            'comment' => 'required|string',
        ]);

        $user = $request->user();

        // Check if user already reviewed this person
        if ($validated['reviewee_type'] === 'company') {
            $existingReview = CompanyReview::where('reviewer_id', $user->id)
                ->where('company_id', $validated['reviewee_id'])
                ->first();

            if ($existingReview) {
                return $this->error('You have already reviewed this company', 400);
            }

            $validated['company_id'] = $validated['reviewee_id'];
            unset($validated['reviewee_id'], $validated['reviewee_type']);

            $validated['reviewer_id'] = $user->id;

            $review = CompanyReview::create($validated);
        } elseif ($validated['reviewee_type'] === 'candidate') {
            $candidate = User::where('id', $validated['reviewee_id'])
                ->where('user_type', 'candidate')
                ->firstOrFail();

            $existingReview = CandidateReview::where('reviewer_id', $user->id)
                ->where('candidate_id', $validated['reviewee_id'])
                ->first();

            if ($existingReview) {
                return $this->error('You have already reviewed this candidate', 400);
            }

            $validated['candidate_id'] = $validated['reviewee_id'];
            unset($validated['reviewee_id'], $validated['reviewee_type']);

            $validated['reviewer_id'] = $user->id;

            $review = CandidateReview::create($validated);
        }

        return $this->success($review, 'Review created successfully', 201);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $user = $request->user();
        
        // Try CompanyReview first
        $review = CompanyReview::find($id);
        
        if (!$review) {
            // Try CandidateReview
            $review = CandidateReview::find($id);
        }

        if (!$review) {
            return $this->error('Review not found', 404);
        }

        if ($review->reviewer_id !== $user->id) {
            return $this->error('Unauthorized', 403);
        }

        $validated = $request->validate([
            'rating' => 'sometimes|integer|min:1|max:5',
            'title' => 'nullable|string|max:255',
            'comment' => 'sometimes|string',
        ]);

        $review->update($validated);

        return $this->success($review, 'Review updated successfully');
    }

    public function destroy($id): JsonResponse
    {
        $user = $request->user();
        
        // Try CompanyReview first
        $review = CompanyReview::find($id);
        
        if (!$review) {
            // Try CandidateReview
            $review = [
                'success' => false,
                'message' => 'Review not found'
            ], 404);
        }

        if ($review->reviewer_id !== $user->id) {
            return $this->error('Unauthorized', 403);
        }

        $review->delete();

        return $this->success(null, 'Review deleted successfully');
    }
}
