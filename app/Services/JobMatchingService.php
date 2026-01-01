<?php

namespace App\Services;

use App\Models\Job;
use App\Models\User;
use App\Models\CandidateProfile;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;

class JobMatchingService
{
    /**
     * Weight factors for different matching criteria.
     */
    private array $weights = [
        'skills' => 0.35,
        'experience' => 0.20,
        'education' => 0.15,
        'location' => 0.15,
        'job_type' => 0.10,
        'salary' => 0.05,
    ];

    /**
     * Calculate the match score between a candidate and a job.
     */
    public function calculateMatchScore(User $candidate, Job $job): int
    {
        $cacheKey = "match_score:{$candidate->id}:{$job->id}";

        return Cache::remember($cacheKey, 3600, function () use ($candidate, $job) {
            $profile = $candidate->candidateProfile;

            if (!$profile) {
                return 0;
            }

            $scores = [
                'skills' => $this->calculateSkillsMatch($profile, $job),
                'experience' => $this->calculateExperienceMatch($candidate, $job),
                'education' => $this->calculateEducationMatch($profile, $job),
                'location' => $this->calculateLocationMatch($candidate, $job),
                'job_type' => $this->calculateJobTypeMatch($profile, $job),
                'salary' => $this->calculateSalaryMatch($profile, $job),
            ];

            $weightedScore = 0;
            foreach ($scores as $key => $score) {
                $weightedScore += $score * $this->weights[$key];
            }

            return (int) round($weightedScore);
        });
    }

    /**
     * Get recommended jobs for a candidate.
     */
    public function getRecommendedJobs(User $candidate, int $limit = 10): Collection
    {
        $profile = $candidate->candidateProfile;

        if (!$profile) {
            return collect([]);
        }

        // Get candidate's skills
        $candidateSkills = $this->normalizeSkills($profile->skills ?? []);

        // Get applied job IDs to exclude
        $appliedJobIds = $candidate->jobApplications()->pluck('job_id')->toArray();
        $savedJobIds = $candidate->savedJobs()->pluck('job_id')->toArray();
        $excludeIds = array_merge($appliedJobIds, $savedJobIds);

        // Find matching jobs
        $jobs = Job::with(['company', 'category'])
            ->where('status', 'active')
            ->where('application_deadline', '>=', now())
            ->whereNotIn('id', $excludeIds)
            ->get();

        // Calculate match scores and sort
        $scoredJobs = $jobs->map(function ($job) use ($candidate) {
            $job->match_score = $this->calculateMatchScore($candidate, $job);
            return $job;
        })
        ->filter(fn ($job) => $job->match_score >= 30) // Minimum threshold
        ->sortByDesc('match_score')
        ->take($limit)
        ->values();

        return $scoredJobs;
    }

    /**
     * Get recommended candidates for a job.
     */
    public function getRecommendedCandidates(Job $job, int $limit = 10): Collection
    {
        // Get candidates with profiles
        $candidates = User::where('user_type', 'candidate')
            ->whereHas('candidateProfile')
            ->with('candidateProfile')
            ->get();

        // Calculate match scores and sort
        $scoredCandidates = $candidates->map(function ($candidate) use ($job) {
            $candidate->match_score = $this->calculateMatchScore($candidate, $job);
            return $candidate;
        })
        ->filter(fn ($candidate) => $candidate->match_score >= 30)
        ->sortByDesc('match_score')
        ->take($limit)
        ->values();

        return $scoredCandidates;
    }

    /**
     * Calculate skills match score (0-100).
     */
    private function calculateSkillsMatch(CandidateProfile $profile, Job $job): int
    {
        $candidateSkills = $this->normalizeSkills($profile->skills ?? []);
        $requiredSkills = $this->normalizeSkills($job->required_skills ?? []);
        $preferredSkills = $this->normalizeSkills($job->preferred_skills ?? []);

        if (empty($requiredSkills) && empty($preferredSkills)) {
            return 50; // Default if no skills specified
        }

        $matchedRequired = 0;
        $matchedPreferred = 0;

        foreach ($requiredSkills as $skill) {
            if ($this->hasMatchingSkill($candidateSkills, $skill)) {
                $matchedRequired++;
            }
        }

        foreach ($preferredSkills as $skill) {
            if ($this->hasMatchingSkill($candidateSkills, $skill)) {
                $matchedPreferred++;
            }
        }

        // Required skills count for 70%, preferred for 30%
        $requiredScore = empty($requiredSkills) ? 70 : ($matchedRequired / count($requiredSkills)) * 70;
        $preferredScore = empty($preferredSkills) ? 30 : ($matchedPreferred / count($preferredSkills)) * 30;

        return (int) round($requiredScore + $preferredScore);
    }

