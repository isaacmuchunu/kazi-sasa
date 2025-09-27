<?php

use Illuminate\Database\Seeder;
use App\User;
use App\Company;
use App\JobCategory;
use App\Job;
use App\Blog;
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
            ['name' => 'Healthcare', 'slug' => 'healthcare', 'description' => 'Medical, nursing, and healthcare support'],
            ['name' => 'Education', 'slug' => 'education', 'description' => 'Teaching, training, and educational services'],
            ['name' => 'Sales', 'slug' => 'sales', 'description' => 'Sales representatives and business development'],
            ['name' => 'Engineering', 'slug' => 'engineering', 'description' => 'Civil, mechanical, and technical engineering'],
            ['name' => 'Design', 'slug' => 'design', 'description' => 'Graphic design, UX/UI, and creative roles'],
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
            [
                'name' => 'Creative Agency',
                'slug' => 'creative-agency',
                'description' => 'Digital marketing and creative solutions',
                'website' => 'https://creative.co.ke',
                'location' => 'Mombasa, Kenya',
                'user_id' => 1,
            ],
            [
                'name' => 'Kenya Bank',
                'slug' => 'kenya-bank',
                'description' => 'Premier financial institution',
                'website' => 'https://kenyabank.co.ke',
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
                'requirements' => 'Bachelor\'s degree in Computer Science, 5+ years experience in web development',
                'location' => 'Nairobi, Kenya',
                'job_type' => 'full-time',
                'experience_level' => 'senior',
                'salary_min' => 200000,
                'salary_max' => 350000,
                'salary_period' => 'monthly',
                'apply_deadline' => now()->addDays(30),
                'tags' => ['PHP', 'Laravel', 'React', 'MySQL'],
                'skills_required' => ['PHP', 'Laravel', 'JavaScript', 'React'],
                'is_featured' => true,
                'is_urgent' => false,
                'status' => 'active',
            ],
            [
                'title' => 'Digital Marketing Manager',
                'slug' => 'digital-marketing-manager-creative',
                'company_id' => 2,
                'job_category_id' => 2,
                'description' => 'Lead our digital marketing efforts and grow our online presence.',
                'requirements' => 'Bachelor\'s degree in Marketing, 3+ years digital marketing experience',
                'location' => 'Mombasa, Kenya',
                'job_type' => 'full-time',
                'experience_level' => 'mid',
                'salary_min' => 120000,
                'salary_max' => 200000,
                'salary_period' => 'monthly',
                'apply_deadline' => now()->addDays(25),
                'tags' => ['SEO', 'Social Media', 'Google Ads', 'Analytics'],
                'skills_required' => ['SEO', 'Social Media Marketing', 'Google Analytics'],
                'is_featured' => true,
                'is_urgent' => true,
                'status' => 'active',
            ],
            [
                'title' => 'Financial Analyst',
                'slug' => 'financial-analyst-kenya-bank',
                'company_id' => 3,
                'job_category_id' => 3,
                'description' => 'Analyze financial data and provide insights for business decisions.',
                'requirements' => 'Bachelor\'s degree in Finance or Economics, CPA preferred',
                'location' => 'Nairobi, Kenya',
                'job_type' => 'full-time',
                'experience_level' => 'mid',
                'salary_min' => 150000,
                'salary_max' => 250000,
                'salary_period' => 'monthly',
                'apply_deadline' => now()->addDays(20),
                'tags' => ['Finance', 'Excel', 'Analysis', 'Banking'],
                'skills_required' => ['Financial Analysis', 'Excel', 'SQL'],
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
            [
                'title' => 'How to Write a Compelling Resume',
                'slug' => 'how-to-write-compelling-resume',
                'excerpt' => 'Learn how to create a resume that catches attention.',
                'content' => 'Your resume is your first impression with potential employers...',
                'author_id' => 1,
                'status' => 'published',
                'published_at' => now()->subDays(14),
                'tags' => ['Resume Tips', 'Career', 'Job Search'],
            ],
        ];

        foreach ($blogs as $blog) {
            Blog::create($blog);
        }

        $this->command->info('Database seeded successfully!');
    }
}
