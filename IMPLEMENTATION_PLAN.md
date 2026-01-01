# KAZI SASA - ENTERPRISE IMPLEMENTATION PLAN

This document outlines the specific implementation steps required to make Kazi Sasa an enterprise-grade job portal.

---

## PHASE 1: CRITICAL SECURITY FIXES (Week 1)

### 1.1 Fix Authentication Configuration

**File:** `config/auth.php`

```php
// Change line 71 from:
'model' => App\User::class,
// To:
'model' => App\Models\User::class,
```

### 1.2 Fix File Deletion Vulnerability

**File:** `app/Http/Controllers/Api/FileController.php`

Remove or secure the `deleteFile` method. Only allow users to delete their own files.

### 1.3 Add Rate Limiting to Sensitive Endpoints

**File:** `routes/api.php`

```php
// Add rate limiting groups
Route::middleware('throttle:5,1')->prefix('v1')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});
```

### 1.4 Add Security Headers Middleware

**Create:** `app/Http/Middleware/SecurityHeaders.php`

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class SecurityHeaders
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        $response->headers->set('X-Frame-Options', 'DENY');
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('X-XSS-Protection', '1; mode=block');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->headers->set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

        return $response;
    }
}
```

---

## PHASE 2: ADMIN PANEL FOUNDATION (Week 2-3)

### 2.1 Create Admin Middleware

**Create:** `app/Http/Middleware/AdminMiddleware.php`

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        if (!auth()->check() || !auth()->user()->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied. Admin privileges required.'
            ], 403);
        }

        return $next($request);
    }
}
```

### 2.2 Create Admin Controllers

**Create:** `app/Http/Controllers/Api/Admin/AdminDashboardController.php`

```php
<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Job;
use App\Models\Company;
use App\Models\JobApplication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'users' => [
                'total' => User::count(),
                'candidates' => User::where('user_type', 'candidate')->count(),
                'employers' => User::where('user_type', 'employer')->count(),
                'admins' => User::where('user_type', 'admin')->count(),
                'new_this_month' => User::whereMonth('created_at', now()->month)->count(),
            ],
            'jobs' => [
                'total' => Job::count(),
                'active' => Job::where('status', 'active')->count(),
                'pending' => Job::where('status', 'pending')->count(),
                'expired' => Job::where('status', 'expired')->count(),
            ],
            'companies' => [
                'total' => Company::count(),
                'verified' => Company::where('is_verified', true)->count(),
                'pending' => Company::where('is_verified', false)->count(),
            ],
            'applications' => [
                'total' => JobApplication::count(),
                'pending' => JobApplication::where('status', 'pending')->count(),
                'accepted' => JobApplication::where('status', 'accepted')->count(),
                'this_month' => JobApplication::whereMonth('created_at', now()->month)->count(),
            ],
        ];

        return $this->success($stats, 'Dashboard stats retrieved');
    }

    public function recentActivity()
    {
        $users = User::latest()->take(5)->get(['id', 'first_name', 'last_name', 'user_type', 'created_at']);
        $jobs = Job::with('company:id,name')->latest()->take(5)->get(['id', 'title', 'company_id', 'created_at']);
        $applications = JobApplication::with(['user:id,first_name,last_name', 'job:id,title'])
            ->latest()->take(5)->get();

        return $this->success([
            'recent_users' => $users,
            'recent_jobs' => $jobs,
            'recent_applications' => $applications,
        ], 'Recent activity retrieved');
    }
}
```

**Create:** `app/Http/Controllers/Api/Admin/AdminUserController.php`

