<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\ActivityLog;
use Symfony\Component\HttpFoundation\Response;

class TrackActivityMiddleware
{
    /**
     * Routes that should be tracked
     */
    protected array $trackableRoutes = [
        'jobs.show' => 'job_view',
        'companies.show' => 'company_view',
        'candidates.show' => 'candidate_view',
        'blog.show' => 'blog_view',
    ];

    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Only track for authenticated users and successful responses
        if (auth()->check() && $response->isSuccessful()) {
            $routeName = $request->route()?->getName();

            if ($routeName && isset($this->trackableRoutes[$routeName])) {
                $this->trackActivity($request, $routeName);
            }
        }

        return $response;
    }

    protected function trackActivity(Request $request, string $routeName): void
    {
        $activityType = $this->trackableRoutes[$routeName];
        $parameters = $request->route()->parameters();

        // Get the subject based on route
        $subject = null;
        $description = null;

        switch ($activityType) {
            case 'job_view':
                $subject = \App\Models\Job::find($parameters['id'] ?? $parameters['job'] ?? null);
                $description = $subject ? "Viewed job: {$subject->title}" : null;
                break;
            case 'company_view':
                $subject = \App\Models\Company::find($parameters['id'] ?? $parameters['company'] ?? null);
                $description = $subject ? "Viewed company: {$subject->name}" : null;
                break;
            case 'candidate_view':
                $subject = \App\Models\User::where('user_name', $parameters['username'] ?? null)->first();
                $description = $subject ? "Viewed candidate: {$subject->first_name} {$subject->last_name}" : null;
                break;
            case 'blog_view':
                $subject = \App\Models\Blog::where('slug', $parameters['slug'] ?? null)->first();
                $description = $subject ? "Viewed blog: {$subject->title}" : null;
                break;
        }

        if ($subject) {
            ActivityLog::track($activityType, $description, $subject);
        }
    }
}
