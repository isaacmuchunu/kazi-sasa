<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Job;
use App\Models\Company;
use App\Models\User;
use App\Models\JobApplication;
use App\Models\JobCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StatisticsController extends Controller
{
    /**
     * Get global statistics for homepage
     */
    public function global()
    {
        $stats = [
            'total_jobs' => Job::where('status', 'active')->count(),
            'total_companies' => Company::where('is_verified', true)->count(),
            'total_candidates' => User::where('user_type', 'candidate')->count(),
            'total_applications' => JobApplication::count(),
            'jobs_by_category' => JobCategory::withCount(['jobs' => function($query) {
                $query->where('status', 'active');
            }])->get(),
            'recent_jobs' => Job::with('company', 'category')
                ->where('status', 'active')
                ->latest()
                ->limit(6)
                ->get(),
            'featured_companies' => Company::where('is_verified', true)
                ->inRandomOrder()
                ->limit(8)
                ->get(),
            'new_applications_today' => JobApplication::whereDate('created_at', today())->count(),
            'active_companies_today' => Company::whereDate('created_at', today())->count(),
            'new_candidates_today' => User::where('user_type', 'candidate')->whereDate('created_at', today())->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }

    /**
     * Get job statistics
     */
    public function jobs()
    {
        $stats = [
            'total' => Job::count(),
            'active' => Job::where('status', 'active')->count(),
            'featured' => Job::where('is_featured', true)->where('status', 'active')->count(),
            'urgent' => Job::where('is_urgent', true)->where('status', 'active')->count(),
            'by_type' => Job::selectRaw('job_type, count(*) as count')
                ->where('status', 'active')
                ->groupBy('job_type')
                ->get()
                ->pluck('count', 'job_type')
                ->toArray(),
            'by_experience_level' => Job::selectRaw('experience_level, count(*) as count')
                ->where('status', 'active')
                ->groupBy('experience_level')
                ->get()
                ->pluck('count', 'experience_level')
                ->toArray(),
            'by_category' => JobCategory::withCount('jobs')->get(),
            'by_location' => Job::select('location', DB::raw('count(*) as count'))
                ->groupBy('location')
                ->orderBy('count', 'desc')
                ->limit(10)
                ->get(),
            'trending' => Job::where('status', 'active')
                ->withCount('applications')
                ->orderBy('applications_count', 'desc')
                ->limit(10)
                ->get(),
            'recent_growth' => Job::selectRaw('DATE(created_at) as date, count(*) as count')
                ->where('created_at', '>=', now()->subDays(30))
                ->groupBy('date')
                ->orderBy('date')
                ->get()
                ->toArray(),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }

    /**
     * Get dashboard statistics for authenticated user
     */
    public function dashboard(Request $request)
    {
        $user = $request->user();
        
        if ($user->isCandidate()) {
            return $this->getCandidateDashboardStats($user);
        } elseif ($user->isEmployer()) {
            return $this->getEmployerDashboardStats($user);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Invalid user type'
            ], 403);
        }
    }

    private function getCandidateDashboardStats($user)
    {
        $stats = [
            'total_applications' => $user->jobApplications()->count(),
            'pending_applications' => $user->jobApplications()->whereIn('status', ['pending', 'reviewing'])->count(),
            'accepted_applications' => $user->jobApplications()->where('status', 'accepted')->count(),
            'saved_jobs' => $user->savedJobs()->count(),
            'recent_applications' => $user->jobApplications()
                ->with('job:id,title,location')
                ->latest()
                ->limit(5)
                ->get(),
            'application_status_breakdown' => $user->jobApplications()
                ->selectRaw('status, count(*) as count')
                ->groupBy('status')
                ->get()
                ->pluck('count', 'status')
                ->toArray(),
            'profile_completion' => $this->calculateProfileCompletion($user),
            'recommended_jobs' => Job::where('status', 'active')
                ->inRandomOrder()
                ->limit(5)
                ->get(),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }

    private function getEmployerDashboardStats($user)
    {
        $company = $user->company;
        
        if (!$company) {
            return response()->json([
                'success' => false,
                'message' => 'No company profile found'
            ], 404);
        }

        $stats = [
            'total_jobs_posted' => $user->jobs()->count(),
            'active_jobs' => $user->jobs()->where('status', 'active')->count(),
            'total_applications' => $user->jobApplications()->count(),
            'new_applications_today' => $user->jobApplications()->whereDate('created_at', today())->count(),
            'recent_applications' => $user->jobApplications()
                ->with(['candidate:id,first_name,last_name', 'job:id,title'])
                ->latest()
                ->limit(5)
                ->get(),
            'job_statistics' => $user->jobs()
                ->selectRaw('status, count(*) as count')
                ->groupBy('status')
                ->get()
                ->pluck('count', 'status')
                ->toArray(),
            'application_statistics' => $user->jobApplications()
                ->selectRaw('status, count(*) as count')
                ->groupBy('status')
                ->get()
                ->pluck('count', 'status')
                ->toArray(),
            'top_jobs' => $user->jobs()
                ->withCount('applications')
                ->orderBy('applications_count', 'desc')
                ->limit(5)
                ->get(),
            'job_views' => $user->jobs()->sum('views_count'),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }

    /**
     * Calculate profile completion percentage
     */
    private function calculateProfileCompletion($user)
    {
        $fields = [
            'first_name', 'last_name', 'email', 'phone_number', 
            'location', 'bio', 'profile_image', 'job_title'
        ];
        
        $completed = 0;
        foreach ($fields as $field) {
            if (!empty($user->$field)) {
                $completed++;
            }
        }

        $percentage = ($completed / count($fields)) * 100;

        return [
            'percentage' => round($percentage),
            'completed_fields' => $completed,
            'total_fields' => count($fields),
        ];
    }
}