```php
<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AdminUserController extends Controller
{
    public function index(Request $request)
    {
        $users = User::query()
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->when($request->user_type, function ($query, $type) {
                $query->where('user_type', $type);
            })
            ->when($request->is_verified !== null, function ($query) use ($request) {
                $query->where('is_verified', $request->boolean('is_verified'));
            })
            ->latest()
            ->paginate($request->per_page ?? 15);

        return $this->success($users, 'Users retrieved');
    }

    public function show($id)
    {
        $user = User::with(['candidateProfile', 'company', 'jobApplications'])->findOrFail($id);
        return $this->success($user, 'User retrieved');
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'first_name' => 'sometimes|string|max:255',
            'last_name' => 'sometimes|string|max:255',
            'email' => ['sometimes', 'email', Rule::unique('users')->ignore($id)],
            'user_type' => 'sometimes|in:candidate,employer,admin',
            'is_verified' => 'sometimes|boolean',
        ]);

        $user->update($validated);
        return $this->success($user, 'User updated');
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);

        if ($user->id === auth()->id()) {
            return $this->error('Cannot delete your own account', 400);
        }

        $user->delete();
        return $this->success(null, 'User deleted');
    }

    public function suspend($id)
    {
        $user = User::findOrFail($id);
        $user->update(['is_suspended' => true, 'suspended_at' => now()]);
        return $this->success($user, 'User suspended');
    }

    public function activate($id)
    {
        $user = User::findOrFail($id);
        $user->update(['is_suspended' => false, 'suspended_at' => null]);
        return $this->success($user, 'User activated');
    }
}
```

**Create:** `app/Http/Controllers/Api/Admin/AdminCompanyController.php`

```php
<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Company;
use Illuminate\Http\Request;

class AdminCompanyController extends Controller
{
    public function index(Request $request)
    {
        $companies = Company::with('user:id,first_name,last_name,email')
            ->withCount('jobs')
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->when($request->is_verified !== null, function ($query) use ($request) {
                $query->where('is_verified', $request->boolean('is_verified'));
            })
            ->latest()
            ->paginate($request->per_page ?? 15);

        return $this->success($companies, 'Companies retrieved');
    }

    public function show($id)
    {
        $company = Company::with(['user', 'jobs'])->withCount('jobs')->findOrFail($id);
        return $this->success($company, 'Company retrieved');
    }

    public function verify($id)
    {
        $company = Company::findOrFail($id);
        $company->update(['is_verified' => true, 'verified_at' => now()]);
        return $this->success($company, 'Company verified');
    }

    public function reject(Request $request, $id)
    {
        $company = Company::findOrFail($id);
        $company->update([
            'is_verified' => false,
            'rejection_reason' => $request->reason,
        ]);
        return $this->success($company, 'Company verification rejected');
    }

    public function destroy($id)
    {
        $company = Company::findOrFail($id);
        $company->delete();
        return $this->success(null, 'Company deleted');
    }
}
```

**Create:** `app/Http/Controllers/Api/Admin/AdminJobController.php`

```php
<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Job;
use Illuminate\Http\Request;

class AdminJobController extends Controller
{
    public function index(Request $request)
    {
        $jobs = Job::with(['company:id,name,logo', 'category:id,name'])
            ->withCount('applications')
            ->when($request->search, function ($query, $search) {
                $query->where('title', 'like', "%{$search}%");
            })
            ->when($request->status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($request->company_id, function ($query, $companyId) {
                $query->where('company_id', $companyId);
            })
            ->latest()
            ->paginate($request->per_page ?? 15);

        return $this->success($jobs, 'Jobs retrieved');
    }

    public function show($id)
    {
        $job = Job::with(['company', 'category', 'applications.user'])->findOrFail($id);
        return $this->success($job, 'Job retrieved');
    }

    public function approve($id)
    {
        $job = Job::findOrFail($id);
        $job->update(['status' => 'active', 'approved_at' => now()]);
        return $this->success($job, 'Job approved');
    }

    public function reject(Request $request, $id)
    {
        $job = Job::findOrFail($id);
        $job->update([
            'status' => 'rejected',
            'rejection_reason' => $request->reason,
        ]);
        return $this->success($job, 'Job rejected');
    }

    public function destroy($id)
    {
        $job = Job::findOrFail($id);
        $job->delete();
        return $this->success(null, 'Job deleted');
    }

    public function toggleFeatured($id)
    {
        $job = Job::findOrFail($id);
        $job->update(['is_featured' => !$job->is_featured]);
        return $this->success($job, 'Job featured status updated');
    }
}
```

