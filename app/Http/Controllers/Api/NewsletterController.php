<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Newsletter;
use Illuminate\Http\Request;

class NewsletterController extends Controller
{
    /**
     * Subscribe to newsletter.
     */
    public function subscribe(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email|max:255',
        ]);

        // Check if email is already subscribed
        $existing = Newsletter::where('email', $validated['email'])->first();

        if ($existing) {
            if ($existing->is_active) {
                return $this->error('Email is already subscribed', 400);
            }

            // Reactivate if previously unsubscribed
            $existing->update([
                'is_active' => true,
                'subscribed_at' => now(),
            ]);

            return $this->success($existing, 'Successfully resubscribed to newsletter');
        }

        // Create new subscription
        $subscription = Newsletter::create([
            'email' => $validated['email'],
            'subscribed_at' => now(),
            'is_active' => true,
        ]);

        return $this->success($subscription, 'Successfully subscribed to newsletter', 201);
    }

    /**
     * Unsubscribe from newsletter.
     */
    public function unsubscribe(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
        ]);

        $subscription = Newsletter::where('email', $validated['email'])->first();

        if (!$subscription) {
            return $this->error('Email not found in subscription list', 404);
        }

        $subscription->update(['is_active' => false]);

        return $this->success(null, 'Successfully unsubscribed from newsletter');
    }

    /**
     * Get all newsletter subscribers (admin only - to be implemented).
     */
    public function index(Request $request)
    {
        // For now, return empty response
        // In production, add admin middleware
        return $this->error('Unauthorized', 403);
    }
}
