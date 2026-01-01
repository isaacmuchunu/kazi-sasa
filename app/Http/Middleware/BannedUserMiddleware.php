<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class BannedUserMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (auth()->check() && auth()->user()->is_banned) {
            auth()->logout();

            return response()->json([
                'success' => false,
                'message' => 'Your account has been banned. Please contact support for assistance.',
                'banned' => true,
            ], 403);
        }

        // Check if user is suspended
        if (auth()->check() && auth()->user()->is_suspended) {
            $suspendedUntil = auth()->user()->suspended_until;

            if ($suspendedUntil && now()->lessThan($suspendedUntil)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Your account is suspended until ' . $suspendedUntil->format('Y-m-d H:i'),
                    'suspended_until' => $suspendedUntil,
                ], 403);
            } else {
                // Suspension period over, unsuspend
                auth()->user()->update([
                    'is_suspended' => false,
                    'suspended_until' => null,
                ]);
            }
        }

        return $next($request);
    }
}
