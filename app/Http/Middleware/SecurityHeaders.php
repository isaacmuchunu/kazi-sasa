<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    /**
     * Security headers to add to all responses.
     */
    private array $headers = [
        // Prevent clickjacking by disabling framing
        'X-Frame-Options' => 'DENY',

        // Prevent MIME type sniffing
        'X-Content-Type-Options' => 'nosniff',

        // Enable XSS protection (for older browsers)
        'X-XSS-Protection' => '1; mode=block',

        // Control referrer information
        'Referrer-Policy' => 'strict-origin-when-cross-origin',

        // Restrict browser features
        'Permissions-Policy' => 'camera=(), microphone=(), geolocation=(), payment=()',

        // Prevent caching of sensitive data
        'Cache-Control' => 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma' => 'no-cache',
        'Expires' => '0',
    ];

    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Add security headers
        foreach ($this->headers as $key => $value) {
            $response->headers->set($key, $value);
        }

        // Add Content-Security-Policy for production
        if (app()->environment('production')) {
            $response->headers->set(
                'Content-Security-Policy',
                $this->getContentSecurityPolicy()
            );
        }

        // Add Strict-Transport-Security for HTTPS
        if ($request->secure()) {
            $response->headers->set(
                'Strict-Transport-Security',
                'max-age=31536000; includeSubDomains; preload'
            );
        }

        return $response;
    }

    /**
     * Generate Content-Security-Policy header value.
     */
    private function getContentSecurityPolicy(): string
    {
        $policies = [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net",
            "font-src 'self' https://fonts.gstatic.com",
            "img-src 'self' data: https: blob:",
            "connect-src 'self' https://api.openai.com",
            "frame-ancestors 'none'",
            "form-action 'self'",
            "base-uri 'self'",
            "object-src 'none'",
        ];

        return implode('; ', $policies);
    }
}
