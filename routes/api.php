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
use App\Http\Controllers\Api\PasswordResetController;
use App\Http\Controllers\Api\EmailVerificationController;
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
    Route::post('/forgot-password', [PasswordResetController::class, 'forgotPassword']);
    Route::post('/reset-password', [PasswordResetController::class, 'resetPassword']);
});

// ============================================================================
// PUBLIC API ROUTES (Read-only, higher rate limit)
// ============================================================================
Route::middleware('throttle:60,1')->prefix('v1')->group(function () {
    // Job routes
    Route::get('/jobs', [JobController::class, 'index']);
    Route::get('/jobs/{id}', [JobController::class, 'show']);
    Route::get('/jobs/{id}/related', [JobController::class, 'related']);

    // Category routes
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/categories/{id}', [CategoryController::class, 'show']);

    // Company routes
    Route::get('/companies', [CompanyController::class, 'index']);
    Route::get('/companies/{id}', [CompanyController::class, 'show']);
    Route::get('/companies/{id}/jobs', [CompanyController::class, 'jobs']);

    // Candidate routes (public profiles)
    Route::get('/candidates', [CandidateController::class, 'index']);
    Route::get('/candidates/{username}', [CandidateController::class, 'show']);

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
    Route::get('/blog', [BlogController::class, 'index']);
    Route::get('/blog/categories', [BlogController::class, 'categories']);
    Route::get('/blog/{slug}', [BlogController::class, 'show']);
    Route::get('/blog/{blogId}/comments', [BlogController::class, 'getComments']);

    // Reviews (public)
    Route::get('/users/{userId}/reviews/company', [ReviewController::class, 'companyReviews']);
    Route::get('/users/{userId}/reviews/candidate', [ReviewController::class, 'candidateReviews']);
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

    // AI/ML routes
    Route::prefix('ai')->group(function () {
        Route::post('/parse-resume', [AIController::class, 'parseResume']);
        Route::get('/job-matches', [AIController::class, 'getJobMatches']);
        Route::get('/review-resume', [AIController::class, 'reviewResume']);
        Route::post('/improvement-suggestions', [AIController::class, 'getImprovementSuggestions']);
    });
});