**Create:** `app/Http/Controllers/Api/Admin/AdminCategoryController.php`

```php
<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\JobCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminCategoryController extends Controller
{
    public function index(Request $request)
    {
        $categories = JobCategory::withCount('jobs')
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->orderBy('name')
            ->paginate($request->per_page ?? 20);

        return $this->success($categories, 'Categories retrieved');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:job_categories',
            'description' => 'nullable|string',
            'icon' => 'nullable|string|max:100',
            'is_active' => 'sometimes|boolean',
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        $category = JobCategory::create($validated);
        return $this->success($category, 'Category created', 201);
    }

    public function update(Request $request, $id)
    {
        $category = JobCategory::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255|unique:job_categories,name,' . $id,
            'description' => 'nullable|string',
            'icon' => 'nullable|string|max:100',
            'is_active' => 'sometimes|boolean',
        ]);

        if (isset($validated['name'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $category->update($validated);
        return $this->success($category, 'Category updated');
    }

    public function destroy($id)
    {
        $category = JobCategory::findOrFail($id);

        if ($category->jobs()->exists()) {
            return $this->error('Cannot delete category with existing jobs', 400);
        }

        $category->delete();
        return $this->success(null, 'Category deleted');
    }
}
```

### 2.3 Add Admin Routes

**Update:** `routes/api.php`

Add these routes:

```php
// Admin routes
Route::middleware(['auth:sanctum', 'admin'])->prefix('v1/admin')->group(function () {
    // Dashboard
    Route::get('/dashboard', [App\Http\Controllers\Api\Admin\AdminDashboardController::class, 'index']);
    Route::get('/dashboard/activity', [App\Http\Controllers\Api\Admin\AdminDashboardController::class, 'recentActivity']);

    // Users
    Route::get('/users', [App\Http\Controllers\Api\Admin\AdminUserController::class, 'index']);
    Route::get('/users/{id}', [App\Http\Controllers\Api\Admin\AdminUserController::class, 'show']);
    Route::put('/users/{id}', [App\Http\Controllers\Api\Admin\AdminUserController::class, 'update']);
    Route::delete('/users/{id}', [App\Http\Controllers\Api\Admin\AdminUserController::class, 'destroy']);
    Route::put('/users/{id}/suspend', [App\Http\Controllers\Api\Admin\AdminUserController::class, 'suspend']);
    Route::put('/users/{id}/activate', [App\Http\Controllers\Api\Admin\AdminUserController::class, 'activate']);

    // Companies
    Route::get('/companies', [App\Http\Controllers\Api\Admin\AdminCompanyController::class, 'index']);
    Route::get('/companies/{id}', [App\Http\Controllers\Api\Admin\AdminCompanyController::class, 'show']);
    Route::put('/companies/{id}/verify', [App\Http\Controllers\Api\Admin\AdminCompanyController::class, 'verify']);
    Route::put('/companies/{id}/reject', [App\Http\Controllers\Api\Admin\AdminCompanyController::class, 'reject']);
    Route::delete('/companies/{id}', [App\Http\Controllers\Api\Admin\AdminCompanyController::class, 'destroy']);

    // Jobs
    Route::get('/jobs', [App\Http\Controllers\Api\Admin\AdminJobController::class, 'index']);
    Route::get('/jobs/{id}', [App\Http\Controllers\Api\Admin\AdminJobController::class, 'show']);
    Route::put('/jobs/{id}/approve', [App\Http\Controllers\Api\Admin\AdminJobController::class, 'approve']);
    Route::put('/jobs/{id}/reject', [App\Http\Controllers\Api\Admin\AdminJobController::class, 'reject']);
    Route::delete('/jobs/{id}', [App\Http\Controllers\Api\Admin\AdminJobController::class, 'destroy']);
    Route::put('/jobs/{id}/featured', [App\Http\Controllers\Api\Admin\AdminJobController::class, 'toggleFeatured']);

    // Categories
    Route::apiResource('/categories', App\Http\Controllers\Api\Admin\AdminCategoryController::class);

    // Settings
    Route::get('/settings', [App\Http\Controllers\Api\Admin\AdminSettingsController::class, 'index']);
    Route::put('/settings', [App\Http\Controllers\Api\Admin\AdminSettingsController::class, 'update']);
});
```

