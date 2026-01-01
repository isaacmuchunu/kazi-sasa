<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\JobController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CompanyController;
use App\Http\Controllers\Api\SearchController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\CandidateController;
use App\Http\Controllers\Api\EmployerController;
use App\Http\Controllers\Api\ApplicationController;
use App\Http\Controllers\Api\NewsletterController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\StatisticsController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\FileController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\BlogController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\AIController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// ============================================================================
// RATE-LIMITED AUTHENTICATION ROUTES (Prevent brute force attacks)
// ============================================================================
Route::middleware('throttle:5,1')->prefix('v1')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/password/forgot', [AuthController::class, 'forgotPassword']);
    Route::post('/password/reset', [AuthController::class, 'resetPassword']);
    Route::post('/email/verify/{id}/{hash}', [AuthController::class, 'verifyEmail'])->name('verification.verify');
    Route::post('/email/resend', [AuthController::class, 'resendVerification'])->middleware('throttle:6,1');

    // Job routes
    Route::get('/jobs', [JobController::class, 'index'])->name('jobs.index');
    Route::get('/jobs/{id}', [JobController::class, 'show'])->name('jobs.show');
    Route::get('/jobs/{id}/related', [JobController::class, 'related']);

    // Category routes
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/categories/{id}', [CategoryController::class, 'show']);

    // Company routes
    Route::get('/companies', [CompanyController::class, 'index'])->name('companies.index');
    Route::get('/companies/{id}', [CompanyController::class, 'show'])->name('companies.show');
    Route::get('/companies/{id}/jobs', [CompanyController::class, 'jobs']);

    // Candidate routes (public profiles)
    Route::get('/candidates', [CandidateController::class, 'index'])->name('candidates.index');
    Route::get('/candidates/{username}', [CandidateController::class, 'show'])->name('candidates.show');

    // Search routes
    Route::get('/search/jobs', [SearchController::class, 'jobs']);
    Route::get('/search/locations', [SearchController::class, 'locations']);
    Route::get('/search/categories', [SearchController::class, 'categories']);

    // Newsletter routes
    Route::post('/newsletter/subscribe', [NewsletterController::class, 'subscribe']);
    Route::post('/newsletter/unsubscribe', [NewsletterController::class, 'unsubscribe']);

    // Statistics (public)
    Route::get('/statistics/global', [StatisticsController::class, 'global']);
    Route::get('/statistics/jobs', [StatisticsController::class, 'jobs']);

    // Blog (public)
    Route::get('/blog', [BlogController::class, 'index'])->name('blog.index');
    Route::get('/blog/categories', [BlogController::class, 'categories']);
    Route::get('/blog/{slug}', [BlogController::class, 'show'])->name('blog.show');
    Route::get('/blog/{blogId}/comments', [BlogController::class, 'getComments']);

    // Reviews (public)
    Route::get('/users/{userId}/reviews/company', [ReviewController::class, 'companyReviews']);
    Route::get('/users/{userId}/reviews/candidate', [ReviewController::class, 'candidateReviews']);

    // Public settings
    Route::get('/settings/public', function () {
        return response()->json([
            'success' => true,
            'data' => \App\Models\Setting::getPublic(),
        ]);
    });
});

