<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Job;
use App\Models\Company;
use App\Models\JobApplication;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AdminReportController extends Controller
{
    /**
     * Get user reports.
     */
    public function users(Request $request): JsonResponse
    {
        $days = $request->get('days', 30);
        $startDate = Carbon::now()->subDays($days);

        // Registrations over time
        $registrations = User::where('created_at', '>=', $startDate)
            ->selectRaw('DATE(created_at) as date, user_type, COUNT(*) as count')
            ->groupBy('date', 'user_type')
            ->orderBy('date')
            ->get();

        // User distribution by type
        $byType = User::selectRaw('user_type, COUNT(*) as count')
            ->groupBy('user_type')
            ->get();

        // Verified vs unverified
        $verificationStats = User::selectRaw('is_verified, COUNT(*) as count')
            ->groupBy('is_verified')
            ->get();

        // Most active users (by applications or jobs posted)
        $activeUsers = User::withCount(['jobApplications', 'jobs'])
            ->orderByRaw('job_applications_count + jobs_count DESC')
            ->take(10)
            ->get(['id', 'first_name', 'last_name', 'user_type']);

        return $this->success([
            'registrations' => $registrations,
            'by_type' => $byType,
            'verification' => $verificationStats,
            'most_active' => $activeUsers,
            'period' => $days . ' days',
        ], 'User reports retrieved successfully');
    }

    /**
     * Get job reports.
     */
    public function jobs(Request $request): JsonResponse
    {
        $days = $request->get('days', 30);
        $startDate = Carbon::now()->subDays($days);

        // Jobs posted over time
        $jobsPosted = Job::where('created_at', '>=', $startDate)
            ->selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Jobs by status
        $byStatus = Job::selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->get();

        // Jobs by type
        $byType = Job::selectRaw('job_type, COUNT(*) as count')
            ->groupBy('job_type')
            ->get();

        // Jobs by category
        $byCategory = Job::with('category:id,name')
            ->selectRaw('job_category_id, COUNT(*) as count')
            ->groupBy('job_category_id')
            ->get()
            ->map(fn($j) => [
                'category' => $j->category->name ?? 'Unknown',
                'count' => $j->count
            ]);

        // Most viewed jobs
        $mostViewed = Job::with('company:id,name')
            ->orderByDesc('views_count')
            ->take(10)
            ->get(['id', 'title', 'company_id', 'views_count', 'applications_count']);

        // Average salary ranges
        $salaryStats = Job::whereNotNull('salary_min')
            ->selectRaw('AVG(salary_min) as avg_min, AVG(salary_max) as avg_max, job_type')
            ->groupBy('job_type')
            ->get();

        return $this->success([
            'jobs_posted' => $jobsPosted,
            'by_status' => $byStatus,
            'by_type' => $byType,
            'by_category' => $byCategory,
            'most_viewed' => $mostViewed,
            'salary_stats' => $salaryStats,
            'period' => $days . ' days',
        ], 'Job reports retrieved successfully');
    }

    /**
     * Get application reports.
     */
    public function applications(Request $request): JsonResponse
    {
        $days = $request->get('days', 30);
        $startDate = Carbon::now()->subDays($days);

        // Applications over time
        $applicationsOverTime = JobApplication::where('created_at', '>=', $startDate)
            ->selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // By status
        $byStatus = JobApplication::selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->get();

        // Conversion rates
        $total = JobApplication::count();
        $accepted = JobApplication::where('status', 'accepted')->count();
        $rejected = JobApplication::where('status', 'rejected')->count();
        $conversionRate = $total > 0 ? round(($accepted / $total) * 100, 2) : 0;
        $rejectionRate = $total > 0 ? round(($rejected / $total) * 100, 2) : 0;

        // Average applications per job
        $avgAppsPerJob = Job::withCount('applications')
            ->get()
            ->avg('applications_count');

        return $this->success([
            'over_time' => $applicationsOverTime,
            'by_status' => $byStatus,
            'conversion_rate' => $conversionRate,
            'rejection_rate' => $rejectionRate,
            'avg_per_job' => round($avgAppsPerJob ?? 0, 1),
            'total' => $total,
            'period' => $days . ' days',
        ], 'Application reports retrieved successfully');
    }

    /**
     * Get company reports.
     */
    public function companies(Request $request): JsonResponse
    {
        $days = $request->get('days', 30);
        $startDate = Carbon::now()->subDays($days);

        // Companies registered over time
        $registrations = Company::where('created_at', '>=', $startDate)
            ->selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Verification stats
        $verificationStats = Company::selectRaw('is_verified, COUNT(*) as count')
            ->groupBy('is_verified')
            ->get();

        // By industry
        $byIndustry = Company::selectRaw('industry, COUNT(*) as count')
            ->whereNotNull('industry')
            ->groupBy('industry')
            ->orderByDesc('count')
            ->take(10)
            ->get();

        // Top hiring companies
        $topHiring = Company::withCount(['jobs', 'jobs as active_jobs_count' => function ($q) {
            $q->where('status', 'active');
        }])
            ->orderByDesc('jobs_count')
            ->take(10)
            ->get(['id', 'name', 'logo', 'industry']);

        return $this->success([
            'registrations' => $registrations,
            'verification' => $verificationStats,
            'by_industry' => $byIndustry,
            'top_hiring' => $topHiring,
            'period' => $days . ' days',
        ], 'Company reports retrieved successfully');
    }

    /**
     * Get overview/summary report.
     */
    public function overview(Request $request): JsonResponse
    {
        $now = Carbon::now();
        $lastMonth = $now->copy()->subMonth();
        $lastWeek = $now->copy()->subWeek();

        return $this->success([
            'users' => [
                'total' => User::count(),
                'new_this_week' => User::where('created_at', '>=', $lastWeek)->count(),
                'new_this_month' => User::where('created_at', '>=', $lastMonth)->count(),
            ],
            'jobs' => [
                'total' => Job::count(),
                'active' => Job::where('status', 'active')->count(),
                'new_this_week' => Job::where('created_at', '>=', $lastWeek)->count(),
            ],
            'applications' => [
                'total' => JobApplication::count(),
                'pending' => JobApplication::where('status', 'pending')->count(),
                'this_week' => JobApplication::where('created_at', '>=', $lastWeek)->count(),
            ],
            'companies' => [
                'total' => Company::count(),
                'verified' => Company::where('is_verified', true)->count(),
                'new_this_month' => Company::where('created_at', '>=', $lastMonth)->count(),
            ],
        ], 'Overview report retrieved successfully');
    }

    /**
     * Export report data.
     */
    public function export(Request $request, $type): JsonResponse
    {
        // In a real application, this would generate CSV/Excel files
        // For now, we return the data in a format suitable for export

        $data = match ($type) {
            'users' => User::select(['id', 'first_name', 'last_name', 'email', 'user_type', 'is_verified', 'created_at'])->get(),
            'jobs' => Job::with('company:id,name')->select(['id', 'title', 'company_id', 'status', 'job_type', 'created_at'])->get(),
            'applications' => JobApplication::with(['user:id,first_name,last_name', 'job:id,title'])->select(['id', 'job_id', 'user_id', 'status', 'created_at'])->get(),
            'companies' => Company::select(['id', 'name', 'industry', 'is_verified', 'created_at'])->get(),
            default => [],
        };

        return $this->success([
            'type' => $type,
            'data' => $data,
            'count' => count($data),
            'exported_at' => now()->toISOString(),
        ], 'Export data retrieved successfully');
    }
}