### 2.4 Register Admin Middleware

**Update:** `app/Http/Kernel.php`

Add to `$routeMiddleware`:

```php
'admin' => \App\Http\Middleware\AdminMiddleware::class,
```

---

## PHASE 3: EMAIL VERIFICATION & PASSWORD RESET (Week 4)

### 3.1 Update User Model

**Update:** `app/Models/User.php`

```php
use Illuminate\Contracts\Auth\MustVerifyEmail;

class User extends Authenticatable implements MustVerifyEmail
{
    // Add email verification fields
    protected $fillable = [
        // ... existing fields
        'email_verified_at',
        'is_suspended',
        'suspended_at',
    ];
}
```

### 3.2 Create Password Reset Controller

**Create:** `app/Http/Controllers/Api/PasswordResetController.php`

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;

class PasswordResetController extends Controller
{
    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $status = Password::sendResetLink($request->only('email'));

        return $status === Password::RESET_LINK_SENT
            ? $this->success(null, 'Password reset link sent to your email')
            : $this->error('Unable to send reset link', 400);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:8|confirmed',
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function (User $user, string $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                ])->setRememberToken(Str::random(60));

                $user->save();
            }
        );

        return $status === Password::PASSWORD_RESET
            ? $this->success(null, 'Password has been reset successfully')
            : $this->error('Unable to reset password', 400);
    }
}
```

### 3.3 Add Email Verification Controller

**Create:** `app/Http/Controllers/Api/EmailVerificationController.php`

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\EmailVerificationRequest;

class EmailVerificationController extends Controller
{
    public function sendVerificationEmail(Request $request)
    {
        if ($request->user()->hasVerifiedEmail()) {
            return $this->error('Email already verified', 400);
        }

        $request->user()->sendEmailVerificationNotification();

        return $this->success(null, 'Verification email sent');
    }

    public function verify(EmailVerificationRequest $request)
    {
        $request->fulfill();
        return $this->success(null, 'Email verified successfully');
    }
}
```

### 3.4 Add Password Reset Routes

**Update:** `routes/api.php`

```php
// Password Reset routes
Route::prefix('v1')->group(function () {
    Route::post('/forgot-password', [PasswordResetController::class, 'forgotPassword'])
        ->middleware('throttle:5,1');
    Route::post('/reset-password', [PasswordResetController::class, 'resetPassword'])
        ->middleware('throttle:5,1');
});

// Email Verification routes (authenticated)
Route::middleware('auth:sanctum')->prefix('v1')->group(function () {
    Route::post('/email/verification-notification', [EmailVerificationController::class, 'sendVerificationEmail'])
        ->middleware('throttle:6,1');
    Route::get('/email/verify/{id}/{hash}', [EmailVerificationController::class, 'verify'])
        ->middleware('signed');
});
```

---

## PHASE 4: AI/ML INTEGRATION (Week 5-8)

### 4.1 Install OpenAI Package

```bash
composer require openai-php/laravel
```

### 4.2 Create AI Services

**Create:** `app/Services/AI/ResumeParserService.php`

