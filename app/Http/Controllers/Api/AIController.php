<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\JobMatchingService;
use App\Services\CVParserService;
use App\Services\RecommendationService;
use App\Services\SkillAnalysisService;
use App\Models\Job;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class AIController extends Controller
{
    public function __construct(
        private JobMatchingService $jobMatchingService,
        private CVParserService $cvParserService,
        private RecommendationService $recommendationService,
        private SkillAnalysisService $skillAnalysisService
    ) {}

    /**
     * Get job recommendations for the authenticated candidate.
     */
    public function getJobRecommendations(Request $request): JsonResponse
    {
        $user = Auth::user();

        if (!$user->isCandidate()) {
            return response()->json([
                'success' => false,
                'message' => 'This feature is only available for candidates.',
            ], 403);
        }

        $limit = min($request->get('limit', 10), 50);

        $recommendations = $this->recommendationService->getJobRecommendations($user, $limit);

        return response()->json([
            'success' => true,
            'data' => $recommendations,
        ]);
    }

    /**
     * Get candidate recommendations for a specific job (employers only).
     */
    public function getCandidateRecommendations(Request $request, Job $job): JsonResponse
    {
        $user = Auth::user();

        // Verify the user owns this job
        if (!$user->isEmployer() || !$user->company || $job->company_id !== $user->company->id) {
            return response()->json([
                'success' => false,
                'message' => 'You are not authorized to view recommendations for this job.',
            ], 403);
        }

        $limit = min($request->get('limit', 10), 50);

        $recommendations = $this->recommendationService->getCandidateRecommendations($job, $limit);

        return response()->json([
            'success' => true,
            'data' => $recommendations,
        ]);
    }

    /**
     * Calculate match score between authenticated candidate and a job.
     */
    public function getJobMatchScore(Request $request, Job $job): JsonResponse
    {
        $user = Auth::user();

        if (!$user->isCandidate()) {
            return response()->json([
                'success' => false,
                'message' => 'This feature is only available for candidates.',
            ], 403);
        }

        $matchScore = $this->jobMatchingService->calculateMatchScore($user, $job);
        $skillGap = $this->skillAnalysisService->analyzeSkillGap($user, $job);

        return response()->json([
            'success' => true,
            'data' => [
                'match_score' => $matchScore,
                'skill_analysis' => $skillGap,
                'job' => [
                    'id' => $job->id,
                    'title' => $job->title,
                    'company' => $job->company->name ?? 'Unknown',
                ],
            ],
        ]);
    }

    /**
     * Parse and analyze the authenticated user's CV/resume.
     */
    public function parseCV(Request $request): JsonResponse
    {
        $user = Auth::user();

        if (!$user->isCandidate()) {
            return response()->json([
                'success' => false,
                'message' => 'This feature is only available for candidates.',
            ], 403);
        }

        $profile = $user->candidateProfile;

        if (!$profile || !$profile->resume) {
            return response()->json([
                'success' => false,
                'message' => 'No resume found. Please upload a resume first.',
            ], 404);
        }

        $parsedData = $this->cvParserService->parse($profile->resume);
        $qualityAnalysis = $this->cvParserService->analyzeQuality($parsedData);

        return response()->json([
            'success' => true,
            'data' => [
                'parsed' => $parsedData,
                'quality' => $qualityAnalysis,
            ],
        ]);
    }

    /**
     * Upload and parse a CV file.
     */
    public function uploadAndParseCV(Request $request): JsonResponse
    {
        $request->validate([
            'cv' => 'required|file|mimes:pdf,doc,docx|max:10240', // 10MB max
        ]);

        $user = Auth::user();

        if (!$user->isCandidate()) {
            return response()->json([
                'success' => false,
                'message' => 'This feature is only available for candidates.',
            ], 403);
        }

        $file = $request->file('cv');
        $path = $file->store('resumes/' . $user->id, 'public');

        // Parse the uploaded file
        $parsedData = $this->cvParserService->parse('public/' . $path);
        $qualityAnalysis = $this->cvParserService->analyzeQuality($parsedData);

        // Update candidate profile with parsed data
        $profile = $user->candidateProfile;
        if ($profile) {
            $profile->update([
                'resume' => $path,
                'skills' => $parsedData['data']['skills'] ?? $profile->skills,
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'file_path' => $path,
                'parsed' => $parsedData,
                'quality' => $qualityAnalysis,
            ],
        ]);
    }

    /**
     * Get skill analysis for the authenticated candidate.
     */
    public function getSkillAnalysis(Request $request): JsonResponse
    {
        $user = Auth::user();

        if (!$user->isCandidate()) {
            return response()->json([
                'success' => false,
                'message' => 'This feature is only available for candidates.',
            ], 403);
        }

        $analysis = $this->skillAnalysisService->analyzeSkillProficiency($user);
        $recommendations = $this->skillAnalysisService->getSkillRecommendations($user);

        return response()->json([
            'success' => true,
            'data' => [
                'analysis' => $analysis,
                'recommendations' => $recommendations,
            ],
        ]);
    }

    /**
     * Get trending skills in the job market.
     */
    public function getTrendingSkills(Request $request): JsonResponse
    {
        $limit = min($request->get('limit', 20), 50);

        $trendingSkills = $this->skillAnalysisService->getTrendingSkills($limit);

        return response()->json([
            'success' => true,
            'data' => $trendingSkills,
        ]);
    }

    /**
     * Get similar jobs for a specific job.
     */
    public function getSimilarJobs(Request $request, Job $job): JsonResponse
    {
        $limit = min($request->get('limit', 5), 20);

        $similarJobs = $this->recommendationService->getSimilarJobs($job, $limit);

        return response()->json([
            'success' => true,
            'data' => $similarJobs,
        ]);
    }

    /**
     * Get skill gap analysis between candidate and a specific job.
     */
    public function getSkillGap(Request $request, Job $job): JsonResponse
    {
        $user = Auth::user();

        if (!$user->isCandidate()) {
            return response()->json([
                'success' => false,
                'message' => 'This feature is only available for candidates.',
            ], 403);
        }

        $skillGap = $this->skillAnalysisService->analyzeSkillGap($user, $job);

        return response()->json([
            'success' => true,
            'data' => [
                'job' => [
                    'id' => $job->id,
                    'title' => $job->title,
                ],
                'skill_gap' => $skillGap,
            ],
        ]);
    }

    /**
     * Get category recommendations for the authenticated candidate.
     */
    public function getCategoryRecommendations(Request $request): JsonResponse
    {
        $user = Auth::user();

        if (!$user->isCandidate()) {
            return response()->json([
                'success' => false,
                'message' => 'This feature is only available for candidates.',
            ], 403);
        }

        $categories = $this->recommendationService->getCategoryRecommendations($user);

        return response()->json([
            'success' => true,
            'data' => $categories,
        ]);
    }

    /**
     * Compare skills with another candidate (for employers/admins).
     */
    public function compareSkills(Request $request): JsonResponse
    {
        $request->validate([
            'candidate1_id' => 'required|exists:users,id',
            'candidate2_id' => 'required|exists:users,id',
        ]);

        $user = Auth::user();

        // Only employers and admins can compare candidates
        if (!$user->isEmployer() && !$user->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'You are not authorized to compare candidates.',
            ], 403);
        }

        $candidate1 = User::findOrFail($request->candidate1_id);
        $candidate2 = User::findOrFail($request->candidate2_id);

        if (!$candidate1->isCandidate() || !$candidate2->isCandidate()) {
            return response()->json([
                'success' => false,
                'message' => 'Both users must be candidates.',
            ], 400);
        }

        $comparison = $this->skillAnalysisService->compareSkills($candidate1, $candidate2);

        return response()->json([
            'success' => true,
            'data' => $comparison,
        ]);
    }

    /**
     * Get match score between a specific candidate and job (for employers).
     */
    public function getCandidateJobMatch(Request $request): JsonResponse
    {
        $request->validate([
            'candidate_id' => 'required|exists:users,id',
            'job_id' => 'required|exists:jobs,id',
        ]);

        $user = Auth::user();
        $job = Job::findOrFail($request->job_id);

        // Verify the employer owns this job
        if (!$user->isEmployer() || !$user->company || $job->company_id !== $user->company->id) {
            // Also allow if user is admin
            if (!$user->isAdmin()) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not authorized to view this match score.',
                ], 403);
            }
        }

        $candidate = User::findOrFail($request->candidate_id);

        if (!$candidate->isCandidate()) {
            return response()->json([
                'success' => false,
                'message' => 'The specified user is not a candidate.',
            ], 400);
        }

        $matchScore = $this->jobMatchingService->calculateMatchScore($candidate, $job);
        $skillGap = $this->skillAnalysisService->analyzeSkillGap($candidate, $job);

        return response()->json([
            'success' => true,
            'data' => [
                'candidate' => [
                    'id' => $candidate->id,
                    'name' => $candidate->full_name,
                ],
                'job' => [
                    'id' => $job->id,
                    'title' => $job->title,
                ],
                'match_score' => $matchScore,
                'skill_analysis' => $skillGap,
            ],
        ]);
    }
}
