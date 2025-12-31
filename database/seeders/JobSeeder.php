<?php

namespace Database\Seeders;

use App\Models\Job;
use App\Models\Company;
use App\Models\JobCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class JobSeeder extends Seeder
{
    public function run(): void
    {
        $techCategory = JobCategory::where('slug', 'technology')->first();
        $marketingCategory = JobCategory::where('slug', 'marketing')->first();
        $designCategory = JobCategory::where('slug', 'design')->first();
        $salesCategory = JobCategory::where('slug', 'sales')->first();

        $techCorp = Company::where('slug', 'techcorp-kenya')->first();
        $innovate = Company::where('slug', 'innovate-solutions')->first();
        $globalTech = Company::where('slug', 'globaltech-africa')->first();

        $jobs = [
            // TechCorp Jobs
            [
                'company_id' => $techCorp->id,
                'job_category_id' => $techCategory->id,
                'title' => 'Senior Software Engineer',
                'description' => 'We are looking for a Senior Software Engineer to join our growing team. You will be responsible for designing, developing, and maintaining high-quality software applications.',
                'requirements' => "- 5+ years of experience in software development\n- Strong proficiency in React, Node.js, and TypeScript\n- Experience with cloud platforms (AWS, GCP, or Azure)\n- Excellent problem-solving skills\n- Strong communication skills",
                'location' => 'Nairobi, Kenya',
                'job_type' => 'full-time',
                'experience_level' => 'senior',
                'salary_min' => 200000,
                'salary_max' => 350000,
                'salary_period' => 'monthly',
                'skills_required' => ['React', 'Node.js', 'TypeScript', 'AWS', 'PostgreSQL'],
                'tags' => ['remote-friendly', 'tech', 'senior'],
                'is_featured' => true,
                'is_urgent' => false,
            ],
            [
                'company_id' => $techCorp->id,
                'job_category_id' => $techCategory->id,
                'title' => 'Junior Frontend Developer',
                'description' => 'Join our frontend team and help build amazing user experiences. Great opportunity for someone starting their career in web development.',
                'requirements' => "- 1-2 years of experience with HTML, CSS, JavaScript\n- Knowledge of React or Vue.js\n- Understanding of responsive design\n- Eager to learn and grow",
                'location' => 'Nairobi, Kenya',
                'job_type' => 'full-time',
                'experience_level' => 'entry',
                'salary_min' => 60000,
                'salary_max' => 100000,
                'salary_period' => 'monthly',
                'skills_required' => ['HTML', 'CSS', 'JavaScript', 'React'],
                'tags' => ['entry-level', 'frontend', 'tech'],
                'is_featured' => false,
                'is_urgent' => true,
            ],
            // Innovate Solutions Jobs
            [
                'company_id' => $innovate->id,
                'job_category_id' => $techCategory->id,
                'title' => 'Mobile App Developer (Flutter)',
                'description' => 'We are looking for a talented Flutter developer to build cross-platform mobile applications for our clients.',
                'requirements' => "- 3+ years of mobile development experience\n- Strong proficiency in Flutter and Dart\n- Experience with REST APIs and state management\n- Published apps on App Store or Google Play",
                'location' => 'Mombasa, Kenya',
                'job_type' => 'full-time',
                'experience_level' => 'mid',
                'salary_min' => 150000,
                'salary_max' => 250000,
                'salary_period' => 'monthly',
                'skills_required' => ['Flutter', 'Dart', 'Firebase', 'REST APIs'],
                'tags' => ['mobile', 'flutter', 'tech'],
                'is_featured' => true,
                'is_urgent' => false,
            ],
            [
                'company_id' => $innovate->id,
                'job_category_id' => $designCategory->id,
                'title' => 'UI/UX Designer',
                'description' => 'Create beautiful and intuitive user interfaces for our mobile and web applications. Work closely with developers to bring designs to life.',
                'requirements' => "- 3+ years of UI/UX design experience\n- Proficiency in Figma, Sketch, or Adobe XD\n- Strong portfolio showcasing mobile and web designs\n- Understanding of user research and usability testing",
                'location' => 'Mombasa, Kenya',
                'job_type' => 'full-time',
                'experience_level' => 'mid',
                'salary_min' => 120000,
                'salary_max' => 200000,
                'salary_period' => 'monthly',
                'skills_required' => ['Figma', 'UI Design', 'UX Research', 'Prototyping'],
                'tags' => ['design', 'creative', 'ui-ux'],
                'is_featured' => false,
                'is_urgent' => false,
            ],
            // GlobalTech Jobs
            [
                'company_id' => $globalTech->id,
                'job_category_id' => $techCategory->id,
                'title' => 'DevOps Engineer',
                'description' => 'Join our infrastructure team and help build and maintain scalable, secure cloud infrastructure for enterprise clients.',
                'requirements' => "- 4+ years of DevOps/Infrastructure experience\n- Strong experience with AWS or Azure\n- Proficiency in Docker, Kubernetes, and CI/CD\n- Experience with infrastructure as code (Terraform, CloudFormation)\n- Strong scripting skills (Python, Bash)",
                'location' => 'Kisumu, Kenya',
                'job_type' => 'full-time',
                'experience_level' => 'senior',
                'salary_min' => 250000,
                'salary_max' => 400000,
                'salary_period' => 'monthly',
                'skills_required' => ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Python'],
                'tags' => ['devops', 'cloud', 'senior'],
                'is_featured' => true,
                'is_urgent' => true,
            ],
            [
                'company_id' => $globalTech->id,
                'job_category_id' => $marketingCategory->id,
                'title' => 'Digital Marketing Manager',
                'description' => 'Lead our digital marketing efforts across multiple channels. Develop and execute marketing strategies to drive brand awareness and lead generation.',
                'requirements' => "- 5+ years of digital marketing experience\n- Experience with SEO, SEM, and social media marketing\n- Strong analytical skills and data-driven approach\n- Experience with marketing automation tools\n- Excellent communication and leadership skills",
                'location' => 'Kisumu, Kenya',
                'job_type' => 'full-time',
                'experience_level' => 'senior',
                'salary_min' => 180000,
                'salary_max' => 280000,
                'salary_period' => 'monthly',
                'skills_required' => ['SEO', 'Google Ads', 'Social Media', 'Analytics', 'Content Strategy'],
                'tags' => ['marketing', 'digital', 'senior'],
                'is_featured' => false,
                'is_urgent' => false,
            ],
            [
                'company_id' => $globalTech->id,
                'job_category_id' => $salesCategory->id,
                'title' => 'Sales Representative',
                'description' => 'Drive sales growth by identifying and pursuing new business opportunities. Build and maintain relationships with clients across East Africa.',
                'requirements' => "- 2+ years of B2B sales experience\n- Strong communication and negotiation skills\n- Self-motivated with a results-oriented mindset\n- Experience in technology or consulting industry preferred\n- Valid driver's license",
                'location' => 'Nairobi, Kenya',
                'job_type' => 'full-time',
                'experience_level' => 'mid',
                'salary_min' => 80000,
                'salary_max' => 150000,
                'salary_period' => 'monthly',
                'skills_required' => ['Sales', 'Negotiation', 'CRM', 'B2B Sales'],
                'tags' => ['sales', 'b2b', 'commission'],
                'is_featured' => false,
                'is_urgent' => false,
            ],
            [
                'company_id' => $techCorp->id,
                'job_category_id' => $techCategory->id,
                'title' => 'Data Scientist',
                'description' => 'Join our data team to build machine learning models and derive insights from large datasets. Work on cutting-edge AI projects.',
                'requirements' => "- 3+ years of data science experience\n- Strong proficiency in Python and SQL\n- Experience with machine learning frameworks (TensorFlow, PyTorch)\n- Knowledge of statistical modeling and analysis\n- Experience with big data technologies is a plus",
                'location' => 'Nairobi, Kenya',
                'job_type' => 'full-time',
                'experience_level' => 'mid',
                'salary_min' => 180000,
                'salary_max' => 300000,
                'salary_period' => 'monthly',
                'skills_required' => ['Python', 'Machine Learning', 'SQL', 'TensorFlow', 'Statistics'],
                'tags' => ['data-science', 'ai', 'ml'],
                'is_featured' => true,
                'is_urgent' => false,
            ],
        ];

        foreach ($jobs as $jobData) {
            $jobData['slug'] = Str::slug($jobData['title'] . '-' . uniqid());
            $jobData['apply_deadline'] = now()->addDays(rand(14, 60));
            $jobData['status'] = 'active';
            Job::create($jobData);
        }
    }
}