```php
<?php

namespace App\Services\AI;

use OpenAI\Laravel\Facades\OpenAI;

class ResumeParserService
{
    public function parseResume(string $resumeText): array
    {
        $response = OpenAI::chat()->create([
            'model' => 'gpt-4-turbo-preview',
            'messages' => [
                [
                    'role' => 'system',
                    'content' => 'You are a resume parser. Extract the following information from the resume and return as JSON: name, email, phone, skills (array), experience (array with company, role, duration, description), education (array with institution, degree, year), certifications (array).'
                ],
                [
                    'role' => 'user',
                    'content' => $resumeText
                ]
            ],
            'response_format' => ['type' => 'json_object'],
        ]);

        return json_decode($response->choices[0]->message->content, true);
    }

    public function extractSkills(string $resumeText): array
    {
        $response = OpenAI::chat()->create([
            'model' => 'gpt-4-turbo-preview',
            'messages' => [
                [
                    'role' => 'system',
                    'content' => 'Extract all technical and soft skills from this resume. Return as JSON array of strings.'
                ],
                [
                    'role' => 'user',
                    'content' => $resumeText
                ]
            ],
            'response_format' => ['type' => 'json_object'],
        ]);

        return json_decode($response->choices[0]->message->content, true)['skills'] ?? [];
    }
}
```

**Create:** `app/Services/AI/JobMatchingService.php`

```php
<?php

namespace App\Services\AI;

use App\Models\Job;
use App\Models\User;
use App\Models\CandidateProfile;
use OpenAI\Laravel\Facades\OpenAI;

class JobMatchingService
{
    public function calculateMatchScore(Job $job, User $candidate): int
    {
        $profile = $candidate->candidateProfile;
        if (!$profile) {
            return 0;
        }

        $candidateSkills = $profile->skills ?? [];
        $requiredSkills = $job->skills_required ?? [];

        // Calculate skill match
        $skillMatch = $this->calculateSkillMatch($candidateSkills, $requiredSkills);

        // Calculate experience match
        $experienceMatch = $this->calculateExperienceMatch(
            $candidate->experience_years ?? 0,
            $job->experience_level
        );

        // Calculate location match
        $locationMatch = $this->calculateLocationMatch($candidate->location, $job->location);

        // Weighted average
        $score = ($skillMatch * 0.5) + ($experienceMatch * 0.3) + ($locationMatch * 0.2);

        return min(100, max(0, (int) $score));
    }

    private function calculateSkillMatch(array $candidateSkills, array $requiredSkills): int
    {
        if (empty($requiredSkills)) {
            return 70; // Default if no skills required
        }

        $candidateSkills = array_map('strtolower', $candidateSkills);
        $requiredSkills = array_map('strtolower', $requiredSkills);

        $matches = count(array_intersect($candidateSkills, $requiredSkills));
        return ($matches / count($requiredSkills)) * 100;
    }

    private function calculateExperienceMatch(int $candidateYears, string $requiredLevel): int
    {
        $levelYears = [
            'entry' => 0,
            'mid' => 2,
            'senior' => 5,
            'executive' => 10,
        ];

        $required = $levelYears[$requiredLevel] ?? 0;

        if ($candidateYears >= $required) {
            return 100;
        }

        return max(0, 100 - (($required - $candidateYears) * 20));
    }

    private function calculateLocationMatch(?string $candidateLocation, ?string $jobLocation): int
    {
        if (!$candidateLocation || !$jobLocation) {
            return 50;
        }

        return stripos($candidateLocation, $jobLocation) !== false ? 100 : 30;
    }

    public function getRecommendedJobs(User $candidate, int $limit = 10): array
    {
        $jobs = Job::where('status', 'active')
            ->with('company:id,name,logo')
            ->latest()
            ->take(50)
            ->get();

        $scoredJobs = $jobs->map(function ($job) use ($candidate) {
            return [
                'job' => $job,
                'score' => $this->calculateMatchScore($job, $candidate),
            ];
        })->sortByDesc('score')->take($limit);

        return $scoredJobs->values()->toArray();
    }
}
```

**Create:** `app/Services/AI/CVReviewService.php`

