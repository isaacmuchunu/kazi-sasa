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
        $this->command->info('Starting database seeding...');
        
        // Clear existing data in order of dependencies
        $this->command->info('Clearing existing data...');
        Job::query()->delete();
        Blog::query()->delete();
        Company::query()->delete();
        User::query()->where('user_type', '!=', 'admin')->delete();
        JobCategory::query()->delete();
        
        $this->command->info('Creating job categories...');
        // Create job categories
        $technology = JobCategory::create(['name' => 'Technology', 'slug' => 'technology', 'description' => 'Software development, IT, and tech roles']);
        $marketing = JobCategory::create(['name' => 'Marketing', 'slug' => 'marketing', 'description' => 'Digital marketing, advertising, and promotion']);
        $finance = JobCategory::create(['name' => 'Finance', 'slug' => 'finance', 'description' => 'Banking, accounting, and financial services']);
        $design = JobCategory::create(['name' => 'Design', 'slug' => 'design', 'description' => 'UI/UX, graphic design, and creative roles']);
        
        $this->command->info('Creating users...');
        // Create sample employers
        $johnEmployer = User::create([
            'first_name' => 'John',
            'last_name' => 'Manager',
            'user_name' => 'john_manager',
            'gender' => 'male',
            'dob' => '1985-05-15',
            'email' => 'employer@kazisasa.com',
            'password' => Hash::make('password'),
            'user_type' => 'employer',
            'phone_number' => '+254700000001',
            'location' => 'Nairobi, Kenya',
        ]);
        
        $sarahEmployer = User::create([
            'first_name' => 'Sarah',
            'last_name' => 'Davis',
            'user_name' => 'sarah_davis',
            'gender' => 'female',
            'dob' => '1982-08-20',
            'email' => 'sarah@techcorp.co.ke',
            'password' => Hash::make('password'),
            'user_type' => 'employer',
            'phone_number' => '+254700000003',
            'location' => 'Nairobi, Kenya',
        ]);

        // Create sample candidates
        User::create([
            'first_name' => 'Jane',
            'last_name' => 'Candidate',
            'user_name' => 'jane_candidate',
            'gender' => 'female',
            'dob' => '1990-03-22',
            'email' => 'candidate@kazisasa.com',
            'password' => Hash::make('password'),
            'user_type' => 'candidate',
            'phone_number' => '+254700000002',
            'location' => 'Nairobi, Kenya',
        ]);

        $this->command->info('Creating companies...');
        // Create companies
        $techCorp = Company::create([
            'name' => 'TechCorp Kenya',
            'slug' => 'techcorp-kenya',
            'description' => 'Leading technology company in East Africa specializing in software solutions.',
            'website' => 'https://techcorp.co.ke',
            'location' => 'Nairobi, Kenya',
            'email' => 'info@techcorp.co.ke',
            'user_id' => $johnEmployer->id,
            'is_verified' => true,
        ]);

        $digitalAgency = Company::create([
            'name' => 'Nairobi Digital Agency',
            'slug' => 'nairobi-digital-agency',
            'description' => 'Creative digital agency specializing in marketing and design.',
            'website' => 'https://nairobidigital.co.ke',
            'location' => 'Nairobi, Kenya',
            'email' => 'hello@nairobidigital.co.ke',
            'user_id' => $sarahEmployer->id,
            'is_verified' => true,
        ]);

        $this->command->info('Creating jobs...');
        // Create sample jobs
        Job::create([
            'title' => 'Senior Software Engineer',
            'slug' => 'senior-software-engineer-techcorp',
            'company_id' => $techCorp->id,
            'job_category_id' => $technology->id,
            'description' => 'We are looking for an experienced software engineer to join our growing team.',
            'requirements' => '5+ years of PHP/Laravel experience, strong JavaScript/React skills, experience with REST APIs.',
            'location' => 'Nairobi, Kenya',
            'job_type' => 'full-time',
            'experience_level' => 'senior',
            'salary_min' => 200000,
            'salary_max' => 350000,
            'salary_period' => 'monthly',
            'apply_deadline' => now()->addDays(30),
            'skills_required' => json_encode(['PHP', 'Laravel', 'JavaScript', 'React']),
            'is_featured' => true,
            'status' => 'active',
        ]);

        Job::create([
            'title' => 'Digital Marketing Manager',
            'slug' => 'digital-marketing-manager-nairobi-digital',
            'company_id' => $digitalAgency->id,
            'job_category_id' => $marketing->id,
            'description' => 'Lead our digital marketing efforts and help clients achieve marketing goals.',
            'requirements' => '3+ years digital marketing experience, proven track record with SEO/SEM campaigns.',
            'location' => 'Nairobi, Kenya',
            'job_type' => 'full-time',
            'experience_level' => 'mid',
            'salary_min' => 120000,
            'salary_max' => 180000,
            'salary_period' => 'monthly',
            'apply_deadline' => now()->addDays(25),
            'skills_required' => json_encode(['SEO', 'SEM', 'Social Media']),
            'is_featured' => false,
            'status' => 'active',
        ]);

        Job::create([
            'title' => 'UI/UX Designer',
            'slug' => 'ui-ux-designer-nairobi-digital',
            'company_id' => $digitalAgency->id,
            'job_category_id' => $design->id,
            'description' => 'Creative designer needed for client projects with modern design tools.',
            'requirements' => '2+ years UI/UX design experience, proficiency in Figma/Sketch.',
            'location' => 'Nairobi, Kenya',
            'job_type' => 'full-time',
            'experience_level' => 'mid',
            'salary_min' => 100000,
            'salary_max' => 150000,
            'salary_period' => 'monthly',
            'apply_deadline' => now()->addDays(18),
            'skills_required' => json_encode(['Figma', 'Sketch', 'Adobe XD']),
            'is_featured' => false,
            'is_urgent' => true,
            'status' => 'active',
        ]);

        $this->command->info('Creating blog posts...');
        // Create sample blog posts
        Blog::create([
            'title' => '10 Tips for a Successful Job Interview',
            'slug' => '10-tips-successful-job-interview',
            'excerpt' => 'Master the art of job interviews with these proven strategies.',
            'content' => 'Job interviews can be nerve-wracking, but with proper preparation, you can ace them. Here are 10 essential tips to help you succeed in your next interview.',
            'author_id' => $johnEmployer->id,
            'status' => 'published',
            'published_at' => now()->subDays(7),
            'tags' => json_encode(['Career Tips', 'Interview', 'Job Search']),
        ]);

        Blog::create([
            'title' => 'The Future of Tech Jobs in Kenya',
            'slug' => 'future-tech-jobs-kenya',
            'excerpt' => 'Exploring emerging trends and opportunities in Kenya\'s technology sector.',
            'content' => 'Kenya\'s technology sector is booming with new opportunities emerging daily. From artificial intelligence to blockchain technology, the future looks bright.',
            'author_id' => $johnEmployer->id,
            'status' => 'published',
            'published_at' => now()->subDays(14),
            'tags' => json_encode(['Technology', 'Career Trends', 'Kenya']),
        ]);

        $this->command->info('Database seeded successfully!');
    }
}