// ============================================================================
// ADMIN ROUTES (Require authentication + admin role)
// ============================================================================
Route::middleware(['auth:sanctum', 'admin', 'throttle:60,1'])->prefix('v1/admin')->group(function () {
    // Dashboard
    Route::get('/dashboard', [App\Http\Controllers\Api\Admin\AdminDashboardController::class, 'index']);
    Route::get('/dashboard/activity', [App\Http\Controllers\Api\Admin\AdminDashboardController::class, 'recentActivity']);
    Route::get('/dashboard/analytics', [App\Http\Controllers\Api\Admin\AdminDashboardController::class, 'analytics']);

    // Users management
    Route::get('/users', [App\Http\Controllers\Api\Admin\AdminUserController::class, 'index']);
    Route::get('/users/{id}', [App\Http\Controllers\Api\Admin\AdminUserController::class, 'show']);
    Route::put('/users/{id}', [App\Http\Controllers\Api\Admin\AdminUserController::class, 'update']);
    Route::delete('/users/{id}', [App\Http\Controllers\Api\Admin\AdminUserController::class, 'destroy']);
    Route::put('/users/{id}/suspend', [App\Http\Controllers\Api\Admin\AdminUserController::class, 'suspend']);
    Route::put('/users/{id}/activate', [App\Http\Controllers\Api\Admin\AdminUserController::class, 'activate']);
    Route::put('/users/{id}/verify', [App\Http\Controllers\Api\Admin\AdminUserController::class, 'verify']);

    // Companies management
    Route::get('/companies', [App\Http\Controllers\Api\Admin\AdminCompanyController::class, 'index']);
    Route::get('/companies/pending', [App\Http\Controllers\Api\Admin\AdminCompanyController::class, 'pending']);
    Route::get('/companies/{id}', [App\Http\Controllers\Api\Admin\AdminCompanyController::class, 'show']);
    Route::put('/companies/{id}', [App\Http\Controllers\Api\Admin\AdminCompanyController::class, 'update']);
    Route::put('/companies/{id}/verify', [App\Http\Controllers\Api\Admin\AdminCompanyController::class, 'verify']);
    Route::put('/companies/{id}/reject', [App\Http\Controllers\Api\Admin\AdminCompanyController::class, 'reject']);
    Route::delete('/companies/{id}', [App\Http\Controllers\Api\Admin\AdminCompanyController::class, 'destroy']);

    // Jobs management
    Route::get('/jobs', [App\Http\Controllers\Api\Admin\AdminJobController::class, 'index']);
    Route::get('/jobs/pending', [App\Http\Controllers\Api\Admin\AdminJobController::class, 'pending']);
    Route::get('/jobs/{id}', [App\Http\Controllers\Api\Admin\AdminJobController::class, 'show']);
    Route::put('/jobs/{id}', [App\Http\Controllers\Api\Admin\AdminJobController::class, 'update']);
    Route::put('/jobs/{id}/approve', [App\Http\Controllers\Api\Admin\AdminJobController::class, 'approve']);
    Route::put('/jobs/{id}/reject', [App\Http\Controllers\Api\Admin\AdminJobController::class, 'reject']);
    Route::put('/jobs/{id}/featured', [App\Http\Controllers\Api\Admin\AdminJobController::class, 'toggleFeatured']);
    Route::delete('/jobs/{id}', [App\Http\Controllers\Api\Admin\AdminJobController::class, 'destroy']);

    // Categories management
    Route::get('/categories', [App\Http\Controllers\Api\Admin\AdminCategoryController::class, 'index']);
    Route::post('/categories', [App\Http\Controllers\Api\Admin\AdminCategoryController::class, 'store']);
    Route::get('/categories/{id}', [App\Http\Controllers\Api\Admin\AdminCategoryController::class, 'show']);
    Route::put('/categories/{id}', [App\Http\Controllers\Api\Admin\AdminCategoryController::class, 'update']);
    Route::delete('/categories/{id}', [App\Http\Controllers\Api\Admin\AdminCategoryController::class, 'destroy']);

    // Blog management
    Route::get('/blogs', [App\Http\Controllers\Api\Admin\AdminBlogController::class, 'index']);
    Route::post('/blogs', [App\Http\Controllers\Api\Admin\AdminBlogController::class, 'store']);
    Route::get('/blogs/{id}', [App\Http\Controllers\Api\Admin\AdminBlogController::class, 'show']);
    Route::put('/blogs/{id}', [App\Http\Controllers\Api\Admin\AdminBlogController::class, 'update']);
    Route::put('/blogs/{id}/publish', [App\Http\Controllers\Api\Admin\AdminBlogController::class, 'publish']);
    Route::delete('/blogs/{id}', [App\Http\Controllers\Api\Admin\AdminBlogController::class, 'destroy']);

    // Reviews moderation
    Route::get('/reviews', [App\Http\Controllers\Api\Admin\AdminReviewController::class, 'index']);
    Route::get('/reviews/pending', [App\Http\Controllers\Api\Admin\AdminReviewController::class, 'pending']);
    Route::put('/reviews/{id}/approve', [App\Http\Controllers\Api\Admin\AdminReviewController::class, 'approve']);
    Route::put('/reviews/{id}/reject', [App\Http\Controllers\Api\Admin\AdminReviewController::class, 'reject']);
    Route::delete('/reviews/{id}', [App\Http\Controllers\Api\Admin\AdminReviewController::class, 'destroy']);

    // Comments moderation
    Route::get('/comments', [App\Http\Controllers\Api\Admin\AdminCommentController::class, 'index']);
    Route::get('/comments/pending', [App\Http\Controllers\Api\Admin\AdminCommentController::class, 'pending']);
    Route::put('/comments/{id}/approve', [App\Http\Controllers\Api\Admin\AdminCommentController::class, 'approve']);
    Route::put('/comments/{id}/reject', [App\Http\Controllers\Api\Admin\AdminCommentController::class, 'reject']);
    Route::delete('/comments/{id}', [App\Http\Controllers\Api\Admin\AdminCommentController::class, 'destroy']);

    // Applications overview
    Route::get('/applications', [App\Http\Controllers\Api\Admin\AdminApplicationController::class, 'index']);
    Route::get('/applications/stats', [App\Http\Controllers\Api\Admin\AdminApplicationController::class, 'stats']);

    // Reports
    Route::get('/reports/users', [App\Http\Controllers\Api\Admin\AdminReportController::class, 'users']);
    Route::get('/reports/jobs', [App\Http\Controllers\Api\Admin\AdminReportController::class, 'jobs']);
    Route::get('/reports/applications', [App\Http\Controllers\Api\Admin\AdminReportController::class, 'applications']);
    Route::get('/reports/companies', [App\Http\Controllers\Api\Admin\AdminReportController::class, 'companies']);
    Route::get('/reports/overview', [App\Http\Controllers\Api\Admin\AdminReportController::class, 'overview']);
    Route::get('/reports/export/{type}', [App\Http\Controllers\Api\Admin\AdminReportController::class, 'export']);

    // Settings
    Route::get('/settings', [App\Http\Controllers\Api\Admin\AdminSettingsController::class, 'index']);
    Route::put('/settings', [App\Http\Controllers\Api\Admin\AdminSettingsController::class, 'update']);
    Route::get('/settings/{group}', [App\Http\Controllers\Api\Admin\AdminSettingsController::class, 'group']);

    // Audit logs
    Route::get('/audit-logs', [App\Http\Controllers\Api\Admin\AdminAuditController::class, 'index']);
    Route::get('/audit-logs/{id}', [App\Http\Controllers\Api\Admin\AdminAuditController::class, 'show']);

    // Newsletter management
    Route::get('/newsletter/subscribers', [App\Http\Controllers\Api\Admin\AdminNewsletterController::class, 'subscribers']);
    Route::post('/newsletter/send', [App\Http\Controllers\Api\Admin\AdminNewsletterController::class, 'send']);
    Route::get('/newsletter/campaigns', [App\Http\Controllers\Api\Admin\AdminNewsletterController::class, 'campaigns']);
});