```php
<?php

namespace App\Services\AI;

use OpenAI\Laravel\Facades\OpenAI;

class CVReviewService
{
    public function reviewResume(string $resumeText): array
    {
        $response = OpenAI::chat()->create([
            'model' => 'gpt-4-turbo-preview',
            'messages' => [
                [
                    'role' => 'system',
                    'content' => 'You are an expert HR consultant and resume reviewer. Analyze this resume and provide: 1) An overall score (0-100), 2) Key strengths (array), 3) Areas for improvement (array), 4) Specific suggestions to improve the resume (array), 5) Missing sections that should be added. Return as JSON.'
                ],
                [
                    'role' => 'user',
                    'content' => $resumeText
                ]
            ],
            'response_format' => ['type' => 'json_object'],
        ]);

        return json_decode($response->choices[0]->message->content, true);
    }

    public function suggestImprovements(string $resumeText, string $targetJobTitle): array
    {
        $response = OpenAI::chat()->create([
            'model' => 'gpt-4-turbo-preview',
            'messages' => [
                [
                    'role' => 'system',
                    'content' => "You are a career coach. Analyze this resume for someone targeting a {$targetJobTitle} position. Provide specific, actionable suggestions to improve their chances. Return as JSON with: suggestions (array), keywords_to_add (array), sections_to_emphasize (array)."
                ],
                [
                    'role' => 'user',
                    'content' => $resumeText
                ]
            ],
            'response_format' => ['type' => 'json_object'],
        ]);

        return json_decode($response->choices[0]->message->content, true);
    }
}
```

### 4.3 Create AI Controller

**Create:** `app/Http/Controllers/Api/AIController.php`

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\AI\ResumeParserService;
use App\Services\AI\JobMatchingService;
use App\Services\AI\CVReviewService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AIController extends Controller
{
    public function __construct(
        private ResumeParserService $resumeParser,
        private JobMatchingService $jobMatcher,
        private CVReviewService $cvReviewer
    ) {}

    public function parseResume(Request $request)
    {
        $user = $request->user();
        $profile = $user->candidateProfile;

        if (!$profile || !$profile->resume) {
            return $this->error('No resume found. Please upload a resume first.', 400);
        }

        $resumeContent = Storage::disk('public')->get($profile->resume);

        // For PDF parsing, you'd use a PDF library like Smalot/PdfParser
        // This is simplified for the example
        $parsedData = $this->resumeParser->parseResume($resumeContent);

        // Update profile with parsed data
        $profile->update([
            'skills' => $parsedData['skills'] ?? [],
            'experience' => $parsedData['experience'] ?? [],
            'education' => $parsedData['education'] ?? [],
            'certifications' => $parsedData['certifications'] ?? [],
        ]);

        return $this->success($parsedData, 'Resume parsed successfully');
    }

    public function getJobMatches(Request $request)
    {
        $user = $request->user();
        $limit = $request->get('limit', 10);

        $recommendations = $this->jobMatcher->getRecommendedJobs($user, $limit);

        return $this->success($recommendations, 'Job matches retrieved');
    }

    public function reviewResume(Request $request)
    {
        $user = $request->user();
        $profile = $user->candidateProfile;

        if (!$profile || !$profile->resume) {
            return $this->error('No resume found', 400);
        }

        $resumeContent = Storage::disk('public')->get($profile->resume);
        $review = $this->cvReviewer->reviewResume($resumeContent);

        return $this->success($review, 'Resume review completed');
    }

    public function getImprovementSuggestions(Request $request)
    {
        $request->validate([
            'target_job_title' => 'required|string|max:255',
        ]);

        $user = $request->user();
        $profile = $user->candidateProfile;

        if (!$profile || !$profile->resume) {
            return $this->error('No resume found', 400);
        }

        $resumeContent = Storage::disk('public')->get($profile->resume);
        $suggestions = $this->cvReviewer->suggestImprovements(
            $resumeContent,
            $request->target_job_title
        );

        return $this->success($suggestions, 'Improvement suggestions generated');
    }
}
```

### 4.4 Add AI Routes

**Update:** `routes/api.php`

```php
// AI routes (authenticated candidates only)
Route::middleware(['auth:sanctum'])->prefix('v1/ai')->group(function () {
    Route::post('/parse-resume', [AIController::class, 'parseResume']);
    Route::get('/job-matches', [AIController::class, 'getJobMatches']);
    Route::get('/review-resume', [AIController::class, 'reviewResume']);
    Route::post('/improvement-suggestions', [AIController::class, 'getImprovementSuggestions']);
});
```

---

## PHASE 5: ADMIN FRONTEND (Week 4-5)

### 5.1 Create Admin Pages Directory

Create directory structure:
```
resources/src/pages/admin/
├── AdminDashboard.jsx
├── AdminUsers.jsx
├── AdminCompanies.jsx
├── AdminJobs.jsx
├── AdminCategories.jsx
├── AdminSettings.jsx
└── AdminLayout.jsx
```

### 5.2 Add Admin Routes to React

**Update:** `resources/src/App.jsx`

Add admin routes:

```jsx
// Import admin pages
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminCompanies = lazy(() => import("./pages/admin/AdminCompanies"));
const AdminJobs = lazy(() => import("./pages/admin/AdminJobs"));
const AdminCategories = lazy(() => import("./pages/admin/AdminCategories"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));