    /**
     * Calculate experience match score (0-100).
     */
    private function calculateExperienceMatch(User $candidate, Job $job): int
    {
        $candidateYears = $candidate->experience_years ?? 0;
        $requiredMin = $job->min_experience ?? 0;
        $requiredMax = $job->max_experience ?? ($requiredMin + 5);

        // Map experience level to years if specified
        $experienceLevel = $job->experience_level ?? null;
        if ($experienceLevel && !$requiredMin) {
            $levelRanges = [
                'entry' => [0, 2],
                'junior' => [1, 3],
                'mid' => [3, 5],
                'senior' => [5, 10],
                'lead' => [7, 15],
                'executive' => [10, 30],
            ];

            if (isset($levelRanges[strtolower($experienceLevel)])) {
                [$requiredMin, $requiredMax] = $levelRanges[strtolower($experienceLevel)];
            }
        }

        // Perfect match if within range
        if ($candidateYears >= $requiredMin && $candidateYears <= $requiredMax) {
            return 100;
        }

        // Under-qualified penalty
        if ($candidateYears < $requiredMin) {
            $deficit = $requiredMin - $candidateYears;
            return max(0, 100 - ($deficit * 20));
        }

        // Over-qualified (minor penalty)
        $excess = $candidateYears - $requiredMax;
        return max(50, 100 - ($excess * 5));
    }

    /**
     * Calculate education match score (0-100).
     */
    private function calculateEducationMatch(CandidateProfile $profile, Job $job): int
    {
        $education = $profile->education ?? [];
        $requiredEducation = strtolower($job->required_education ?? '');

        if (empty($requiredEducation)) {
            return 70; // Default if not specified
        }

        $educationLevels = [
            'high school' => 1,
            'diploma' => 2,
            'associate' => 3,
            'bachelor' => 4,
            'master' => 5,
            'phd' => 6,
            'doctorate' => 6,
        ];

        $requiredLevel = 0;
        foreach ($educationLevels as $level => $value) {
            if (str_contains($requiredEducation, $level)) {
                $requiredLevel = $value;
                break;
            }
        }

        if ($requiredLevel === 0) {
            return 70;
        }

        // Get candidate's highest education level
        $candidateLevel = 0;
        foreach ($education as $edu) {
            $degree = strtolower($edu['degree'] ?? '');
            foreach ($educationLevels as $level => $value) {
                if (str_contains($degree, $level) && $value > $candidateLevel) {
                    $candidateLevel = $value;
                }
            }
        }

        if ($candidateLevel >= $requiredLevel) {
            return 100;
        }

        // Partial credit for close match
        $deficit = $requiredLevel - $candidateLevel;
        return max(0, 100 - ($deficit * 25));
    }

    /**
     * Calculate location match score (0-100).
     */
    private function calculateLocationMatch(User $candidate, Job $job): int
    {
        $candidateLocation = strtolower(trim($candidate->location ?? ''));
        $candidateCity = strtolower(trim($candidate->city ?? ''));
        $candidateCountry = strtolower(trim($candidate->country ?? ''));

        $jobLocation = strtolower(trim($job->location ?? ''));
        $isRemote = $job->is_remote ?? false;
        $jobType = strtolower($job->job_type ?? '');

        // Remote jobs match everyone
        if ($isRemote || str_contains($jobType, 'remote')) {
            return 100;
        }

        // Exact location match
        if (!empty($jobLocation)) {
            if (str_contains($jobLocation, $candidateCity) || str_contains($candidateCity, $jobLocation)) {
                return 100;
            }

            if (str_contains($jobLocation, $candidateLocation) || str_contains($candidateLocation, $jobLocation)) {
                return 90;
            }

            // Same country
            if (!empty($candidateCountry) && str_contains($jobLocation, $candidateCountry)) {
                return 70;
            }
        }

        // Default if location doesn't match
        return 40;
    }

    /**
     * Calculate job type preference match (0-100).
     */
    private function calculateJobTypeMatch(CandidateProfile $profile, Job $job): int
    {
        $preferredJobTypes = array_map('strtolower', $profile->preferred_job_types ?? []);
        $jobType = strtolower($job->job_type ?? 'full-time');

        if (empty($preferredJobTypes)) {
            return 70; // Default
        }

        if (in_array($jobType, $preferredJobTypes)) {
            return 100;
        }

        // Similar job types
        $similarTypes = [
            'full-time' => ['permanent', 'full time'],
            'part-time' => ['part time', 'casual'],
            'contract' => ['freelance', 'temporary'],
            'internship' => ['trainee', 'apprentice'],
        ];

        foreach ($similarTypes as $type => $similar) {
            if ($jobType === $type || in_array($jobType, $similar)) {
                foreach ($preferredJobTypes as $preferred) {
                    if ($preferred === $type || in_array($preferred, $similar)) {
                        return 80;
                    }
                }
            }
        }

        return 30;
    }

