<?php

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Company;
use App\Models\JobCategory;
use App\Models\Job;
use App\Models\Blog;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        // Create job categories
        $categories = [
            ['name' => 'Technology', 'slug' => 'technology', 'description' => 'Software development, IT, and tech roles'],
            ['name' => 'Marketing', 'slug' => 'marketing', 'description' => 'Digital marketing, advertising, and promotion'],
            ['name' => 'Finance', 'slug' => 'finance', 'description' => 'Banking, accounting, and financial services'],
        ];

        foreach ($categories as $category) {
            JobCategory::create($category);
        }

        // Create sample employers
        $employers = [
            [
                'first_name' => 'John',
                'last_name' => 'Manager',
                'user_name' => 'john_manager',
                'gender' => 'male',
                'dob' => '1985-05-15',
                'email' => 'employer@kazisasa.com',
                'password' => Hash::make('password'),
                'user_type' => 'employer',
                'phone_number' => '+254700000001',
            ],
        ];

        foreach ($employers as $employer) {
            User::create($employer);
        }

        // Create sample candidates
        $candidates = [
            [
                'first_name' => 'Jane',
                'last_name' => 'Candidate',
                'user_name' => 'jane_candidate',
                'gender' => 'female',
                'dob' => '1990-03-22',
                'email' => 'candidate@kazisasa.com',
                'password' => Hash::make('password'),
                'user_type' => 'candidate',
                'phone_number' => '+254700000002',
            ],
        ];

        foreach ($candidates as $candidate) {
            User::create($candidate);
        }

        // Create sample companies
        $companies = [
            [
                'name' => 'TechCorp Kenya',
                'slug' => 'techcorp-kenya',
                'description' => 'Leading technology company in East Africa',
                'website' => 'https://techcorp.co.ke',
                'location' => 'Nairobi, Kenya',
                'user_id' => 1,
            ],
        ];

        foreach ($companies as $company) {
            Company::create($company);
        }

        // Create sample jobs
        $jobs = [
            [
                'title' => 'Senior Software Engineer',
                'slug' => 'senior-software-engineer-techcorp',
                'company_id' => 1,
                'job_category_id' => 1,
                'description' => 'We are looking for an experienced software engineer to join our growing team.',
                'location' => 'Nairobi, Kenya',
                'job_type' => 'full_time',
                'experience_level' => 'senior',
                'salary_min' => 200000,
                'salary_max' => 350000,
                'salary_period' => 'monthly',
                'apply_deadline' => now()->addDays(30),
                'skills_required' => ['PHP', 'Laravel', 'JavaScript', 'React'],
                'is_featured' => true,
                'is_urgent' => false,
                'status' => 'active',
            ],
        ];

        foreach ($jobs as $job) {
            Job::create($job);
        }

        // Create sample blog posts
        $blogs = [
            [
                'title' => '10 Tips for a Successful Job Interview',
                'slug' => '10-tips-successful-job-interview',
                'excerpt' => 'Master the art of job interviews with these proven strategies.',
                'content' => 'Job interviews can be nerve-wracking, but with proper preparation, you can ace them...',
                'author_id' => 1,
                'status' => 'published',
                'published_at' => now()->subDays(7),
                'tags' => ['Career Tips', 'Interview', 'Job Search'],
            ],
        ];

        foreach ($blogs as $blog) {
            Blog::create($blog);
        }

        $this->command->info('Database seeded successfully!');
    }
}