// Add routes inside Routes component
<Route path="/admin" element={
  <ProtectedRoute requireAdmin>
    <AdminLayout>
      <AdminDashboard />
    </AdminLayout>
  </ProtectedRoute>
} />
<Route path="/admin/users" element={
  <ProtectedRoute requireAdmin>
    <AdminLayout>
      <AdminUsers />
    </AdminLayout>
  </ProtectedRoute>
} />
// ... more admin routes
```

### 5.3 Update ProtectedRoute Component

**Update:** `resources/src/components/ProtectedRoute.jsx`

```jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requireAuth = true, requireAdmin = false }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingScreen />;
  }

  if (requireAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!requireAuth && user) {
    return <Navigate to="/dashboard" replace />;
  }

  if (requireAdmin && (!user || user.user_type !== 'admin')) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
```

---

## PHASE 6: TESTING (Week 6-7)

### 6.1 Install Testing Dependencies

```bash
composer require --dev pestphp/pest pestphp/pest-plugin-laravel
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

### 6.2 Create Test Files

**Create:** `tests/Feature/AuthTest.php`

```php
<?php

use App\Models\User;

test('user can register', function () {
    $response = $this->postJson('/api/v1/register', [
        'first_name' => 'Test',
        'last_name' => 'User',
        'user_name' => 'testuser',
        'email' => 'test@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
        'gender' => 'male',
        'dob' => '1990-01-01',
        'phone_number' => '1234567890',
        'user_type' => 'candidate',
    ]);

    $response->assertStatus(201)
        ->assertJsonStructure(['success', 'data' => ['user', 'token']]);
});

test('user can login', function () {
    $user = User::factory()->create([
        'email' => 'login@test.com',
        'password' => bcrypt('password'),
    ]);

    $response = $this->postJson('/api/v1/login', [
        'email' => 'login@test.com',
        'password' => 'password',
    ]);

    $response->assertStatus(200)
        ->assertJsonStructure(['success', 'data' => ['user', 'token']]);
});

test('user cannot login with wrong password', function () {
    $user = User::factory()->create([
        'email' => 'wrong@test.com',
        'password' => bcrypt('password'),
    ]);

    $response = $this->postJson('/api/v1/login', [
        'email' => 'wrong@test.com',
        'password' => 'wrongpassword',
    ]);

    $response->assertStatus(422);
});
```

**Create:** `tests/Feature/JobTest.php`

