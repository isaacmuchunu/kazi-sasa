<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\JobApplication;
use App\Models\Job;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AdminApplicationController extends Controller
{
    /**
     * Get all applications with filtering.
     */
    public function index(Request $request): JsonResponse
    {
        $applications = JobApplication::query()
            ->with([
                'user:id,first_name,last_name,email',
                'job:id,title,company_id',
                'job.company:id,name'
            ])
            ->when($request->status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($request->job_id, function ($query, $jobId) {
                $query->where('job_id', $jobId);
            })
            ->when($request->company_id, function ($query, $companyId) {
                $query->whereHas('job', function ($q) use ($companyId) {
                    $q->where('company_id', $companyId);
                });
            })
            ->when($request->date_from, function ($query, $date) {
                $query->where('created_at', '>=', $date);
            })
            ->when($request->date_to, function ($query, $date) {
                $query->where('created_at', '<=', $date);
            })
            ->when($request->sort_by, function ($query, $sortBy) use ($request) {
                $direction = $request->get('sort_direction', 'desc');
                $query->orderBy($sortBy, $direction);
            }, function ($query) {
                $query->latest();
            })
            ->paginate($request->per_page ?? 15);

        return $this->success($applications, 'Applications retrieved successfully');
    }

    /**
     * Get application statistics.
     */
    public function stats(Request $request): JsonResponse
    {
        $days = $request->get('days', 30);
        $startDate = Carbon::now()->subDays($days);

        // Overall stats
        $stats = [
            'total' => JobApplication::count(),
            'pending' => JobApplication::where('status', 'pending')->count(),
            'reviewed' => JobApplication::where('status', 'reviewed')->count(),
            'shortlisted' => JobApplication::where('status', 'shortlisted')->count(),
            'accepted' => JobApplication::where('status', 'accepted')->count(),
            'rejected' => JobApplication::where('status', 'rejected')->count(),
        ];

        // Applications by day
        $byDay = JobApplication::where('created_at', '>=', $startDate)
            ->selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Status distribution
        $byStatus = JobApplication::selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->get();

        // Top jobs by applications
        $topJobs = Job::withCount('applications')
            ->orderByDesc('applications_count')
            ->take(10)
            ->get(['id', 'title', 'company_id'])
            ->load('company:id,name');

        // Average time to decision
        $avgTimeToDecision = JobApplication::whereIn('status', ['accepted', 'rejected'])
            ->selectRaw('AVG(DATEDIFF(updated_at, created_at)) as avg_days')
            ->first();

        return $this->success([
            'overview' => $stats,
            'by_day' => $byDay,
            'by_status' => $byStatus,
            'top_jobs' => $topJobs,
            'avg_decision_days' => round($avgTimeToDecision->avg_days ?? 0, 1),
            'period' => $days . ' days',
        ], 'Application statistics retrieved successfully');
    }
}
