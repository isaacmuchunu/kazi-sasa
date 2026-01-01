<?php

namespace App\Services;

use App\Models\Job;
use App\Models\User;
use App\Models\Company;
use App\Models\JobCategory;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class RecommendationService
{
    private JobMatchingService $jobMatchingService;

    public function __construct(JobMatchingService $jobMatchingService)
    {
        $this->jobMatchingService = $jobMatchingService;
    }

    /**
     * Get personalized job recommendations for a candidate.
     */
    public function getJobRecommendations(User $candidate, int $limit = 10): array
    {
        $cacheKey = "recommendations:jobs:{$candidate->id}";

        return Cache::remember($cacheKey, 1800, function () use ($candidate, $limit) {
            $recommendations = [
                'matched_jobs' => $this->getMatchedJobs($candidate, $limit),
                'trending_jobs' => $this->getTrendingJobs($candidate, 5),
                'new_jobs' => $this->getNewJobs($candidate, 5),
                'companies_hiring' => $this->getCompaniesHiring($candidate, 5),
            ];

            return $recommendations;
        });
    }

    /**
     * Get matched jobs using AI scoring.
     */
    private function getMatchedJobs(User $candidate, int $limit): Collection
    {
        return $this->jobMatchingService->getRecommendedJobs($candidate, $limit)
            ->map(function ($job) {
                return [
                    'id' => $job->id,
                    'title' => $job->title,
                    'slug' => $job->slug,
                    'company' => [
                        'id' => $job->company->id ?? null,
                        'name' => $job->company->name ?? 'Unknown',
                        'logo' => $job->company->logo ?? null,
                    ],
                    'location' => $job->location,
                    'job_type' => $job->job_type,
                    'salary_range' => $this->formatSalaryRange($job),
                    'experience_level' => $job->experience_level,
                    'posted_at' => $job->created_at->diffForHumans(),
                    'match_score' => $job->match_score,
                    'match_reasons' => $this->getMatchReasons($job),
                    'is_featured' => $job->is_featured ?? false,
                    'application_deadline' => $job->application_deadline?->format('Y-m-d'),
                ];
            });
    }

    /**
     * Get trending jobs based on application count.
     */
    private function getTrendingJobs(User $candidate, int $limit): Collection
    {
        $appliedJobIds = $candidate->jobApplications()->pluck('job_id')->toArray();

        return Job::with(['company', 'category'])
            ->where('status', 'active')
            ->where('created_at', '>=', now()->subDays(14))
            ->whereNotIn('id', $appliedJobIds)
            ->withCount('applications')
            ->orderByDesc('applications_count')
            ->limit($limit)
            ->get()
            ->map(function ($job) {
                return [
                    'id' => $job->id,
                    'title' => $job->title,
                    'slug' => $job->slug,
                    'company' => $job->company->name ?? 'Unknown',
                    'location' => $job->location,
                    'applications_count' => $job->applications_count,
                    'trending_score' => $this->calculateTrendingScore($job),
                ];
            });
    }

    /**
     * Get newly posted jobs.
     */
    private function getNewJobs(User $candidate, int $limit): Collection
    {
        $appliedJobIds = $candidate->jobApplications()->pluck('job_id')->toArray();
        $profile = $candidate->candidateProfile;

        $query = Job::with(['company', 'category'])
            ->where('status', 'active')
            ->where('created_at', '>=', now()->subDays(3))
            ->whereNotIn('id', $appliedJobIds)
            ->orderByDesc('created_at');

        // Filter by candidate preferences if available
        if ($profile && !empty($profile->preferred_categories)) {
            $query->whereIn('job_category_id', $profile->preferred_categories);
        }

        return $query->limit($limit)
            ->get()
            ->map(function ($job) {
                return [
                    'id' => $job->id,
                    'title' => $job->title,
                    'slug' => $job->slug,
                    'company' => $job->company->name ?? 'Unknown',
                    'location' => $job->location,
                    'posted_at' => $job->created_at->diffForHumans(),
                ];
            });
    }

    /**
     * Get companies that are actively hiring.
     */
    private function getCompaniesHiring(User $candidate, int $limit): Collection
    {
        return Company::whereHas('jobs', function ($query) {
                $query->where('status', 'active')
                    ->where('created_at', '>=', now()->subDays(30));
            })
            ->withCount(['jobs' => function ($query) {
                $query->where('status', 'active');
            }])
            ->where('is_verified', true)
            ->orderByDesc('jobs_count')
            ->limit($limit)
            ->get()
            ->map(function ($company) {
                return [
                    'id' => $company->id,
                    'name' => $company->name,
                    'slug' => $company->slug,
                    'logo' => $company->logo,
                    'industry' => $company->industry,
                    'open_positions' => $company->jobs_count,
                ];
            });
    }

    /**
     * Get candidate recommendations for an employer/job.
     */
    public function getCandidateRecommendations(Job $job, int $limit = 10): array
    {
        $cacheKey = "recommendations:candidates:{$job->id}";

        return Cache::remember($cacheKey, 1800, function () use ($job, $limit) {
            $recommendations = [
                'matched_candidates' => $this->getMatchedCandidates($job, $limit),
                'active_seekers' => $this->getActiveSeekers($job, 5),
                'recent_applicants' => $this->getRecentApplicants($job, 5),
            ];

            return $recommendations;
        });
    }

    /**
     * Get matched candidates using AI scoring.
     */
    private function getMatchedCandidates(Job $job, int $limit): Collection
    {
        return $this->jobMatchingService->getRecommendedCandidates($job, $limit)
            ->map(function ($candidate) use ($job) {
                $profile = $candidate->candidateProfile;

                return [
                    'id' => $candidate->id,
                    'name' => $candidate->full_name,
                    'username' => $candidate->user_name,
                    'job_title' => $candidate->job_title,
                    'location' => $candidate->location,
                    'experience_years' => $candidate->experience_years,
                    'skills' => array_slice($profile->skills ?? [], 0, 5),
                    'match_score' => $candidate->match_score,
                    'has_resume' => !empty($profile->resume),
                    'profile_image' => $candidate->profile_image,
                    'last_active' => $candidate->last_active_at?->diffForHumans(),
                ];
            });
    }

    /**
     * Get active job seekers in relevant category.
     */
    private function getActiveSeekers(Job $job, int $limit): Collection
    {
        return User::where('user_type', 'candidate')
            ->whereHas('candidateProfile', function ($query) use ($job) {
                if ($job->job_category_id) {
                    $query->whereJsonContains('preferred_categories', $job->job_category_id);
                }
            })
            ->where('last_active_at', '>=', now()->subDays(7))
            ->orderByDesc('last_active_at')
            ->limit($limit)
            ->get()
            ->map(function ($candidate) {
                return [
                    'id' => $candidate->id,
                    'name' => $candidate->full_name,
                    'username' => $candidate->user_name,
                    'job_title' => $candidate->job_title,
                    'last_active' => $candidate->last_active_at?->diffForHumans(),
                ];
            });
    }

    /**
     * Get recent applicants to similar jobs.
     */
    private function getRecentApplicants(Job $job, int $limit): Collection
    {
        // Get existing applicant IDs to exclude
        $existingApplicants = $job->applications()->pluck('user_id')->toArray();

        // Find similar jobs
        $similarJobIds = Job::where('job_category_id', $job->job_category_id)
            ->where('id', '!=', $job->id)
            ->pluck('id');

        return User::where('user_type', 'candidate')
            ->whereHas('jobApplications', function ($query) use ($similarJobIds) {
                $query->whereIn('job_id', $similarJobIds)
                    ->where('created_at', '>=', now()->subDays(30));
            })
            ->whereNotIn('id', $existingApplicants)
            ->with('candidateProfile')
            ->limit($limit)
            ->get()
            ->map(function ($candidate) {
                return [
                    'id' => $candidate->id,
                    'name' => $candidate->full_name,
                    'username' => $candidate->user_name,
                    'job_title' => $candidate->job_title,
                    'experience_years' => $candidate->experience_years,
                ];
            });
    }

    /**
     * Get similar jobs for a given job.
     */
    public function getSimilarJobs(Job $job, int $limit = 5): Collection
    {
        $cacheKey = "similar_jobs:{$job->id}";

        return Cache::remember($cacheKey, 3600, function () use ($job, $limit) {
            return Job::with(['company', 'category'])
                ->where('status', 'active')
                ->where('id', '!=', $job->id)
                ->where(function ($query) use ($job) {
                    $query->where('job_category_id', $job->job_category_id)
                        ->orWhere('location', $job->location);
                })
                ->orderByDesc('created_at')
                ->limit($limit)
                ->get()
                ->map(function ($similarJob) use ($job) {
                    return [
                        'id' => $similarJob->id,
                        'title' => $similarJob->title,
                        'slug' => $similarJob->slug,
                        'company' => $similarJob->company->name ?? 'Unknown',
                        'location' => $similarJob->location,
                        'similarity_score' => $this->calculateSimilarityScore($job, $similarJob),
                    ];
                });
        });
    }

    /**
     * Get category recommendations based on user behavior.
     */
    public function getCategoryRecommendations(User $candidate): Collection
    {
        $profile = $candidate->candidateProfile;
        $appliedCategories = $candidate->jobApplications()
            ->with('job:id,job_category_id')
            ->get()
            ->pluck('job.job_category_id')
            ->filter()
            ->countBy();

        // Get related categories
        $topCategories = $appliedCategories->sortDesc()->take(3)->keys();

        return JobCategory::whereNotIn('id', $topCategories)
            ->withCount(['jobs' => function ($query) {
                $query->where('status', 'active');
            }])
            ->orderByDesc('jobs_count')
            ->limit(5)
            ->get()
            ->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'slug' => $category->slug,
                    'job_count' => $category->jobs_count,
                    'icon' => $category->icon,
                ];
            });
    }

    /**
     * Calculate trending score for a job.
     */
    private function calculateTrendingScore(Job $job): int
    {
        $applicationsWeight = 50;
        $viewsWeight = 30;
        $recencyWeight = 20;

        $applicationScore = min(100, ($job->applications_count ?? 0) * 5);
        $viewScore = min(100, ($job->views_count ?? 0) / 10);

        $daysOld = $job->created_at->diffInDays(now());
        $recencyScore = max(0, 100 - ($daysOld * 10));

        return (int) round(
            ($applicationScore * $applicationsWeight / 100) +
            ($viewScore * $viewsWeight / 100) +
            ($recencyScore * $recencyWeight / 100)
        );
    }

    /**
     * Calculate similarity score between two jobs.
     */
    private function calculateSimilarityScore(Job $job1, Job $job2): int
    {
        $score = 0;

        // Same category
        if ($job1->job_category_id === $job2->job_category_id) {
            $score += 30;
        }

        // Same location
        if (strtolower($job1->location ?? '') === strtolower($job2->location ?? '')) {
            $score += 20;
        }

        // Same job type
        if (strtolower($job1->job_type ?? '') === strtolower($job2->job_type ?? '')) {
            $score += 15;
        }

        // Similar experience level
        if ($job1->experience_level === $job2->experience_level) {
            $score += 15;
        }

        // Similar salary range (within 20%)
        if ($job1->salary_max && $job2->salary_max) {
            $diff = abs($job1->salary_max - $job2->salary_max) / max($job1->salary_max, $job2->salary_max);
            if ($diff <= 0.2) {
                $score += 10;
            }
        }

        // Skill overlap
        $skills1 = array_map('strtolower', $job1->required_skills ?? []);
        $skills2 = array_map('strtolower', $job2->required_skills ?? []);
        if (!empty($skills1) && !empty($skills2)) {
            $overlap = count(array_intersect($skills1, $skills2)) / max(count($skills1), count($skills2));
            $score += (int) ($overlap * 10);
        }

        return min(100, $score);
    }

    /**
     * Format salary range for display.
     */
    private function formatSalaryRange(Job $job): ?string
    {
        if (!$job->salary_min && !$job->salary_max) {
            return $job->salary_range; // Use existing formatted string if available
        }

        $currency = $job->currency ?? 'KES';

        if ($job->salary_min && $job->salary_max) {
            return $currency . ' ' . number_format($job->salary_min) . ' - ' . number_format($job->salary_max);
        }

        if ($job->salary_min) {
            return 'From ' . $currency . ' ' . number_format($job->salary_min);
        }

        if ($job->salary_max) {
            return 'Up to ' . $currency . ' ' . number_format($job->salary_max);
        }

        return null;
    }

    /**
     * Get match reasons for UI display.
     */
    private function getMatchReasons(Job $job): array
    {
        $reasons = [];

        if ($job->match_score >= 80) {
            $reasons[] = 'Strong skill match';
        }

        if ($job->is_remote ?? false) {
            $reasons[] = 'Remote friendly';
        }

        if ($job->created_at >= now()->subDays(3)) {
            $reasons[] = 'Recently posted';
        }

        if (($job->applications_count ?? 0) < 10) {
            $reasons[] = 'Few applicants';
        }

        return $reasons;
    }

    /**
     * Invalidate recommendation cache for a candidate.
     */
    public function invalidateCandidateCache(User $candidate): void
    {
        Cache::forget("recommendations:jobs:{$candidate->id}");
    }

    /**
     * Invalidate recommendation cache for a job.
     */
    public function invalidateJobCache(Job $job): void
    {
        Cache::forget("recommendations:candidates:{$job->id}");
        Cache::forget("similar_jobs:{$job->id}");
    }
}