```php
<?php

use App\Models\Job;
use App\Models\User;
use App\Models\Company;
use App\Models\JobCategory;

test('can list jobs', function () {
    Job::factory()->count(5)->create(['status' => 'active']);

    $response = $this->getJson('/api/v1/jobs');

    $response->assertStatus(200)
        ->assertJsonStructure(['success', 'data' => ['data']]);
});

test('employer can create job', function () {
    $employer = User::factory()->create(['user_type' => 'employer']);
    $company = Company::factory()->create(['user_id' => $employer->id]);
    $category = JobCategory::factory()->create();

    $response = $this->actingAs($employer)->postJson('/api/v1/employer/jobs', [
        'title' => 'Software Engineer',
        'job_category_id' => $category->id,
        'description' => 'A great job opportunity',
        'location' => 'Nairobi',
        'job_type' => 'full-time',
        'experience_level' => 'mid',
    ]);

    $response->assertStatus(201);
});

test('candidate cannot create job', function () {
    $candidate = User::factory()->create(['user_type' => 'candidate']);

    $response = $this->actingAs($candidate)->postJson('/api/v1/employer/jobs', [
        'title' => 'Test Job',
    ]);

    $response->assertStatus(403);
});
```

---

## DATABASE MIGRATIONS TO ADD

### Add Suspension Fields

**Create:** `database/migrations/xxxx_add_suspension_fields_to_users.php`

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('is_suspended')->default(false);
            $table->timestamp('suspended_at')->nullable();
            $table->string('suspension_reason')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['is_suspended', 'suspended_at', 'suspension_reason']);
        });
    }
};
```

### Add Verification Fields to Companies

**Create:** `database/migrations/xxxx_add_verification_fields_to_companies.php`

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            $table->timestamp('verified_at')->nullable();
            $table->text('rejection_reason')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            $table->dropColumn(['verified_at', 'rejection_reason']);
        });
    }
};
```

### Add Moderation Fields to Jobs

**Create:** `database/migrations/xxxx_add_moderation_fields_to_jobs.php`

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('jobs', function (Blueprint $table) {
            $table->timestamp('approved_at')->nullable();
            $table->text('rejection_reason')->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('users');
        });
    }

    public function down(): void
    {
        Schema::table('jobs', function (Blueprint $table) {
            $table->dropColumn(['approved_at', 'rejection_reason', 'approved_by']);
        });
    }
};
```

### Create Settings Table

**Create:** `database/migrations/xxxx_create_settings_table.php`

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->string('type')->default('string'); // string, boolean, json, integer
            $table->string('group')->default('general');
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
```

### Create Audit Logs Table

**Create:** `database/migrations/xxxx_create_audit_logs_table.php`

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('action'); // created, updated, deleted, etc.
            $table->string('model_type');
            $table->unsignedBigInteger('model_id');
            $table->json('old_values')->nullable();
            $table->json('new_values')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent')->nullable();
            $table->timestamps();

            $table->index(['model_type', 'model_id']);
            $table->index('user_id');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
    }
};
```

---

## COMMANDS TO RUN

```bash
# Run migrations
php artisan migrate

# Clear caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Generate IDE helper (optional)
composer require --dev barryvdh/laravel-ide-helper
php artisan ide-helper:generate
php artisan ide-helper:models

# Install OpenAI package
composer require openai-php/laravel
php artisan vendor:publish --provider="OpenAI\Laravel\ServiceProvider"

# Install Spatie packages
composer require spatie/laravel-permission
composer require spatie/laravel-activitylog
php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider"
php artisan vendor:publish --provider="Spatie\Activitylog\ActivitylogServiceProvider" --tag="activitylog-migrations"
php artisan migrate

# Run tests
php artisan test

# Build frontend
npm run build
```

---

## ENVIRONMENT VARIABLES TO ADD

```env
# OpenAI Configuration
OPENAI_API_KEY=your-api-key-here
OPENAI_ORGANIZATION=your-org-id

# Mail Configuration (for email verification)
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your-username
MAIL_PASSWORD=your-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@kazisasa.co.ke
MAIL_FROM_NAME="Kazi Sasa"

# Redis Configuration
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

# Cache & Session
CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis
```

---

*End of Implementation Plan*
