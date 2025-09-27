<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\JobController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\CandidateController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Home Routes
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/about', [HomeController::class, 'about'])->name('about');
Route::get('/contact', [HomeController::class, 'contact'])->name('contact');
Route::post('/contact', [HomeController::class, 'contactStore'])->name('contact.store');
Route::get('/faq', [HomeController::class, 'faq'])->name('faq');
Route::get('/pricing', [HomeController::class, 'pricing'])->name('pricing');
Route::get('/testimonials', [HomeController::class, 'testimonials'])->name('testimonials');
Route::get('/categories', [HomeController::class, 'categories'])->name('categories');
Route::get('/privacy-policy', [HomeController::class, 'privacyPolicy'])->name('privacy-policy');
Route::get('/terms-conditions', [HomeController::class, 'termsConditions'])->name('terms-conditions');

// Job Routes
Route::prefix('jobs')->name('jobs.')->group(function () {
    Route::get('/', [JobController::class, 'index'])->name('index');
    Route::get('/list', [JobController::class, 'list'])->name('list');
    Route::get('/grid', [JobController::class, 'grid'])->name('grid');
    Route::get('/search', [JobController::class, 'search'])->name('search');
    Route::get('/categories/{category}', [JobController::class, 'byCategory'])->name('category');
    Route::get('/{job}', [JobController::class, 'show'])->name('show');

    // Job Management (Authenticated)
    Route::middleware('auth')->group(function () {
        Route::get('/create', [JobController::class, 'create'])->name('create');
        Route::post('/', [JobController::class, 'store'])->name('store');
        Route::get('/{job}/edit', [JobController::class, 'edit'])->name('edit');
        Route::put('/{job}', [JobController::class, 'update'])->name('update');
        Route::delete('/{job}', [JobController::class, 'destroy'])->name('destroy');
        Route::post('/{job}/apply', [JobController::class, 'apply'])->name('apply');
        Route::post('/{job}/save', [JobController::class, 'save'])->name('save');
        Route::delete('/{job}/unsave', [JobController::class, 'unsave'])->name('unsave');
    });
});

// Company Routes
Route::prefix('companies')->name('companies.')->group(function () {
    Route::get('/', [CompanyController::class, 'index'])->name('index');
    Route::get('/{company}', [CompanyController::class, 'show'])->name('show');
    Route::get('/{company}/jobs', [CompanyController::class, 'jobs'])->name('jobs');
});

// Candidate Routes
Route::prefix('candidates')->name('candidates.')->group(function () {
    Route::get('/', [CandidateController::class, 'index'])->name('index');
    Route::get('/{user}', [CandidateController::class, 'show'])->name('show');

    // Candidate Management (Authenticated)
    Route::middleware('auth')->group(function () {
        Route::post('/{user}/hire', [CandidateController::class, 'hire'])->name('hire');
    });
});

// Blog Routes
Route::prefix('blog')->name('blog.')->group(function () {
    Route::get('/', [BlogController::class, 'index'])->name('index');
    Route::get('/style-two', [BlogController::class, 'styleTwo'])->name('style-two');
    Route::get('/{post}', [BlogController::class, 'show'])->name('show');
});

// Authentication Routes
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
    Route::get('/register', [AuthController::class, 'showRegistrationForm'])->name('register');
    Route::post('/register', [AuthController::class, 'register']);
    Route::get('/password/reset', [AuthController::class, 'showResetForm'])->name('password.request');
    Route::post('/password/reset', [AuthController::class, 'reset'])->name('password.reset');
});

Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    // User Account Routes
    Route::prefix('account')->name('account.')->group(function () {
        Route::get('/', [UserController::class, 'account'])->name('index');
        Route::get('/profile', [UserController::class, 'profile'])->name('profile');
        Route::put('/profile', [UserController::class, 'updateProfile'])->name('profile.update');
        Route::get('/resume', [UserController::class, 'resume'])->name('resume');
        Route::post('/resume', [UserController::class, 'uploadResume'])->name('resume.upload');
        Route::get('/applied-jobs', [UserController::class, 'appliedJobs'])->name('applied-jobs');
        Route::get('/saved-jobs', [UserController::class, 'savedJobs'])->name('saved-jobs');
        Route::get('/messages', [UserController::class, 'messages'])->name('messages');
        Route::get('/change-password', [UserController::class, 'changePassword'])->name('change-password');
        Route::put('/change-password', [UserController::class, 'updatePassword'])->name('change-password.update');
        Route::delete('/delete', [UserController::class, 'deleteAccount'])->name('delete');
    });
});

// Newsletter Subscription
Route::post('/newsletter', [HomeController::class, 'newsletter'])->name('newsletter');

// API Routes for AJAX requests
Route::prefix('api')->name('api.')->group(function () {
    Route::get('/jobs/search', [JobController::class, 'apiSearch'])->name('jobs.search');
    Route::get('/locations/search', [JobController::class, 'locationSearch'])->name('locations.search');
});

// Fallback route for 404
Route::fallback(function () {
    return view('errors.404');
});
