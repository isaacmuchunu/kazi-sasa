<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\JobMatchingService;
use App\Services\RecommendationService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\Job;
use App\Models\JobApplication;
use App\Models\Company;
use App\Models\User;
use App\Models\Message;

class DashboardController extends Controller
{
    public function __construct(
        private JobMatchingService $jobMatchingService,
        private RecommendationService $recommendationService
    ) {}

    public function stats(Request $request): JsonResponse
    {
        $user = Auth::user();

        if ($user->isCandidate()) {
            return $this->candidateStats($user);
        } elseif ($user->isEmployer()) {
            return $this->employerStats($user);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Invalid user type'
            ], 403);
        }
    }

    private function candidateStats($user): JsonResponse
    {
        $applications = $user->jobApplications()
            ->selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        $savedJobs = $user->savedJobs()->count();
        $totalApplications = array_sum($applications);
        $acceptedApplications = $applications['accepted'] ?? 0;

        // Calculate profile completion
        $profileCompletion = $this->calculateCandidateProfileCompletion($user);

        // Get recent activity
        $recentApplications = $user->jobApplications()
            ->with('job:id,title')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($application) {
                return [
                    'type' => 'application',
                    'message' => "Applied to {$application->job->title}",
                    'created_at' => $application->created_at,
                    'status' => $application->status
                ];
            });

        // Get profile views (if tracked)
        $profileViews = $user->candidateProfile?->views_count ?? 0;

        // Get match rate (applications that resulted in interviews/callbacks)
        $interviewCount = $applications['interview'] ?? 0;
        $shortlistedCount = $applications['shortlisted'] ?? 0;
        $matchRate = $totalApplications > 0
            ? round((($interviewCount + $shortlistedCount) / $totalApplications) * 100)
            : 0;

        return response()->json([
            'success' => true,
            'data' => [
                'stats' => [
                    'total_applications' => $totalApplications,
                    'accepted_applications' => $acceptedApplications,
                    'saved_jobs' => $savedJobs,
                    'profile_completion' => $profileCompletion,
                    'profile_views' => $profileViews,
                    'match_rate' => $matchRate,
                    'application_status' => $applications
                ],
                'recent_activity' => $recentApplications
            ]
        ]);
    }

    private function employerStats($user): JsonResponse
    {
        $company = $user->company;

        if (!$company) {
            return response()->json([
                'success' => false,
                'message' => 'No company profile found'
            ], 404);
        }

        $jobs = $company->jobs()->withCount('applications')->get();
        $totalJobs = $jobs->count();
        $activeJobs = $jobs->where('status', 'active')->count();
        $totalApplications = $jobs->sum('applications_count');

        // Application status breakdown across all company jobs
        $applicationsByStatus = JobApplication::whereHas('job', function ($query) use ($company) {
                $query->where('company_id', $company->id);
            })
            ->selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        // Recent activity
        $recentApplications = JobApplication::whereHas('job', function ($query) use ($company) {
                $query->where('company_id', $company->id);
            })
            ->with(['user:id,first_name,last_name', 'job:id,title'])
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($application) {
                return [
                    'type' => 'new_application',
                    'message' => "{$application->user->first_name} {$application->user->last_name} applied to {$application->job->title}",
                    'created_at' => $application->created_at,
                    'status' => $application->status
                ];
            });

        // Calculate hiring metrics
        $hiredCount = $applicationsByStatus['hired'] ?? 0;
        $hireRate = $totalApplications > 0
            ? round(($hiredCount / $totalApplications) * 100)
            : 0;

        return response()->json([
            'success' => true,
            'data' => [
                'stats' => [
                    'total_jobs' => $totalJobs,
                    'active_jobs' => $activeJobs,
                    'total_applications' => $totalApplications,
                    'company_profile_completion' => $this->calculateCompanyProfileCompletion($company),
                    'hire_rate' => $hireRate,
                    'application_status' => $applicationsByStatus
                ],
                'recent_activity' => $recentApplications
            ]
        ]);
    }

    public function activity(Request $request): JsonResponse
    {
        $user = Auth::user();
        $limit = min($request->get('limit', 20), 100);

        if ($user->isCandidate()) {
            $activities = $this->getCandidateActivity($user)->take($limit);
        } elseif ($user->isEmployer()) {
            $activities = $this->getEmployerActivity($user)->take($limit);
        } else {
            $activities = collect([]);
        }

        return response()->json([
            'success' => true,
            'data' => $activities
        ]);
    }

    public function recommendations(Request $request): JsonResponse
    {
        $user = Auth::user();

        if ($user->isCandidate()) {
            return $this->getCandidateRecommendations($user);
        } elseif ($user->isEmployer()) {
            return $this->getEmployerRecommendations($user);
        }

        return response()->json([
            'success' => true,
            'data' => []
        ]);
    }

    private function getCandidateRecommendations($user): JsonResponse
    {
        // Use AI-powered recommendation service
        $recommendations = $this->recommendationService->getJobRecommendations($user, 10);

        return response()->json([
            'success' => true,
            'data' => $recommendations
        ]);
    }

    private function getEmployerRecommendations($user): JsonResponse
    {
        $company = $user->company;

        if (!$company) {
            return response()->json([
                'success' => true,
                'data' => []
            ]);
        }

        // Get recommendations for the most recent active job
        $activeJob = $company->jobs()
            ->where('status', 'active')
            ->latest()
            ->first();

        if (!$activeJob) {
            // Fallback: show top candidates overall
            $topCandidates = User::where('user_type', 'candidate')
                ->whereHas('candidateProfile')
                ->with('candidateProfile')
                ->where('last_active_at', '>=', now()->subDays(30))
                ->orderByDesc('last_active_at')
                ->limit(10)
                ->get()
                ->map(function ($candidate) {
                    return [
                        'id' => $candidate->id,
                        'name' => $candidate->full_name,
                        'username' => $candidate->user_name,
                        'location' => $candidate->location,
                        'job_title' => $candidate->job_title,
                        'experience_years' => $candidate->experience_years,
                        'skills' => array_slice($candidate->candidateProfile->skills ?? [], 0, 5),
                        'profile_completion' => $this->calculateCandidateProfileCompletion($candidate),
                        'last_active' => $candidate->last_active_at?->diffForHumans(),
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => [
                    'candidates' => $topCandidates,
                    'message' => 'Post a job to get AI-matched candidate recommendations',
                ]
            ]);
        }

        // Use AI-powered recommendation service
        $recommendations = $this->recommendationService->getCandidateRecommendations($activeJob, 10);

        return response()->json([
            'success' => true,
            'data' => [
                'for_job' => [
                    'id' => $activeJob->id,
                    'title' => $activeJob->title,
                ],
                'recommendations' => $recommendations,
            ]
        ]);
    }

    private function calculateCandidateProfileCompletion($user): int
    {
        $fields = [
            'first_name',
            'last_name',
            'phone_number',
            'location',
            'city',
            'country',
            'job_title',
            'experience_years',
            'bio'
        ];

        $completed = 0;
        $total = count($fields) + 4; // +4 for profile fields
        $profile = $user->candidateProfile;

        foreach ($fields as $field) {
            if (!empty($user->$field)) {
                $completed++;
            }
        }

        if ($profile) {
            if ($profile->resume) $completed++;
            if (!empty($profile->skills)) $completed++;
            if (!empty($profile->education)) $completed++;
            if (!empty($profile->experience)) $completed++;
        }

        return min(100, round(($completed / $total) * 100));
    }

    private function calculateCompanyProfileCompletion($company): int
    {
        $fields = [
            'name',
            'description',
            'industry',
            'company_size',
            'location',
            'website',
            'phone',
            'email'
        ];

        $completed = 0;
        $total = count($fields) + 1; // +1 for logo

        foreach ($fields as $field) {
            if (!empty($company->$field)) {
                $completed++;
            }
        }

        if ($company->logo) $completed++;

        return min(100, round(($completed / $total) * 100));
    }

    /**
     * Calculate match score using AI service.
     */
    public function calculateMatchScore(User $candidate, Job $job): int
    {
        return $this->jobMatchingService->calculateMatchScore($candidate, $job);
    }

    private function getCandidateActivity($user): \Illuminate\Support\Collection
    {
        return $user->jobApplications()
            ->with('job:id,title,slug')
            ->latest()
            ->get()
            ->map(function ($application) {
                return [
                    'type' => 'application',
                    'title' => 'Job Application',
                    'message' => "Applied to {$application->job->title}",
                    'job_slug' => $application->job->slug,
                    'created_at' => $application->created_at,
                    'status' => $application->status,
                    'icon' => 'briefcase'
                ];
            });
    }

    private function getEmployerActivity($user): \Illuminate\Support\Collection
    {
        $company = $user->company;

        if (!$company) {
            return collect([]);
        }

        return JobApplication::whereHas('job', function ($query) use ($company) {
                $query->where('company_id', $company->id);
            })
            ->with(['user:id,first_name,last_name,user_name', 'job:id,title,slug'])
            ->latest()
            ->get()
            ->map(function ($application) {
                return [
                    'type' => 'new_application',
                    'title' => 'New Application',
                    'message' => "{$application->user->first_name} {$application->user->last_name} applied to {$application->job->title}",
                    'candidate_username' => $application->user->user_name,
                    'job_slug' => $application->job->slug,
                    'created_at' => $application->created_at,
                    'status' => $application->status,
                    'icon' => 'user-plus'
                ];
            });
    }

    /**
     * Get quick stats for the dashboard header.
     */
    public function quickStats(Request $request): JsonResponse
    {
        $user = Auth::user();

        if ($user->isCandidate()) {
            $stats = [
                'applications' => $user->jobApplications()->count(),
                'saved_jobs' => $user->savedJobs()->count(),
                'profile_views' => $user->candidateProfile?->views_count ?? 0,
                'unread_messages' => Message::where('recipient_id', $user->id)
                    ->whereNull('read_at')
                    ->count(),
            ];
        } elseif ($user->isEmployer()) {
            $company = $user->company;
            $stats = [
                'active_jobs' => $company ? $company->jobs()->where('status', 'active')->count() : 0,
                'total_applications' => $company ? JobApplication::whereHas('job', function ($q) use ($company) {
                    $q->where('company_id', $company->id);
                })->count() : 0,
                'new_applications' => $company ? JobApplication::whereHas('job', function ($q) use ($company) {
                    $q->where('company_id', $company->id);
                })->where('status', 'pending')->count() : 0,
                'unread_messages' => Message::where('recipient_id', $user->id)
                    ->whereNull('read_at')
                    ->count(),
            ];
        } else {
            $stats = [];
        }

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
    }
}
