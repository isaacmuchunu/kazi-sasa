<?php

namespace App\Http\Controllers;

use App\Models\Job;
use App\Models\Company;
use App\Models\JobCategory;
use App\Models\Blog;
use App\Models\Newsletter;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        $featuredJobs = Job::with(['company', 'jobCategory'])
            ->featured()
            ->active()
            ->latest()
            ->limit(6)
            ->get()
            ->map(function ($job) {
                return [
                    'id' => $job->id,
                    'title' => $job->title,
                    'slug' => $job->slug,
                    'location' => $job->location,
                    'job_type' => $job->job_type,
                    'salary_range' => $job->salary_range,
                    'is_featured' => $job->is_featured,
                    'is_urgent' => $job->is_urgent,
                    'posted_ago' => $job->created_at->diffForHumans(),
                    'company' => [
                        'name' => $job->company->name,
                        'logo' => $job->company->logo,
                    ],
                    'category' => $job->category->name ?? 'General',
                ];
            });

        $categories = JobCategory::withCount('jobs')
            ->orderBy('jobs_count', 'desc')
            ->limit(8)
            ->get()
            ->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'slug' => $category->slug,
                    'jobs_count' => $category->jobs_count,
                    'icon' => $this->getCategoryIcon($category->slug),
                    'color' => $this->getCategoryColor($category->slug),
                ];
            });

        $topCompanies = Company::withCount('jobs')
            ->where('is_featured', true)
            ->orderBy('jobs_count', 'desc')
            ->limit(6)
            ->get()
            ->map(function ($company) {
                return [
                    'id' => $company->id,
                    'name' => $company->name,
                    'slug' => $company->slug,
                    'logo' => $company->logo,
                    'jobs_count' => $company->jobs_count,
                ];
            });

        $latestBlogs = Blog::with('author')
            ->published()
            ->latest()
            ->limit(3)
            ->get()
            ->map(function ($blog) {
                return [
                    'id' => $blog->id,
                    'title' => $blog->title,
                    'slug' => $blog->slug,
                    'excerpt' => $blog->excerpt,
                    'image' => $blog->featured_image,
                    'author' => [
                        'name' => $blog->author->first_name . ' ' . $blog->author->last_name,
                    ],
                    'published_at' => $blog->published_at->toDateString(),
                    'reading_time' => $this->calculateReadingTime($blog->content),
                    // 'category' => $blog->category, // Commented out since category field doesn't exist
                ];
            });

        $stats = [
            'totalJobs' => Job::active()->count(),
            'totalCompanies' => Company::count(),
            'totalCandidates' => \App\Models\User::where('user_type', 'candidate')->count(),
            'successRate' => 95, // This could be calculated based on actual data
        ];

        return Inertia::render('Home', [
            'featuredJobs' => $featuredJobs,
            'categories' => $categories,
            'companies' => $topCompanies,
            'latestBlogs' => $latestBlogs,
            'stats' => $stats,
        ]);
    }

    public function about(): Response
    {
        return Inertia::render('About');
    }

    public function contact(): Response
    {
        return Inertia::render('Contact');
    }

    public function contactStore(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'subject' => 'required|string|max:255',
            'message' => 'required|string|max:2000',
        ]);

        // Here you could send an email, store in database, etc.
        // For now, we'll just return a success response

        return back()->with('success', 'Thank you for your message. We will get back to you soon!');
    }

    public function faq(): Response
    {
        $faqs = [
            [
                'question' => 'How do I create an account?',
                'answer' => 'Click on the "Register" button in the top navigation and fill out the required information.',
            ],
            [
                'question' => 'Is it free to use Kazi Sasa?',
                'answer' => 'Yes, creating an account and applying for jobs is completely free for job seekers.',
            ],
            [
                'question' => 'How do I post a job?',
                'answer' => 'Employers can post jobs by creating an account and using our job posting feature.',
            ],
            // Add more FAQs as needed
        ];

        return Inertia::render('FAQ', [
            'faqs' => $faqs,
        ]);
    }

    public function pricing(): Response
    {
        $plans = [
            [
                'name' => 'Basic',
                'price' => 0,
                'period' => 'month',
                'features' => [
                    'Post up to 3 jobs',
                    'Basic job listing',
                    'Email support',
                ],
            ],
            [
                'name' => 'Professional',
                'price' => 49,
                'period' => 'month',
                'features' => [
                    'Post unlimited jobs',
                    'Featured job listings',
                    'Priority support',
                    'Advanced analytics',
                ],
            ],
            [
                'name' => 'Enterprise',
                'price' => 99,
                'period' => 'month',
                'features' => [
                    'Everything in Professional',
                    'Custom branding',
                    'Dedicated account manager',
                    'API access',
                ],
            ],
        ];

        return Inertia::render('Pricing', [
            'plans' => $plans,
        ]);
    }

    public function testimonials(): Response
    {
        $testimonials = [
            [
                'name' => 'Sarah Wanjiku',
                'position' => 'Software Engineer',
                'company' => 'TechCorp Kenya',
                'image' => '/assets/img/testimonial-img.jpg',
                'rating' => 5,
                'content' => 'Kazi Sasa helped me find my dream job in tech. The platform is user-friendly and I got multiple interview calls within a week of posting my resume.',
            ],
            [
                'name' => 'John Mwangi',
                'position' => 'Marketing Manager',
                'company' => 'Creative Agency',
                'image' => '/assets/img/testimonial-img-2.jpg',
                'rating' => 5,
                'content' => 'Excellent job portal! I was able to connect with top companies and landed a great position. Highly recommend to anyone looking for career opportunities.',
            ],
        ];

        return Inertia::render('Testimonials', [
            'testimonials' => $testimonials,
        ]);
    }

    public function categories(): Response
    {
        $categories = JobCategory::withCount('jobs')
            ->orderBy('name')
            ->get()
            ->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'slug' => $category->slug,
                    'description' => $category->description,
                    'jobs_count' => $category->jobs_count,
                    'icon' => $this->getCategoryIcon($category->slug),
                    'color' => $this->getCategoryColor($category->slug),
                ];
            });

        return Inertia::render('Categories', [
            'categories' => $categories,
        ]);
    }

    public function privacyPolicy(): Response
    {
        return Inertia::render('PrivacyPolicy');
    }

    public function termsConditions(): Response
    {
        return Inertia::render('TermsConditions');
    }

    public function newsletter(Request $request)
    {
        $request->validate([
            'email' => 'required|email|unique:newsletters,email',
        ]);

        Newsletter::create([
            'email' => $request->email,
        ]);

        return response()->json([
            'message' => 'Successfully subscribed to newsletter!',
        ]);
    }

    private function getCategoryIcon(string $slug): string
    {
        $icons = [
            'technology' => 'bx-code-alt',
            'education' => 'bx-graduation',
            'healthcare' => 'bx-plus-medical',
            'finance' => 'bx-dollar-circle',
            'marketing' => 'bx-trending-up',
            'engineering' => 'bx-cog',
            'sales' => 'bx-shopping-bag',
            'design' => 'bx-palette',
            'administration' => 'bx-buildings',
            'customer-service' => 'bx-support',
        ];

        return $icons[$slug] ?? 'bx-briefcase';
    }

    private function getCategoryColor(string $slug): string
    {
        $colors = [
            'technology' => 'bg-blue-100 text-blue-600',
            'education' => 'bg-green-100 text-green-600',
            'healthcare' => 'bg-red-100 text-red-600',
            'finance' => 'bg-yellow-100 text-yellow-600',
            'marketing' => 'bg-purple-100 text-purple-600',
            'engineering' => 'bg-indigo-100 text-indigo-600',
            'sales' => 'bg-orange-100 text-orange-600',
            'design' => 'bg-pink-100 text-pink-600',
            'administration' => 'bg-gray-100 text-gray-600',
            'customer-service' => 'bg-teal-100 text-teal-600',
        ];

        return $colors[$slug] ?? 'bg-blue-100 text-blue-600';
    }

    private function calculateReadingTime(string $content): string
    {
        $wordCount = str_word_count(strip_tags($content));
        $readingTime = ceil($wordCount / 200); // Average reading speed: 200 words per minute

        return $readingTime . ' min read';
    }
}