// ============================================================================
// PROTECTED API ROUTES (Require authentication)
// ============================================================================
Route::middleware(['auth:sanctum', 'throttle:60,1'])->prefix('v1')->group(function () {
    // Auth routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Email verification (with stricter rate limit)
    Route::middleware('throttle:6,1')->group(function () {
        Route::post('/email/verification-notification', [EmailVerificationController::class, 'sendVerificationEmail']);
        Route::get('/email/verify/{id}/{hash}', [EmailVerificationController::class, 'verify'])->middleware('signed');
    });

    // User profile management
    Route::get('/user/profile', [UserController::class, 'profile']);
    Route::put('/user/profile', [UserController::class, 'updateProfile']);
    Route::post('/user/profile/image', [UserController::class, 'uploadProfileImage']);
    Route::post('/user/profile-image', [UserController::class, 'uploadProfileImage']);
    Route::put('/user/password', [UserController::class, 'changePassword']);
    Route::post('/user/change-password', [UserController::class, 'changePassword']);
    Route::delete('/user/account', [UserController::class, 'deleteAccount']);
    Route::get('/user/statistics', [UserController::class, 'statistics']);

    // Candidate profile management
    Route::get('/candidate/profile', [CandidateController::class, 'getProfile']);
    Route::put('/candidate/profile', [CandidateController::class, 'updateProfile']);
    Route::post('/candidate/resume', [CandidateController::class, 'uploadResume']);
    Route::delete('/candidate/resume', [CandidateController::class, 'deleteResume']);

    // Job interactions (candidates)
    Route::post('/jobs/{id}/apply', [JobController::class, 'apply']);
    Route::post('/jobs/{id}/save', [JobController::class, 'save']);
    Route::delete('/jobs/{id}/unsave', [JobController::class, 'unsave']);
    Route::get('/user/saved-jobs', [JobController::class, 'savedJobs']);
    Route::get('/user/applied-jobs', [JobController::class, 'appliedJobs']);

    // Employer/Company management
    Route::get('/employer/company', [EmployerController::class, 'getCompany']);
    Route::post('/employer/company', [EmployerController::class, 'createCompany']);
    Route::put('/employer/company', [EmployerController::class, 'updateCompany']);
    Route::post('/employer/company/logo', [EmployerController::class, 'uploadLogo']);
    Route::get('/employer/dashboard', [EmployerController::class, 'getDashboard']);

    // Employer job management
    Route::get('/employer/jobs', [EmployerController::class, 'getJobs']);
    Route::post('/employer/jobs', [EmployerController::class, 'createJob']);
    Route::put('/employer/jobs/{id}', [EmployerController::class, 'updateJob']);
    Route::delete('/employer/jobs/{id}', [EmployerController::class, 'deleteJob']);

    // Application management
    Route::get('/jobs/{jobId}/applications', [ApplicationController::class, 'getJobApplications']);
    Route::get('/applications/{id}', [ApplicationController::class, 'show']);
    Route::put('/applications/{id}/status', [ApplicationController::class, 'updateStatus']);
    Route::post('/applications/{id}/shortlist', [ApplicationController::class, 'shortlist']);
    Route::post('/applications/{id}/reject', [ApplicationController::class, 'reject']);
    Route::post('/applications/{id}/accept', [ApplicationController::class, 'accept']);
    Route::delete('/applications/{id}/withdraw', [ApplicationController::class, 'withdraw']);

    // Statistics
    Route::get('/statistics/dashboard', [StatisticsController::class, 'dashboard']);

    // Reviews
    Route::post('/reviews', [ReviewController::class, 'store']);
    Route::put('/reviews/{id}', [ReviewController::class, 'update']);
    Route::delete('/reviews/{id}', [ReviewController::class, 'destroy']);
    Route::get('/companies/{companyId}/reviews', [ReviewController::class, 'companyReviews']);
    Route::get('/candidates/{candidateId}/reviews', [ReviewController::class, 'candidateReviews']);

    // Blog comments
    Route::post('/blog/{blogId}/comments', [BlogController::class, 'addComment']);

    // Messages
    Route::get('/messages', [MessageController::class, 'index']);
    Route::post('/messages', [MessageController::class, 'store']);
    Route::get('/messages/{id}', [MessageController::class, 'show']);
    Route::get('/conversations', [MessageController::class, 'conversations']);

    // File uploads (with stricter rate limit)
    Route::middleware('throttle:20,1')->group(function () {
        Route::post('/upload/resume', [FileController::class, 'uploadResume']);
        Route::post('/upload/logo', [FileController::class, 'uploadLogo']);
        Route::post('/upload/document', [FileController::class, 'uploadDocument']);
        Route::post('/upload/image', [FileController::class, 'uploadImage']);
        Route::delete('/upload/delete', [FileController::class, 'deleteFile']);
    });

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::get('/notifications/count', [NotificationController::class, 'getCount']);
    Route::put('/notifications/{id}/read', [NotificationController::class, 'markRead']);
    Route::put('/notifications/read-all', [NotificationController::class, 'markAllRead']);
    Route::put('/notifications/settings', [NotificationController::class, 'updateSettings']);

    // Dashboard data
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
    Route::get('/dashboard/activity', [DashboardController::class, 'activity']);
    Route::get('/dashboard/recommendations', [DashboardController::class, 'recommendations']);
    Route::get('/dashboard/quick-stats', [DashboardController::class, 'quickStats']);

    // User statistics
    Route::get('/user/statistics', [UserController::class, 'statistics']);

    // User reports
    Route::post('/reports', [ReportController::class, 'store']);
    Route::get('/reports/my', [ReportController::class, 'myReports']);

    // ============================================================================
    // AI/ML POWERED FEATURES
    // ============================================================================
    Route::prefix('ai')->group(function () {
        // Job recommendations for candidates
        Route::get('/job-recommendations', [AIController::class, 'getJobRecommendations']);

        // Candidate recommendations for employers (for a specific job)
        Route::get('/jobs/{job}/candidate-recommendations', [AIController::class, 'getCandidateRecommendations']);

        // Match score between candidate and job
        Route::get('/jobs/{job}/match-score', [AIController::class, 'getJobMatchScore']);

        // CV/Resume parsing and analysis
        Route::get('/cv/parse', [AIController::class, 'parseCV']);
        Route::post('/cv/upload-and-parse', [AIController::class, 'uploadAndParseCV']);

        // Skill analysis
        Route::get('/skills/analysis', [AIController::class, 'getSkillAnalysis']);
        Route::get('/skills/trending', [AIController::class, 'getTrendingSkills']);
        Route::get('/jobs/{job}/skill-gap', [AIController::class, 'getSkillGap']);

        // Similar jobs
        Route::get('/jobs/{job}/similar', [AIController::class, 'getSimilarJobs']);

        // Category recommendations
        Route::get('/category-recommendations', [AIController::class, 'getCategoryRecommendations']);

        // Candidate comparison (for employers)
        Route::post('/candidates/compare', [AIController::class, 'compareSkills']);

        // Candidate-Job match (for employers)
        Route::post('/match', [AIController::class, 'getCandidateJobMatch']);
    });
});

