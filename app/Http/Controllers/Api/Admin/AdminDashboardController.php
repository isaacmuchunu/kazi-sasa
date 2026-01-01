<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Job;
use App\Models\Company;
use App\Models\JobApplication;
use App\Models\Blog;
use App\Models\Review;
use App\Models\Newsletter;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AdminDashboardController extends Controller
{
    /**
     * Get admin dashboard overview statistics.
     */
    public function index(): JsonResponse
    {
        $now = Carbon::now();
        $lastMonth = $now->copy()->subMonth();
        $lastWeek = $now->copy()->subWeek();

        $stats = [
            'users' => [
                'total' => User::count(),
                'candidates' => User::where('user_type', 'candidate')->count(),
                'employers' => User::where('user_type', 'employer')->count(),
                'admins' => User::where('user_type', 'admin')->count(),
                'verified' => User::where('is_verified', true)->count(),
                'new_this_week' => User::where('created_at', '>=', $lastWeek)->count(),
                'new_this_month' => User::where('created_at', '>=', $lastMonth)->count(),
                'growth_rate' => $this->calculateGrowthRate('users'),
            ],
            'jobs' => [
                'total' => Job::count(),
                'active' => Job::where('status', 'active')->count(),
                'pending' => Job::where('status', 'pending')->count(),
                'expired' => Job::where('status', 'expired')->count(),
                'filled' => Job::where('status', 'filled')->count(),
                'featured' => Job::where('is_featured', true)->count(),
                'new_this_week' => Job::where('created_at', '>=', $lastWeek)->count(),
                'new_this_month' => Job::where('created_at', '>=', $lastMonth)->count(),
            ],
            'companies' => [
                'total' => Company::count(),
                'verified' => Company::where('is_verified', true)->count(),
                'pending_verification' => Company::where('is_verified', false)->count(),
                'active' => Company::where('is_active', true)->count(),
                'new_this_month' => Company::where('created_at', '>=', $lastMonth)->count(),
            ],
            'applications' => [
                'total' => JobApplication::count(),
                'pending' => JobApplication::where('status', 'pending')->count(),
                'reviewed' => JobApplication::where('status', 'reviewed')->count(),
                'shortlisted' => JobApplication::where('status', 'shortlisted')->count(),
                'accepted' => JobApplication::where('status', 'accepted')->count(),
                'rejected' => JobApplication::where('status', 'rejected')->count(),
                'this_week' => JobApplication::where('created_at', '>=', $lastWeek)->count(),
                'this_month' => JobApplication::where('created_at', '>=', $lastMonth)->count(),
            ],
            'content' => [
                'blogs_total' => Blog::count(),
                'blogs_published' => Blog::where('status', 'published')->count(),
                'blogs_draft' => Blog::where('status', 'draft')->count(),
                'reviews_pending' => Review::where('status', 'pending')->count() ?? 0,
                'newsletter_subscribers' => Newsletter::where('is_subscribed', true)->count(),
            ],
        ];

        return $this->success($stats, 'Dashboard statistics retrieved successfully');
    }

    /**
     * Get recent activity for admin dashboard.
     */
    public function recentActivity(): JsonResponse
    {
        $recentUsers = User::latest()
            ->take(10)
            ->get(['id', 'first_name', 'last_name', 'email', 'user_type', 'created_at']);

        $recentJobs = Job::with('company:id,name,logo')
            ->latest()
            ->take(10)
            ->get(['id', 'title', 'company_id', 'status', 'created_at']);

        $recentApplications = JobApplication::with([
            'user:id,first_name,last_name',
            'job:id,title'
        ])
            ->latest()
            ->take(10)
            ->get(['id', 'job_id', 'user_id', 'status', 'created_at']);

        $recentCompanies = Company::with('user:id,first_name,last_name')
            ->latest()
            ->take(10)
            ->get(['id', 'name', 'user_id', 'is_verified', 'created_at']);

        return $this->success([
            'recent_users' => $recentUsers,
            'recent_jobs' => $recentJobs,
            'recent_applications' => $recentApplications,
            'recent_companies' => $recentCompanies,
        ], 'Recent activity retrieved successfully');
    }

    /**
     * Get analytics data for charts.
     */
    public function analytics(Request $request): JsonResponse
    {
        $days = $request->get('days', 30);
        $startDate = Carbon::now()->subDays($days);

        // User registrations by day
        $userRegistrations = User::where('created_at', '>=', $startDate)
            ->selectRaw('DATE(created_at) as date, COUNT(*) as count, user_type')
            ->groupBy('date', 'user_type')
            ->orderBy('date')
            ->get();

        // Job postings by day
        $jobPostings = Job::where('created_at', '>=', $startDate)
            ->selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Applications by day
        $applications = JobApplication::where('created_at', '>=', $startDate)
            ->selectRaw('DATE(created_at) as date, COUNT(*) as count, status')
            ->groupBy('date', 'status')
            ->orderBy('date')
            ->get();

        // Jobs by category
        $jobsByCategory = Job::with('category:id,name')
            ->selectRaw('job_category_id, COUNT(*) as count')
            ->groupBy('job_category_id')
            ->get()
            ->map(function ($item) {
                return [
                    'category' => $item->category->name ?? 'Uncategorized',
                    'count' => $item->count,
                ];
            });

        // Top companies by jobs
        $topCompanies = Company::withCount('jobs')
            ->orderByDesc('jobs_count')
            ->take(10)
            ->get(['id', 'name', 'logo']);

        // Application status distribution
        $applicationStatus = JobApplication::selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->get();

        return $this->success([
            'user_registrations' => $userRegistrations,
            'job_postings' => $jobPostings,
            'applications' => $applications,
            'jobs_by_category' => $jobsByCategory,
            'top_companies' => $topCompanies,
            'application_status' => $applicationStatus,
            'period' => $days . ' days',
        ], 'Analytics data retrieved successfully');
    }

    /**
     * Calculate growth rate compared to previous period.
     */
    private function calculateGrowthRate(string $type): float
    {
        $now = Carbon::now();
        $thisMonth = $now->copy()->startOfMonth();
        $lastMonth = $now->copy()->subMonth()->startOfMonth();
        $lastMonthEnd = $now->copy()->subMonth()->endOfMonth();

        switch ($type) {
            case 'users':
                $current = User::where('created_at', '>=', $thisMonth)->count();
                $previous = User::whereBetween('created_at', [$lastMonth, $lastMonthEnd])->count();
                break;
            case 'jobs':
                $current = Job::where('created_at', '>=', $thisMonth)->count();
                $previous = Job::whereBetween('created_at', [$lastMonth, $lastMonthEnd])->count();
                break;
            default:
                return 0;
        }

        if ($previous === 0) {
            return $current > 0 ? 100 : 0;
        }

        return round((($current - $previous) / $previous) * 100, 2);
    }
}
