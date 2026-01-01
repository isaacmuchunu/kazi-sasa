<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Job;
use App\Models\Company;
use App\Models\JobApplication;
use App\Models\AuditLog;
use App\Models\ActivityLog;
use App\Models\UserReport;
use App\Models\Setting;
use App\Models\LoginHistory;
use App\Models\Blog;
use App\Models\Review;
use App\Models\CompanyReview;
use App\Models\CandidateReview;
use App\Models\Newsletter;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rules\Password;

class AdminController extends Controller
{
    /**
     * Get admin dashboard statistics
     */
    public function dashboard(): JsonResponse
    {
        $stats = [
            'users' => [
                'total' => User::count(),
                'candidates' => User::where('user_type', 'candidate')->count(),
                'employers' => User::where('user_type', 'employer')->count(),
                'admins' => User::where('user_type', 'admin')->count(),
                'verified' => User::where('is_verified', true)->count(),
                'banned' => User::where('is_banned', true)->count(),
                'new_today' => User::whereDate('created_at', today())->count(),
                'new_this_week' => User::whereBetween('created_at', [now()->startOfWeek(), now()])->count(),
                'new_this_month' => User::whereBetween('created_at', [now()->startOfMonth(), now()])->count(),
            ],
            'jobs' => [
                'total' => Job::count(),
                'active' => Job::where('status', 'active')->count(),
                'expired' => Job::where('status', 'expired')->count(),
                'pending' => Job::where('status', 'pending')->count(),
                'new_today' => Job::whereDate('created_at', today())->count(),
                'new_this_week' => Job::whereBetween('created_at', [now()->startOfWeek(), now()])->count(),
            ],
            'companies' => [
                'total' => Company::count(),
                'verified' => Company::where('is_verified', true)->count(),
                'new_this_month' => Company::whereBetween('created_at', [now()->startOfMonth(), now()])->count(),
            ],
            'applications' => [
                'total' => JobApplication::count(),
                'pending' => JobApplication::where('status', 'pending')->count(),
                'shortlisted' => JobApplication::where('status', 'shortlisted')->count(),
                'accepted' => JobApplication::where('status', 'accepted')->count(),
                'rejected' => JobApplication::where('status', 'rejected')->count(),
                'new_today' => JobApplication::whereDate('created_at', today())->count(),
            ],
            'reports' => [
                'total' => UserReport::count(),
                'pending' => UserReport::pending()->count(),
                'resolved' => UserReport::where('status', 'resolved')->count(),
            ],
            'content' => [
                'blogs' => Blog::count(),
                'reviews' => CompanyReview::count() + CandidateReview::count(),
                'newsletters' => Newsletter::count(),
            ],
        ];

        // Recent activity
        $recentActivity = AuditLog::with('user:id,first_name,last_name,email')
            ->latest()
            ->take(10)
            ->get();

        // Login statistics
        $loginStats = [
            'today' => LoginHistory::whereDate('logged_in_at', today())->successful()->count(),
            'failed_today' => LoginHistory::whereDate('logged_in_at', today())->failed()->count(),
            'this_week' => LoginHistory::whereBetween('logged_in_at', [now()->startOfWeek(), now()])
                ->successful()->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => [
                'stats' => $stats,
                'recent_activity' => $recentActivity,
                'login_stats' => $loginStats,
            ],
        ]);
    }

    /**
     * Get all users with filters
     */
    public function users(Request $request): JsonResponse
    {
        $query = User::query();

        // Apply filters
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('user_name', 'like', "%{$search}%");
            });
        }

        if ($request->filled('user_type')) {
            $query->where('user_type', $request->user_type);
        }

        if ($request->filled('is_verified')) {
            $query->where('is_verified', $request->boolean('is_verified'));
        }

        if ($request->filled('is_banned')) {
            $query->where('is_banned', $request->boolean('is_banned'));
        }

        // Sorting
        $sortField = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortField, $sortOrder);

        $users = $query->paginate($request->get('per_page', 20));

        return response()->json([
            'success' => true,
            'data' => $users,
        ]);
    }

    /**
     * Get single user details
     */
    public function showUser(int $id): JsonResponse
    {
        $user = User::with(['company', 'candidateProfile', 'jobApplications.job'])
            ->findOrFail($id);

        $loginHistory = LoginHistory::where('user_id', $id)
            ->latest()
            ->take(10)
            ->get();

        $activityLog = ActivityLog::where('user_id', $id)
            ->latest()
            ->take(20)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'user' => $user,
                'login_history' => $loginHistory,
                'activity_log' => $activityLog,
            ],
        ]);
    }

    /**
     * Update user
     */
    public function updateUser(Request $request, int $id): JsonResponse
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'first_name' => 'sometimes|string|max:255',
            'last_name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $id,
            'user_type' => 'sometimes|in:candidate,employer,admin',
            'is_verified' => 'sometimes|boolean',
            'phone_number' => 'sometimes|nullable|string|max:20',
        ]);

        $oldValues = $user->toArray();
        $user->update($validated);

        AuditLog::log('user_updated', $user, $oldValues, $user->fresh()->toArray());

        return response()->json([
            'success' => true,
            'message' => 'User updated successfully',
            'data' => $user->fresh(),
        ]);
    }

    /**
     * Ban user
     */
    public function banUser(Request $request, int $id): JsonResponse
    {
        $user = User::findOrFail($id);

        if ($user->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot ban admin users',
            ], 403);
        }

        $validated = $request->validate([
            'reason' => 'required|string|max:500',
        ]);

        $user->update([
            'is_banned' => true,
            'ban_reason' => $validated['reason'],
            'banned_at' => now(),
            'banned_by' => auth()->id(),
        ]);

        AuditLog::log('user_banned', $user, null, [
            'reason' => $validated['reason'],
            'banned_by' => auth()->id(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'User banned successfully',
        ]);
    }

    /**
     * Unban user
     */
    public function unbanUser(int $id): JsonResponse
    {
        $user = User::findOrFail($id);

        $user->update([
            'is_banned' => false,
            'ban_reason' => null,
            'banned_at' => null,
            'banned_by' => null,
        ]);

        AuditLog::log('user_unbanned', $user);

        return response()->json([
            'success' => true,
            'message' => 'User unbanned successfully',
        ]);
    }

    /**
     * Delete user
     */
    public function deleteUser(int $id): JsonResponse
    {
        $user = User::findOrFail($id);

        if ($user->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete admin users',
            ], 403);
        }

        AuditLog::log('user_deleted', $user, $user->toArray());
        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'User deleted successfully',
        ]);
    }

    /**
     * Verify user
     */
    public function verifyUser(int $id): JsonResponse
    {
        $user = User::findOrFail($id);

        $user->update([
            'is_verified' => true,
            'email_verified_at' => now(),
        ]);

        AuditLog::log('user_verified', $user);

        return response()->json([
            'success' => true,
            'message' => 'User verified successfully',
        ]);
    }

    /**
     * Get all jobs for admin
     */
    public function jobs(Request $request): JsonResponse
    {
        $query = Job::with(['company', 'category']);

        if ($request->filled('search')) {
            $query->where('title', 'like', "%{$request->search}%");
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('company_id')) {
            $query->where('company_id', $request->company_id);
        }

        $jobs = $query->latest()->paginate($request->get('per_page', 20));

        return response()->json([
            'success' => true,
            'data' => $jobs,
        ]);
    }

    /**
     * Update job status
     */
    public function updateJobStatus(Request $request, int $id): JsonResponse
    {
        $job = Job::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|in:active,pending,expired,rejected',
        ]);

        $oldStatus = $job->status;
        $job->update(['status' => $validated['status']]);

        AuditLog::log('job_status_changed', $job, ['status' => $oldStatus], ['status' => $validated['status']]);

        return response()->json([
            'success' => true,
            'message' => 'Job status updated successfully',
        ]);
    }

    /**
     * Delete job
     */
    public function deleteJob(int $id): JsonResponse
    {
        $job = Job::findOrFail($id);
        AuditLog::log('job_deleted', $job, $job->toArray());
        $job->delete();

        return response()->json([
            'success' => true,
            'message' => 'Job deleted successfully',
        ]);
    }

    /**
     * Get all companies for admin
     */
    public function companies(Request $request): JsonResponse
    {
        $query = Company::with('user');

        if ($request->filled('search')) {
            $query->where('name', 'like', "%{$request->search}%");
        }

        if ($request->filled('is_verified')) {
            $query->where('is_verified', $request->boolean('is_verified'));
        }

        $companies = $query->latest()->paginate($request->get('per_page', 20));

        return response()->json([
            'success' => true,
            'data' => $companies,
        ]);
    }

    /**
     * Verify company
     */
    public function verifyCompany(int $id): JsonResponse
    {
        $company = Company::findOrFail($id);

        $company->update(['is_verified' => true]);

        AuditLog::log('company_verified', $company);

        return response()->json([
            'success' => true,
            'message' => 'Company verified successfully',
        ]);
    }

    /**
     * Delete company
     */
    public function deleteCompany(int $id): JsonResponse
    {
        $company = Company::findOrFail($id);
        AuditLog::log('company_deleted', $company, $company->toArray());
        $company->delete();

        return response()->json([
            'success' => true,
            'message' => 'Company deleted successfully',
        ]);
    }

    /**
     * Get all reports
     */
    public function reports(Request $request): JsonResponse
    {
        $query = UserReport::with(['reporter', 'resolver', 'reportable']);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('reason')) {
            $query->where('reason', $request->reason);
        }

        $reports = $query->latest()->paginate($request->get('per_page', 20));

        return response()->json([
            'success' => true,
            'data' => $reports,
        ]);
    }

    /**
     * Resolve a report
     */
    public function resolveReport(Request $request, int $id): JsonResponse
    {
        $report = UserReport::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|in:resolved,dismissed',
            'notes' => 'required|string|max:1000',
        ]);

        $report->resolve(auth()->id(), $validated['notes'], $validated['status']);

        AuditLog::log('report_resolved', $report, null, $validated);

        return response()->json([
            'success' => true,
            'message' => 'Report resolved successfully',
        ]);
    }

    /**
     * Get audit logs
     */
    public function auditLogs(Request $request): JsonResponse
    {
        $query = AuditLog::with('user:id,first_name,last_name,email');

        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->filled('action')) {
            $query->where('action', $request->action);
        }

        if ($request->filled('from_date')) {
            $query->whereDate('created_at', '>=', $request->from_date);
        }

        if ($request->filled('to_date')) {
            $query->whereDate('created_at', '<=', $request->to_date);
        }

        $logs = $query->latest()->paginate($request->get('per_page', 50));

        return response()->json([
            'success' => true,
            'data' => $logs,
        ]);
    }

    /**
     * Get system settings
     */
    public function settings(): JsonResponse
    {
        $settings = Setting::all()->groupBy('group');

        return response()->json([
            'success' => true,
            'data' => $settings,
        ]);
    }

    /**
     * Update system settings
     */
    public function updateSettings(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'settings' => 'required|array',
            'settings.*.key' => 'required|string',
            'settings.*.value' => 'required',
            'settings.*.group' => 'sometimes|string',
            'settings.*.type' => 'sometimes|string',
        ]);

        foreach ($validated['settings'] as $setting) {
            Setting::set(
                $setting['key'],
                $setting['value'],
                $setting['group'] ?? 'general',
                $setting['type'] ?? 'string'
            );
        }

        AuditLog::log('settings_updated', null, null, ['settings' => array_column($validated['settings'], 'key')]);

        return response()->json([
            'success' => true,
            'message' => 'Settings updated successfully',
        ]);
    }

    /**
     * Get analytics data
     */
    public function analytics(Request $request): JsonResponse
    {
        $period = $request->get('period', 30); // days

        // User registrations over time
        $userRegistrations = User::selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->where('created_at', '>=', now()->subDays($period))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Job postings over time
        $jobPostings = Job::selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->where('created_at', '>=', now()->subDays($period))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Applications over time
        $applications = JobApplication::selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->where('created_at', '>=', now()->subDays($period))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // User type distribution
        $userTypeDistribution = User::selectRaw('user_type, COUNT(*) as count')
            ->groupBy('user_type')
            ->get();

        // Job category distribution
        $jobCategoryDistribution = Job::selectRaw('job_category_id, COUNT(*) as count')
            ->with('category:id,name')
            ->groupBy('job_category_id')
            ->get();

        // Application status distribution
        $applicationStatusDistribution = JobApplication::selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->get();

        // Top companies by job postings
        $topCompanies = Company::withCount('jobs')
            ->orderBy('jobs_count', 'desc')
            ->take(10)
            ->get(['id', 'name', 'logo']);

        return response()->json([
            'success' => true,
            'data' => [
                'user_registrations' => $userRegistrations,
                'job_postings' => $jobPostings,
                'applications' => $applications,
                'user_type_distribution' => $userTypeDistribution,
                'job_category_distribution' => $jobCategoryDistribution,
                'application_status_distribution' => $applicationStatusDistribution,
                'top_companies' => $topCompanies,
            ],
        ]);
    }

    /**
     * Create a new admin user
     */
    public function createAdmin(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => ['required', 'confirmed', Password::min(8)->mixedCase()->numbers()],
        ]);

        $admin = User::create([
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'user_type' => 'admin',
            'is_verified' => true,
            'email_verified_at' => now(),
        ]);

        AuditLog::log('admin_created', $admin);

        return response()->json([
            'success' => true,
            'message' => 'Admin user created successfully',
            'data' => $admin,
        ], 201);
    }

    /**
     * Get newsletter subscribers
     */
    public function newsletterSubscribers(Request $request): JsonResponse
    {
        $query = Newsletter::query();

        if ($request->filled('search')) {
            $query->where('email', 'like', "%{$request->search}%");
        }

        $subscribers = $query->latest()->paginate($request->get('per_page', 50));

        return response()->json([
            'success' => true,
            'data' => $subscribers,
        ]);
    }

    /**
     * Export data (CSV format)
     */
    public function exportData(Request $request): JsonResponse
    {
        $type = $request->get('type');
        $data = [];

        switch ($type) {
            case 'users':
                $data = User::select(['id', 'first_name', 'last_name', 'email', 'user_type', 'is_verified', 'created_at'])
                    ->get()
                    ->toArray();
                break;
            case 'jobs':
                $data = Job::with('company:id,name')
                    ->select(['id', 'title', 'company_id', 'location', 'job_type', 'status', 'created_at'])
                    ->get()
                    ->toArray();
                break;
            case 'companies':
                $data = Company::select(['id', 'name', 'industry', 'is_verified', 'created_at'])
                    ->get()
                    ->toArray();
                break;
            case 'applications':
                $data = JobApplication::with(['user:id,first_name,last_name', 'job:id,title'])
                    ->select(['id', 'user_id', 'job_id', 'status', 'created_at'])
                    ->get()
                    ->toArray();
                break;
            default:
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid export type',
                ], 400);
        }

        AuditLog::log('data_exported', null, null, ['type' => $type, 'count' => count($data)]);

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }
}