// Admin API routes (require authentication and admin role)
Route::middleware(['auth:sanctum', 'admin'])->prefix('v1/admin')->group(function () {
    // Dashboard
    Route::get('/dashboard', [AdminController::class, 'dashboard']);
    Route::get('/analytics', [AdminController::class, 'analytics']);

    // User management
    Route::get('/users', [AdminController::class, 'users']);
    Route::get('/users/{id}', [AdminController::class, 'showUser']);
    Route::put('/users/{id}', [AdminController::class, 'updateUser']);
    Route::post('/users/{id}/ban', [AdminController::class, 'banUser']);
    Route::post('/users/{id}/unban', [AdminController::class, 'unbanUser']);
    Route::post('/users/{id}/verify', [AdminController::class, 'verifyUser']);
    Route::delete('/users/{id}', [AdminController::class, 'deleteUser']);

    // Job management
    Route::get('/jobs', [AdminController::class, 'jobs']);
    Route::put('/jobs/{id}/status', [AdminController::class, 'updateJobStatus']);
    Route::delete('/jobs/{id}', [AdminController::class, 'deleteJob']);

    // Company management
    Route::get('/companies', [AdminController::class, 'companies']);
    Route::post('/companies/{id}/verify', [AdminController::class, 'verifyCompany']);
    Route::delete('/companies/{id}', [AdminController::class, 'deleteCompany']);

    // Report management
    Route::get('/reports', [AdminController::class, 'reports']);
    Route::put('/reports/{id}/resolve', [AdminController::class, 'resolveReport']);

    // Audit logs
    Route::get('/audit-logs', [AdminController::class, 'auditLogs']);

    // Settings
    Route::get('/settings', [AdminController::class, 'settings']);
    Route::put('/settings', [AdminController::class, 'updateSettings']);

    // Admin management
    Route::post('/admins', [AdminController::class, 'createAdmin']);

    // Data export
    Route::get('/export', [AdminController::class, 'exportData']);
});
