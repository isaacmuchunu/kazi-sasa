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

// Public API routes
Route::prefix('v1')->group(function () {
    // Authentication routes
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    
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
    Route::get('/statistics/global', [App\Http\Controllers\Api\StatisticsController::class, 'global']);
    Route::get('/statistics/jobs', [App\Http\Controllers\Api\StatisticsController::class, 'jobs']);
    
    // Blog (public)
    Route::get('/blog', [App\Http\Controllers\Api\BlogController::class, 'index']);
    Route::get('/blog/categories', [App\Http\Controllers\Api\BlogController::class, 'categories']);
    Route::get('/blog/{slug}', [App\Http\Controllers\Api\BlogController::class, 'show']);
    Route::get('/blog/{blogId}/comments', [App\Http\Controllers\Api\BlogController::class, 'getComments']);
    
    // Reviews (public)
    Route::get('/users/{userId}/reviews/company', [App\Http\Controllers\Api\ReviewController::class, 'companyReviews']);
    Route::get('/users/{userId}/reviews/candidate', [App\Http\Controllers\Api\ReviewController::class, 'candidateReviews']);
});

// Protected API routes (require authentication)
Route::middleware('auth:sanctum')->prefix('v1')->group(function () {
    // Auth routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    
    // User profile management
    Route::get('/user/profile', [UserController::class, 'profile']);
    Route::put('/user/profile', [UserController::class, 'updateProfile']);
    Route::post('/user/profile/image', [UserController::class, 'uploadProfileImage']);
    Route::put('/user/password', [UserController::class, 'changePassword']);
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
    Route::get('/statistics/global', [StatisticsController::class, 'global']);
    Route::get('/statistics/jobs', [StatisticsController::class, 'jobs']);
    
    // Reviews
    Route::post('/reviews', [ReviewController::class, 'store']);
    Route::put('/reviews/{id}', [ReviewController::class, 'update']);
    Route::delete('/reviews/{id}', [ReviewController::class, 'destroy']);
    Route::get('/companies/{companyId}/reviews', [ReviewController::class, 'companyReviews']);
    Route::get('/candidates/{candidateId}/reviews', [ReviewController::class, 'candidateReviews']);
    
    // Blog comments
    Route::post('/blog/{blogId}/comments', [BlogController::class, 'addComment']);
    Route::get('/blog/{blogId}/comments', [BlogController::class, 'getComments']);
    
    // User profile management
    Route::get('/user/profile', [UserController::class, 'profile']);
    Route::put('/user/profile', [UserController::class, 'updateProfile']);
    Route::post('/user/profile-image', [UserController::class, 'uploadProfileImage']);
    Route::post('/user/change-password', [UserController::class, 'changePassword']);
    Route::delete('/user/account', [UserController::class, 'deleteAccount']);
    
    // Messages
    Route::get('/messages', [MessageController::class, 'index']);
    Route::post('/messages', [MessageController::class, 'store']);
    Route::get('/messages/{id}', [MessageController::class, 'show']);
    Route::get('/conversations', [MessageController::class, 'conversations']);
    
    // File uploads
    Route::post('/upload/resume', [FileController::class, 'uploadResume']);
    Route::post('/upload/logo', [FileController::class, 'uploadLogo']);
    Route::post('/upload/document', [FileController::class, 'uploadDocument']);
    Route::post('/upload/image', [FileController::class, 'uploadImage']);
    
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
    
    // User statistics
    Route::get('/user/statistics', [UserController::class, 'statistics']);
});