<?php

namespace Tests\Unit\Services;

use App\Models\CandidateProfile;
use App\Models\Company;
use App\Models\Job;
use App\Models\JobCategory;
use App\Models\User;
use App\Services\SkillAnalysisService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SkillAnalysisServiceTest extends TestCase
{
    use RefreshDatabase;

    private SkillAnalysisService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new SkillAnalysisService();
    }

    /**
     * Test skill gap analysis identifies missing required skills.
     */
    public function test_skill_gap_identifies_missing_required_skills(): void
    {
        $candidate = $this->createCandidateWithProfile([
            'skills' => ['PHP', 'MySQL'],
        ]);

        $job = $this->createJob([
            'required_skills' => ['PHP', 'Laravel', 'MySQL', 'Redis'],
            'preferred_skills' => ['Docker', 'AWS'],
        ]);

        $analysis = $this->service->analyzeSkillGap($candidate, $job);

        $this->assertContains('php', array_map('strtolower', $analysis['matched_required']));
        $this->assertContains('mysql', array_map('strtolower', $analysis['matched_required']));
        $this->assertContains('laravel', array_map('strtolower', $analysis['missing_required']));
        $this->assertContains('redis', array_map('strtolower', $analysis['missing_required']));
    }

    /**
     * Test skill gap analysis calculates correct match percentage.
     */
    public function test_skill_gap_calculates_correct_match_percentage(): void
    {
        $candidate = $this->createCandidateWithProfile([
            'skills' => ['PHP', 'Laravel', 'MySQL', 'Docker'],
        ]);

        $job = $this->createJob([
            'required_skills' => ['PHP', 'Laravel', 'MySQL', 'Redis'],
            'preferred_skills' => ['Docker', 'AWS'],
        ]);

        $analysis = $this->service->analyzeSkillGap($candidate, $job);

        // 3 out of 4 required = 75%, 1 out of 2 preferred = 50%
        // Overall = 75 * 0.7 + 50 * 0.3 = 52.5 + 15 = 67.5
        $this->assertEquals(75, $analysis['required_match']);
        $this->assertEquals(50, $analysis['preferred_match']);
    }

    /**
     * Test skill proficiency analysis categorizes skills correctly.
     */
    public function test_skill_proficiency_analysis_categorizes_skills(): void
    {
        $candidate = $this->createCandidateWithProfile([
            'skills' => [
                ['name' => 'PHP', 'level' => 'advanced'],
                ['name' => 'Laravel', 'level' => 'advanced'],
                ['name' => 'MySQL', 'level' => 'intermediate'],
                ['name' => 'React', 'level' => 'beginner'],
                ['name' => 'Docker', 'level' => 'intermediate'],
            ],
        ]);

        $analysis = $this->service->analyzeSkillProficiency($candidate);

        $this->assertArrayHasKey('categorized_skills', $analysis);
        $this->assertArrayHasKey('category_strengths', $analysis);
        $this->assertArrayHasKey('strongest_category', $analysis);
        $this->assertArrayHasKey('skill_diversity_score', $analysis);

        // PHP and Laravel should be in backend category
        $this->assertArrayHasKey('backend', $analysis['categorized_skills']);
    }

    /**
     * Test trending skills returns skills sorted by demand.
     */
    public function test_trending_skills_returns_sorted_by_demand(): void
    {
        // Create jobs with various skills
        $this->createJob(['required_skills' => ['PHP', 'Laravel', 'MySQL']]);
        $this->createJob(['required_skills' => ['PHP', 'Laravel', 'Redis']]);
        $this->createJob(['required_skills' => ['PHP', 'React', 'MySQL']]);
        $this->createJob(['required_skills' => ['Python', 'Django']]);

        $trending = $this->service->getTrendingSkills(10);

        $this->assertNotEmpty($trending);

        // Verify sorted by demand_count descending
        $counts = array_column($trending, 'demand_count');
        $sortedCounts = $counts;
        rsort($sortedCounts);

        $this->assertEquals($sortedCounts, $counts);

        // PHP should be most in-demand (appears in 3 jobs)
        $this->assertEquals('php', strtolower($trending[0]['name']));
    }

    /**
     * Test skill recommendations returns skills candidate doesn't have.
     */
    public function test_skill_recommendations_excludes_existing_skills(): void
    {
        $candidate = $this->createCandidateWithProfile([
            'skills' => ['PHP', 'Laravel', 'MySQL'],
        ]);

        // Create demand for various skills
        $this->createJob(['required_skills' => ['PHP', 'Laravel', 'Docker', 'Redis']]);
        $this->createJob(['required_skills' => ['PHP', 'Docker', 'Kubernetes']]);

        $recommendations = $this->service->getSkillRecommendations($candidate);

        $recommendedSkills = array_column($recommendations, 'skill');
        $recommendedSkillsLower = array_map('strtolower', $recommendedSkills);

        $this->assertNotContains('php', $recommendedSkillsLower);
        $this->assertNotContains('laravel', $recommendedSkillsLower);
        $this->assertNotContains('mysql', $recommendedSkillsLower);

        // Docker should be recommended (in demand, not in candidate's skills)
        $this->assertContains('docker', $recommendedSkillsLower);
    }

    /**
     * Test skill comparison between two candidates.
     */
    public function test_skill_comparison_identifies_common_and_unique_skills(): void
    {
        $candidate1 = $this->createCandidateWithProfile([
            'skills' => ['PHP', 'Laravel', 'MySQL', 'Docker'],
        ]);

        $candidate2 = $this->createCandidateWithProfile([
            'skills' => ['PHP', 'Laravel', 'React', 'TypeScript'],
        ]);

        $comparison = $this->service->compareSkills($candidate1, $candidate2);

        $this->assertArrayHasKey('common_skills', $comparison);
        $this->assertArrayHasKey('unique_to_first', $comparison);
        $this->assertArrayHasKey('unique_to_second', $comparison);
        $this->assertArrayHasKey('similarity_score', $comparison);

        $commonLower = array_map('strtolower', $comparison['common_skills']);
        $this->assertContains('php', $commonLower);
        $this->assertContains('laravel', $commonLower);

        $unique1Lower = array_map('strtolower', $comparison['unique_to_first']);
        $this->assertContains('mysql', $unique1Lower);
        $this->assertContains('docker', $unique1Lower);

        $unique2Lower = array_map('strtolower', $comparison['unique_to_second']);
        $this->assertContains('react', $unique2Lower);
        $this->assertContains('typescript', $unique2Lower);
    }

    /**
     * Test skill gap provides learning recommendations.
     */
    public function test_skill_gap_provides_learning_recommendations(): void
    {
        $candidate = $this->createCandidateWithProfile([
            'skills' => ['PHP'],
        ]);

        $job = $this->createJob([
            'required_skills' => ['PHP', 'Laravel', 'Docker', 'Kubernetes', 'AWS'],
        ]);

        $analysis = $this->service->analyzeSkillGap($candidate, $job);

        $this->assertArrayHasKey('learning_recommendations', $analysis);
        $this->assertNotEmpty($analysis['learning_recommendations']);

        // Each recommendation should have skill, resources, and estimated_time
        $firstRec = $analysis['learning_recommendations'][0];
        $this->assertArrayHasKey('skill', $firstRec);
        $this->assertArrayHasKey('resources', $firstRec);
        $this->assertArrayHasKey('estimated_time', $firstRec);
    }

    /**
     * Helper to create a job with given attributes.
     */
    private function createJob(array $attributes = []): Job
    {
        $category = JobCategory::firstOrCreate(
            ['name' => 'Technology'],
            ['slug' => 'technology']
        );

        $employer = User::factory()->create(['user_type' => 'employer']);
        $company = Company::factory()->create(['user_id' => $employer->id]);

        return Job::factory()->create(array_merge([
            'company_id' => $company->id,
            'job_category_id' => $category->id,
            'status' => 'active',
            'application_deadline' => now()->addDays(30),
        ], $attributes));
    }

    /**
     * Helper to create a candidate with profile.
     */
    private function createCandidateWithProfile(array $profileAttributes = []): User
    {
        $candidate = User::factory()->create(['user_type' => 'candidate']);

        CandidateProfile::create(array_merge([
            'user_id' => $candidate->id,
        ], $profileAttributes));

        return $candidate->fresh();
    }
}
