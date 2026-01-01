<?php

namespace Tests\Unit\Services;

use App\Models\CandidateProfile;
use App\Models\Company;
use App\Models\Job;
use App\Models\JobCategory;
use App\Models\User;
use App\Services\JobMatchingService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class JobMatchingServiceTest extends TestCase
{
    use RefreshDatabase;

    private JobMatchingService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new JobMatchingService();
    }

    /**
     * Test match score is 0 when candidate has no profile.
     */
    public function test_match_score_is_zero_without_profile(): void
    {
        $candidate = User::factory()->create(['user_type' => 'candidate']);
        $job = $this->createJob();

        $score = $this->service->calculateMatchScore($candidate, $job);

        $this->assertEquals(0, $score);
    }

    /**
     * Test perfect skill match gives high score.
     */
    public function test_perfect_skill_match_gives_high_score(): void
    {
        $candidate = $this->createCandidateWithProfile([
            'skills' => ['PHP', 'Laravel', 'MySQL', 'JavaScript', 'React'],
        ]);

        $job = $this->createJob([
            'required_skills' => ['PHP', 'Laravel', 'MySQL'],
            'preferred_skills' => ['JavaScript', 'React'],
        ]);

        $score = $this->service->calculateMatchScore($candidate, $job);

        $this->assertGreaterThanOrEqual(70, $score);
    }

    /**
     * Test no skill match gives low score.
     */
    public function test_no_skill_match_gives_low_score(): void
    {
        $candidate = $this->createCandidateWithProfile([
            'skills' => ['Python', 'Django', 'PostgreSQL'],
        ]);

        $job = $this->createJob([
            'required_skills' => ['PHP', 'Laravel', 'MySQL'],
            'preferred_skills' => ['JavaScript', 'React'],
        ]);

        $score = $this->service->calculateMatchScore($candidate, $job);

        $this->assertLessThanOrEqual(50, $score);
    }

    /**
     * Test experience match within range gives high score.
     */
    public function test_experience_within_range_gives_high_score(): void
    {
        $candidate = $this->createCandidateWithProfile([
            'skills' => ['PHP'],
        ]);
        $candidate->experience_years = 5;
        $candidate->save();

        $job = $this->createJob([
            'min_experience' => 3,
            'max_experience' => 7,
        ]);

        $score = $this->service->calculateMatchScore($candidate, $job);

        // Experience should contribute positively
        $this->assertGreaterThan(0, $score);
    }

    /**
     * Test underqualified experience reduces score.
     */
    public function test_underqualified_experience_reduces_score(): void
    {
        $candidate = $this->createCandidateWithProfile([
            'skills' => ['PHP', 'Laravel'],
        ]);
        $candidate->experience_years = 1;
        $candidate->save();

        $job = $this->createJob([
            'required_skills' => ['PHP', 'Laravel'],
            'min_experience' => 5,
            'max_experience' => 10,
        ]);

        $score1 = $this->service->calculateMatchScore($candidate, $job);

        // Create another candidate with matching experience
        $candidate2 = $this->createCandidateWithProfile([
            'skills' => ['PHP', 'Laravel'],
        ]);
        $candidate2->experience_years = 6;
        $candidate2->save();

        $score2 = $this->service->calculateMatchScore($candidate2, $job);

        $this->assertLessThan($score2, $score1);
    }

    /**
     * Test remote jobs match any location.
     */
    public function test_remote_jobs_match_any_location(): void
    {
        $candidate = $this->createCandidateWithProfile([
            'skills' => ['PHP'],
        ]);
        $candidate->location = 'Mombasa';
        $candidate->save();

        $remoteJob = $this->createJob([
            'is_remote' => true,
            'location' => 'San Francisco',
        ]);

        $localJob = $this->createJob([
            'is_remote' => false,
            'location' => 'Nairobi',
        ]);

        $remoteScore = $this->service->calculateMatchScore($candidate, $remoteJob);
        $localScore = $this->service->calculateMatchScore($candidate, $localJob);

        // Remote job should have better location match
        $this->assertGreaterThanOrEqual($localScore, $remoteScore);
    }

    /**
     * Test similar skills are recognized.
     */
    public function test_similar_skills_are_recognized(): void
    {
        $candidate = $this->createCandidateWithProfile([
            'skills' => ['JavaScript', 'TypeScript', 'NodeJS'],
        ]);

        $job = $this->createJob([
            'required_skills' => ['JS', 'Node.js', 'TS'],
        ]);

        $score = $this->service->calculateMatchScore($candidate, $job);

        // Should recognize JS = JavaScript, Node.js = NodeJS, TS = TypeScript
        $this->assertGreaterThan(30, $score);
    }

    /**
     * Test get recommended jobs returns sorted by score.
     */
    public function test_get_recommended_jobs_returns_sorted_by_score(): void
    {
        $candidate = $this->createCandidateWithProfile([
            'skills' => ['PHP', 'Laravel', 'MySQL'],
        ]);

        // Create jobs with varying relevance
        $this->createJob([
            'title' => 'PHP Developer',
            'required_skills' => ['PHP', 'Laravel', 'MySQL'],
        ]);

        $this->createJob([
            'title' => 'Python Developer',
            'required_skills' => ['Python', 'Django'],
        ]);

        $this->createJob([
            'title' => 'Full Stack PHP',
            'required_skills' => ['PHP', 'Laravel'],
        ]);

        $recommendations = $this->service->getRecommendedJobs($candidate, 10);

        $this->assertGreaterThan(0, $recommendations->count());

        // Verify sorted by match_score descending
        $scores = $recommendations->pluck('match_score')->toArray();
        $sortedScores = $scores;
        rsort($sortedScores);

        $this->assertEquals($sortedScores, $scores);
    }

    /**
     * Test recommended jobs excludes already applied jobs.
     */
    public function test_recommended_jobs_excludes_applied_jobs(): void
    {
        $candidate = $this->createCandidateWithProfile([
            'skills' => ['PHP'],
        ]);

        $job = $this->createJob(['title' => 'Applied Job']);

        // Create an application
        $candidate->jobApplications()->create([
            'job_id' => $job->id,
            'status' => 'pending',
        ]);

        $recommendations = $this->service->getRecommendedJobs($candidate, 10);

        $recommendedIds = $recommendations->pluck('id')->toArray();
        $this->assertNotContains($job->id, $recommendedIds);
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
