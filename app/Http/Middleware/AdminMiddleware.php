<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * Ensures that the authenticated user has admin privileges.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if user is authenticated
        if (!auth()->check()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated. Please login to access this resource.'
            ], 401);
        }

        $user = auth()->user();

        // Check if user is suspended
        if ($user->is_suspended ?? false) {
            return response()->json([
                'success' => false,
                'message' => 'Your account has been suspended. Please contact support.'
            ], 403);
        }

        // Check if user is an admin
        if (!$user->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied. Administrator privileges required.'
            ], 403);
        }

        // Log admin access for audit trail
        if (class_exists(\App\Models\AuditLog::class)) {
            try {
                \App\Models\AuditLog::create([
                    'user_id' => $user->id,
                    'action' => 'admin_access',
                    'model_type' => 'admin_panel',
                    'model_id' => 0,
                    'ip_address' => $request->ip(),
                    'user_agent' => $request->userAgent(),
                    'new_values' => json_encode([
                        'route' => $request->path(),
                        'method' => $request->method(),
                    ]),
                ]);
            } catch (\Exception $e) {
                // Silently fail if audit logging fails
            }
        }

        return $next($request);
    }
}
