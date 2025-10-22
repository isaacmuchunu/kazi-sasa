<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
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

        return response()->json([
            'success' => true,
            'data' => [
                'stats' => [
                    'total_applications' => $totalApplications,
                    'accepted_applications' => $acceptedApplications,
                    'saved_jobs' => $savedJobs,
                    'profile_completion' => $profileCompletion,
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

        $jobs = $user->jobs()->withCount('applications')->get();
        $totalJobs = $jobs->count();
        $activeJobs = $jobs->where('status', 'active')->count();
        $totalApplications = $jobs->sum('applications_count');
        
        // Application status breakdown
        $applicationsByStatus = $user->jobApplications()
            ->selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        // Recent activity
        $recentApplications = $user->jobApplications()
            ->with(['candidate:id,first_name,last_name', 'job:id,title'])
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($application) {
                return [
                    'type' => 'new_application',
                    'message' => "{$application->candidate->first_name} {$application->candidate->last_name} applied to {$application->job->title}",
                    'created_at' => $application->created_at,
                    'status' => $application->status
                ];
            });

        return response()->json([
            'success' => true,
            'data' => [
                'stats' => [
                    'total_jobs' => $totalJobs,
                    'active_jobs' => $activeJobs,
                    'total_applications' => $totalApplications,
                    'company_profile_completion' => $this->calculateCompanyProfileCompletion($company),
                    'application_status' => $applicationsByStatus
                ],
                'recent_activity' => $recentApplications
            ]
        ]);
    }

    public function activity(Request $request): JsonResponse
    {
        $user = Auth::user();
        $limit = $request->get('limit', 20);
        
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
        // Get user's search preferences from applications
        $appliedJobs = $user->jobApplications()
            ->with('job:id,job_category_id,location,experience_level')
            ->get()
            ->pluck('job');

        // Find similar jobs
        $categoryIds = $appliedJobs->pluck('job_category_id')->unique();
        $locations = $appliedJobs->pluck('location')->unique();
        
        $recommendedJobs = Job::with('company')
            ->where('status', 'active')
            ->whereIn('job_category_id', $categoryIds)
            ->orWhereIn('location', $locations)
            ->whereNotIn('id', $user->jobApplications()->pluck('job_id'))
            ->whereNotIn('id', $user->savedJobs()->pluck('job_id'))
            ->latest()
            ->take(10)
            ->get()
            ->map(function ($job) {
                return [
                    'id' => $job->id,
                    'title' => $job->title,
                    'company' => $job->company->name,
                    'location' => $job->location,
                    'category' => $job->category->name,
                    'salary_range' => $job->salary_range,
                    'job_type' => $job->job_type,
                    'posted_date' => $job->created_at->diffForHumans(),
                    'match_score' => $this->calculateMatchScore($job)
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $recommendedJobs
        ]);
    }

    private function getEmployerRecommendations($user): JsonResponse
    {
        // Recommend candidates based on job similarity
        $companyJobs = $user->jobs()->with(['applications.candidate'])->get();
        
        $topCandidates = collect([]);
        
        if ($companyJobs->isNotEmpty()) {
            // Get candidates who applied to similar jobs
            $candidateIds = $companyJobs->pluck('applications.*.candidate_id')->flatten()->unique();
            
            $topCandidates = User::where('user_type', 'candidate')
                ->whereIn('id', $candidateIds)
                ->with(['candidateProfile', 'jobApplications' => function ($query) use ($companyJobs) {
                    $query->whereIn('job_id', $companyJobs->pluck('id'));
                }])
                ->get()
                ->map(function ($candidate) use ($companyJobs) {
                    return [
                        'id' => $candidate->id,
                        'name' => $candidate->full_name,
                        'location' => $candidate->location,
                        'job_title' => $candidate->job_title,
                        'experience_years' => $candidate->experience_years,
                        'applications_count' => $candidate->jobApplications->count(),
                        'skills' => $candidate->candidateProfile->skills ?? [],
                        'profile_completion' => $this->calculateCandidateProfileCompletion($candidate)
                    ];
                })
                ->sortByDesc('applications_count')
                ->take(10)
                ->values();
        }

        return response()->json([
            'success' => true,
            'data' => $topCandidates
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
        
        return min(100, round(($completed / count($fields)) * 100));
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
        
        foreach ($fields as $field) {
            if (!empty($company->$field)) {
                $completed++;
            }
        }
        
        if ($company->logo) $completed++;
        
        return min(100, round(($completed / count($fields)) * 100));
    }

    private function calculateMatchScore($job): int
    {
        // Simulate match score calculation
        // In reality, this would involve complex matching algorithms
        return rand(70, 95);
    }

    private function getCandidateActivity($user): \Illuminate\Database\Eloquent\Collection
    {
        return $user->jobApplications()
            ->with('job:id,title')
            ->latest()
            ->get()
            ->map(function ($application) {
                return [
                    'type' => 'application',
                    'title' => 'Job Application',
                    'message' => "Applied to {$application->job->title}",
                    'created_at' => $application->created_at,
                    'status' => $application->status,
                    'icon' => 'briefcase'
                ];
            });
    }

    private function getEmployerActivity($user): \Illuminate\Database\Eloquent\Collection
    {
        return $user->jobApplications()
            ->with(['candidate:id,first_name,last_name', 'job:id,title'])
            ->latest()
            ->get()
            ->map(function ($application) {
                return [
                    'type' => 'new_application',
                    'title' => 'New Application',
                    'message' => "{$application->candidate->first_name} {$application->candidate->last_name} applied to {$application->job->title}",
                    'created_at' => $application->created_at,
                    'status' => $application->status,
                    'icon' => 'user-plus'
                ];
            });
    }
}