    /**
     * Calculate salary expectation match (0-100).
     */
    private function calculateSalaryMatch(CandidateProfile $profile, Job $job): int
    {
        $expectedMin = $profile->expected_salary_min ?? 0;
        $expectedMax = $profile->expected_salary_max ?? 0;

        $jobMin = $job->salary_min ?? 0;
        $jobMax = $job->salary_max ?? 0;

        // If no salary info, default score
        if (($expectedMin === 0 && $expectedMax === 0) || ($jobMin === 0 && $jobMax === 0)) {
            return 70;
        }

        // Perfect overlap
        if ($expectedMin <= $jobMax && $expectedMax >= $jobMin) {
            return 100;
        }

        // Candidate expects more
        if ($expectedMin > $jobMax) {
            $difference = ($expectedMin - $jobMax) / max($expectedMin, 1);
            return max(0, (int) (100 - ($difference * 100)));
        }

        // Candidate expects less (good for employer)
        return 90;
    }

    /**
     * Normalize skills array to lowercase strings.
     */
    private function normalizeSkills(array $skills): array
    {
        return array_map(function ($skill) {
            if (is_array($skill)) {
                return strtolower(trim($skill['name'] ?? $skill[0] ?? ''));
            }
            return strtolower(trim((string) $skill));
        }, $skills);
    }

    /**
     * Check if candidate has a matching skill (with fuzzy matching).
     */
    private function hasMatchingSkill(array $candidateSkills, string $requiredSkill): bool
    {
        $requiredSkill = strtolower(trim($requiredSkill));

        foreach ($candidateSkills as $skill) {
            // Exact match
            if ($skill === $requiredSkill) {
                return true;
            }

            // Partial match (one contains the other)
            if (str_contains($skill, $requiredSkill) || str_contains($requiredSkill, $skill)) {
                return true;
            }

            // Similar technologies
            $similar = $this->getSimilarSkills($requiredSkill);
            if (in_array($skill, $similar)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Get similar skills for fuzzy matching.
     */
    private function getSimilarSkills(string $skill): array
    {
        $skillGroups = [
            'javascript' => ['js', 'ecmascript', 'es6', 'typescript', 'ts'],
            'typescript' => ['ts', 'javascript', 'js'],
            'python' => ['py', 'python3', 'django', 'flask'],
            'react' => ['reactjs', 'react.js', 'react native'],
            'vue' => ['vuejs', 'vue.js', 'nuxt'],
            'angular' => ['angularjs', 'angular.js'],
            'node' => ['nodejs', 'node.js', 'express'],
            'php' => ['laravel', 'symfony', 'wordpress'],
            'laravel' => ['php', 'lumen'],
            'java' => ['spring', 'spring boot', 'kotlin'],
            'c#' => ['csharp', '.net', 'dotnet', 'asp.net'],
            'sql' => ['mysql', 'postgresql', 'postgres', 'sqlite', 'mssql'],
            'nosql' => ['mongodb', 'redis', 'cassandra', 'dynamodb'],
            'aws' => ['amazon web services', 'ec2', 's3', 'lambda'],
            'azure' => ['microsoft azure'],
            'gcp' => ['google cloud', 'google cloud platform'],
            'docker' => ['containers', 'containerization'],
            'kubernetes' => ['k8s', 'container orchestration'],
            'git' => ['github', 'gitlab', 'bitbucket', 'version control'],
            'agile' => ['scrum', 'kanban', 'sprint'],
            'machine learning' => ['ml', 'ai', 'deep learning', 'neural networks'],
            'data science' => ['data analysis', 'analytics', 'statistics'],
        ];

        return $skillGroups[$skill] ?? [];
    }

    /**
     * Invalidate cached match scores for a candidate.
     */
    public function invalidateCandidateCache(User $candidate): void
    {
        $jobs = Job::where('status', 'active')->pluck('id');

        foreach ($jobs as $jobId) {
            Cache::forget("match_score:{$candidate->id}:{$jobId}");
        }
    }

    /**
     * Invalidate cached match scores for a job.
     */
    public function invalidateJobCache(Job $job): void
    {
        $candidates = User::where('user_type', 'candidate')->pluck('id');

        foreach ($candidates as $candidateId) {
            Cache::forget("match_score:{$candidateId}:{$job->id}");
        }
    }
}
