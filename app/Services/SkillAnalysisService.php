<?php

namespace App\Services;

use App\Models\Job;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class SkillAnalysisService
{
    /**
     * Skill categories with related skills.
     */
    private array $skillTaxonomy = [
        'programming_languages' => [
            'name' => 'Programming Languages',
            'skills' => ['javascript', 'python', 'java', 'php', 'c++', 'c#', 'ruby', 'go', 'rust', 'swift', 'kotlin', 'typescript', 'scala', 'perl', 'r'],
        ],
        'frontend' => [
            'name' => 'Frontend Development',
            'skills' => ['html', 'css', 'javascript', 'react', 'vue', 'angular', 'svelte', 'jquery', 'bootstrap', 'tailwind', 'sass', 'less', 'webpack', 'next.js', 'nuxt'],
        ],
        'backend' => [
            'name' => 'Backend Development',
            'skills' => ['node.js', 'express', 'laravel', 'django', 'flask', 'spring', 'rails', 'asp.net', 'fastapi', 'nestjs', 'graphql', 'rest api'],
        ],
        'databases' => [
            'name' => 'Databases',
            'skills' => ['mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch', 'sqlite', 'oracle', 'sql server', 'cassandra', 'dynamodb', 'firebase'],
        ],
        'cloud' => [
            'name' => 'Cloud & Infrastructure',
            'skills' => ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'ansible', 'linux', 'nginx', 'apache'],
        ],
        'devops' => [
            'name' => 'DevOps & CI/CD',
            'skills' => ['jenkins', 'gitlab ci', 'github actions', 'circleci', 'travis ci', 'docker', 'kubernetes', 'terraform', 'ansible', 'puppet', 'chef'],
        ],
        'mobile' => [
            'name' => 'Mobile Development',
            'skills' => ['react native', 'flutter', 'swift', 'kotlin', 'ios', 'android', 'xamarin', 'ionic'],
        ],
        'data' => [
            'name' => 'Data Science & ML',
            'skills' => ['python', 'r', 'sql', 'tensorflow', 'pytorch', 'keras', 'pandas', 'numpy', 'scikit-learn', 'spark', 'hadoop', 'tableau', 'power bi'],
        ],
        'design' => [
            'name' => 'UI/UX Design',
            'skills' => ['figma', 'sketch', 'adobe xd', 'photoshop', 'illustrator', 'invision', 'zeplin', 'prototyping', 'wireframing'],
        ],
        'management' => [
            'name' => 'Project Management',
            'skills' => ['agile', 'scrum', 'kanban', 'jira', 'confluence', 'asana', 'trello', 'project management', 'pmp'],
        ],
    ];

    /**
     * Analyze skill gaps between candidate and job requirements.
     */
    public function analyzeSkillGap(User $candidate, Job $job): array
    {
        $profile = $candidate->candidateProfile;
        $candidateSkills = $this->normalizeSkills($profile->skills ?? []);
        $requiredSkills = $this->normalizeSkills($job->required_skills ?? []);
        $preferredSkills = $this->normalizeSkills($job->preferred_skills ?? []);

        $matchedRequired = [];
        $missingRequired = [];
        $matchedPreferred = [];
        $missingPreferred = [];
        $extraSkills = [];

        // Analyze required skills
        foreach ($requiredSkills as $skill) {
            if ($this->hasSkill($candidateSkills, $skill)) {
                $matchedRequired[] = $skill;
            } else {
                $missingRequired[] = $skill;
            }
        }

        // Analyze preferred skills
        foreach ($preferredSkills as $skill) {
            if ($this->hasSkill($candidateSkills, $skill)) {
                $matchedPreferred[] = $skill;
            } else {
                $missingPreferred[] = $skill;
            }
        }

        // Find extra skills candidate has
        $allJobSkills = array_merge($requiredSkills, $preferredSkills);
        foreach ($candidateSkills as $skill) {
            if (!in_array($skill, $allJobSkills)) {
                $extraSkills[] = $skill;
            }
        }

        // Calculate match percentage
        $requiredMatch = count($requiredSkills) > 0
            ? (count($matchedRequired) / count($requiredSkills)) * 100
            : 100;

        $preferredMatch = count($preferredSkills) > 0
            ? (count($matchedPreferred) / count($preferredSkills)) * 100
            : 100;

        $overallMatch = ($requiredMatch * 0.7) + ($preferredMatch * 0.3);

        return [
            'overall_match' => round($overallMatch),
            'required_match' => round($requiredMatch),
            'preferred_match' => round($preferredMatch),
            'matched_required' => $matchedRequired,
            'missing_required' => $missingRequired,
            'matched_preferred' => $matchedPreferred,
            'missing_preferred' => $missingPreferred,
            'extra_skills' => $extraSkills,
            'learning_recommendations' => $this->getSkillLearningRecommendations($missingRequired),
        ];
    }

    /**
     * Get skill proficiency analysis for a candidate.
     */
    public function analyzeSkillProficiency(User $candidate): array
    {
        $profile = $candidate->candidateProfile;
        $skills = $profile->skills ?? [];

        $categorizedSkills = [];
        $uncategorizedSkills = [];

        foreach ($skills as $skill) {
            $skillName = is_array($skill) ? ($skill['name'] ?? '') : $skill;
            $skillLevel = is_array($skill) ? ($skill['level'] ?? 'intermediate') : 'intermediate';
            $normalizedSkill = strtolower(trim($skillName));

            $category = $this->getSkillCategory($normalizedSkill);

            if ($category) {
                if (!isset($categorizedSkills[$category])) {
                    $categorizedSkills[$category] = [
                        'name' => $this->skillTaxonomy[$category]['name'],
                        'skills' => [],
                    ];
                }
                $categorizedSkills[$category]['skills'][] = [
                    'name' => ucwords($skillName),
                    'level' => $skillLevel,
                    'level_value' => $this->getLevelValue($skillLevel),
                ];
            } else {
                $uncategorizedSkills[] = [
                    'name' => ucwords($skillName),
                    'level' => $skillLevel,
                ];
            }
        }

        // Calculate category strengths
        $categoryStrengths = [];
        foreach ($categorizedSkills as $category => $data) {
            $avgLevel = collect($data['skills'])->avg('level_value');
            $categoryStrengths[$category] = [
                'name' => $data['name'],
                'skill_count' => count($data['skills']),
                'average_proficiency' => round($avgLevel * 100),
            ];
        }

        return [
            'categorized_skills' => $categorizedSkills,
            'uncategorized_skills' => $uncategorizedSkills,
            'category_strengths' => $categoryStrengths,
            'total_skills' => count($skills),
            'strongest_category' => $this->getStrongestCategory($categoryStrengths),
            'skill_diversity_score' => $this->calculateDiversityScore($categorizedSkills),
        ];
    }

    /**
     * Get trending skills in the job market.
     */
    public function getTrendingSkills(int $limit = 20): array
    {
        $cacheKey = 'trending_skills';

        return Cache::remember($cacheKey, 3600, function () use ($limit) {
            $jobs = Job::where('status', 'active')
                ->where('created_at', '>=', now()->subDays(30))
                ->get();

            $skillCounts = [];

            foreach ($jobs as $job) {
                $skills = array_merge(
                    $job->required_skills ?? [],
                    $job->preferred_skills ?? []
                );

                foreach ($skills as $skill) {
                    $normalizedSkill = strtolower(trim(is_array($skill) ? ($skill['name'] ?? '') : $skill));
                    if (!empty($normalizedSkill)) {
                        $skillCounts[$normalizedSkill] = ($skillCounts[$normalizedSkill] ?? 0) + 1;
                    }
                }
            }

            arsort($skillCounts);

            $trendingSkills = [];
            $rank = 1;
            foreach (array_slice($skillCounts, 0, $limit, true) as $skill => $count) {
                $trendingSkills[] = [
                    'rank' => $rank++,
                    'name' => ucwords($skill),
                    'demand_count' => $count,
                    'category' => $this->skillTaxonomy[$this->getSkillCategory($skill)]['name'] ?? 'Other',
                    'growth_indicator' => $this->getGrowthIndicator($skill),
                ];
            }

            return $trendingSkills;
        });
    }

    /**
     * Get skill recommendations for a candidate.
     */
    public function getSkillRecommendations(User $candidate): array
    {
        $profile = $candidate->candidateProfile;
        $currentSkills = $this->normalizeSkills($profile->skills ?? []);

        // Get trending skills candidate doesn't have
        $trendingSkills = $this->getTrendingSkills(50);
        $recommendations = [];

        foreach ($trendingSkills as $skill) {
            $normalizedSkill = strtolower($skill['name']);
            if (!$this->hasSkill($currentSkills, $normalizedSkill)) {
                // Check if it's complementary to existing skills
                $isComplementary = $this->isComplementarySkill($currentSkills, $normalizedSkill);

                $recommendations[] = [
                    'skill' => $skill['name'],
                    'demand_count' => $skill['demand_count'],
                    'category' => $skill['category'],
                    'is_complementary' => $isComplementary,
                    'priority' => $isComplementary ? 'high' : 'medium',
                    'learning_resources' => $this->getLearningResources($normalizedSkill),
                ];
            }

            if (count($recommendations) >= 10) {
                break;
            }
        }

        // Sort by priority
        usort($recommendations, function ($a, $b) {
            $priorityOrder = ['high' => 0, 'medium' => 1, 'low' => 2];
            return $priorityOrder[$a['priority']] <=> $priorityOrder[$b['priority']];
        });

        return $recommendations;
    }

    /**
     * Compare skills between two candidates.
     */
    public function compareSkills(User $candidate1, User $candidate2): array
    {
        $profile1 = $candidate1->candidateProfile;
        $profile2 = $candidate2->candidateProfile;

        $skills1 = $this->normalizeSkills($profile1->skills ?? []);
        $skills2 = $this->normalizeSkills($profile2->skills ?? []);

        $common = array_intersect($skills1, $skills2);
        $unique1 = array_diff($skills1, $skills2);
        $unique2 = array_diff($skills2, $skills1);

        return [
            'common_skills' => array_values($common),
            'unique_to_first' => array_values($unique1),
            'unique_to_second' => array_values($unique2),
            'similarity_score' => $this->calculateSimilarityScore($skills1, $skills2),
            'comparison' => [
                'candidate1' => [
                    'name' => $candidate1->full_name,
                    'total_skills' => count($skills1),
                ],
                'candidate2' => [
                    'name' => $candidate2->full_name,
                    'total_skills' => count($skills2),
                ],
            ],
        ];
    }

    /**
     * Normalize skills array.
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
     * Check if candidate has a skill (with fuzzy matching).
     */
    private function hasSkill(array $candidateSkills, string $requiredSkill): bool
    {
        $requiredSkill = strtolower(trim($requiredSkill));

        foreach ($candidateSkills as $skill) {
            if ($skill === $requiredSkill) {
                return true;
            }

            // Partial match
            if (str_contains($skill, $requiredSkill) || str_contains($requiredSkill, $skill)) {
                return true;
            }

            // Check variations
            if ($this->areSkillsSimilar($skill, $requiredSkill)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Check if two skills are similar/related.
     */
    private function areSkillsSimilar(string $skill1, string $skill2): bool
    {
        $variations = [
            'javascript' => ['js', 'ecmascript'],
            'typescript' => ['ts'],
            'node.js' => ['nodejs', 'node'],
            'react.js' => ['reactjs', 'react'],
            'vue.js' => ['vuejs', 'vue'],
            'angular.js' => ['angularjs', 'angular'],
            'next.js' => ['nextjs', 'next'],
            'postgresql' => ['postgres'],
            'mongodb' => ['mongo'],
            'c#' => ['csharp', 'c sharp'],
            'c++' => ['cpp'],
        ];

        foreach ($variations as $main => $variants) {
            if (($skill1 === $main || in_array($skill1, $variants)) &&
                ($skill2 === $main || in_array($skill2, $variants))) {
                return true;
            }
        }

        return false;
    }

    /**
     * Get the category for a skill.
     */
    private function getSkillCategory(string $skill): ?string
    {
        $skill = strtolower($skill);

        foreach ($this->skillTaxonomy as $category => $data) {
            if (in_array($skill, $data['skills'])) {
                return $category;
            }
        }

        return null;
    }

    /**
     * Get numeric value for skill level.
     */
    private function getLevelValue(string $level): float
    {
        $levels = [
            'beginner' => 0.25,
            'elementary' => 0.35,
            'intermediate' => 0.5,
            'advanced' => 0.75,
            'expert' => 1.0,
        ];

        return $levels[strtolower($level)] ?? 0.5;
    }

    /**
     * Get strongest skill category.
     */
    private function getStrongestCategory(array $categoryStrengths): ?string
    {
        if (empty($categoryStrengths)) {
            return null;
        }

        $strongest = null;
        $highestScore = 0;

        foreach ($categoryStrengths as $category => $data) {
            $score = $data['skill_count'] * $data['average_proficiency'];
            if ($score > $highestScore) {
                $highestScore = $score;
                $strongest = $data['name'];
            }
        }

        return $strongest;
    }

    /**
     * Calculate skill diversity score.
     */
    private function calculateDiversityScore(array $categorizedSkills): int
    {
        $categoryCount = count($categorizedSkills);
        $maxCategories = count($this->skillTaxonomy);

        return (int) round(($categoryCount / $maxCategories) * 100);
    }

    /**
     * Get growth indicator for a skill.
     */
    private function getGrowthIndicator(string $skill): string
    {
        $highGrowthSkills = ['kubernetes', 'rust', 'go', 'typescript', 'python', 'react', 'aws', 'machine learning'];
        $stableSkills = ['java', 'javascript', 'sql', 'linux', 'git'];

        if (in_array($skill, $highGrowthSkills)) {
            return 'high';
        }

        if (in_array($skill, $stableSkills)) {
            return 'stable';
        }

        return 'moderate';
    }

    /**
     * Check if a skill is complementary to existing skills.
     */
    private function isComplementarySkill(array $currentSkills, string $newSkill): bool
    {
        $complementaryPairs = [
            'react' => ['redux', 'typescript', 'next.js', 'graphql'],
            'node.js' => ['express', 'mongodb', 'typescript', 'graphql'],
            'python' => ['django', 'flask', 'tensorflow', 'pandas'],
            'java' => ['spring', 'kubernetes', 'maven', 'gradle'],
            'aws' => ['docker', 'kubernetes', 'terraform', 'lambda'],
            'docker' => ['kubernetes', 'ci/cd', 'jenkins'],
        ];

        foreach ($complementaryPairs as $base => $complements) {
            if (in_array($base, $currentSkills) && in_array($newSkill, $complements)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Get learning resources for a skill.
     */
    private function getLearningResources(string $skill): array
    {
        // In production, this would pull from a database or API
        return [
            [
                'type' => 'course',
                'platform' => 'Udemy',
                'suggestion' => "Learn {$skill} fundamentals",
            ],
            [
                'type' => 'documentation',
                'platform' => 'Official Docs',
                'suggestion' => "Read official {$skill} documentation",
            ],
        ];
    }

    /**
     * Get learning recommendations for missing skills.
     */
    private function getSkillLearningRecommendations(array $missingSkills): array
    {
        $recommendations = [];

        foreach (array_slice($missingSkills, 0, 5) as $skill) {
            $recommendations[] = [
                'skill' => $skill,
                'resources' => $this->getLearningResources($skill),
                'estimated_time' => $this->estimateLearningTime($skill),
            ];
        }

        return $recommendations;
    }

    /**
     * Estimate learning time for a skill.
     */
    private function estimateLearningTime(string $skill): string
    {
        $complexSkills = ['kubernetes', 'machine learning', 'aws', 'azure', 'system design'];
        $mediumSkills = ['react', 'vue', 'django', 'spring', 'docker'];

        if (in_array($skill, $complexSkills)) {
            return '3-6 months';
        }

        if (in_array($skill, $mediumSkills)) {
            return '1-3 months';
        }

        return '2-4 weeks';
    }

    /**
     * Calculate similarity score between two skill sets.
     */
    private function calculateSimilarityScore(array $skills1, array $skills2): int
    {
        if (empty($skills1) || empty($skills2)) {
            return 0;
        }

        $intersection = count(array_intersect($skills1, $skills2));
        $union = count(array_unique(array_merge($skills1, $skills2)));

        return (int) round(($intersection / $union) * 100);
    }
}
