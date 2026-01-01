<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Newsletter;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\DB;

class AdminNewsletterController extends Controller
{
    /**
     * Get all newsletter subscribers.
     */
    public function subscribers(Request $request): JsonResponse
    {
        $subscribers = Newsletter::query()
            ->when($request->has('is_subscribed'), function ($query) use ($request) {
                $query->where('is_subscribed', $request->boolean('is_subscribed'));
            })
            ->when($request->search, function ($query, $search) {
                $query->where('email', 'like', "%{$search}%");
            })
            ->when($request->sort_by, function ($query, $sortBy) use ($request) {
                $direction = $request->get('sort_direction', 'desc');
                $query->orderBy($sortBy, $direction);
            }, function ($query) {
                $query->latest('subscribed_at');
            })
            ->paginate($request->per_page ?? 20);

        // Add statistics
        $stats = [
            'total_subscribers' => Newsletter::where('is_subscribed', true)->count(),
            'total_unsubscribed' => Newsletter::where('is_subscribed', false)->count(),
            'new_this_month' => Newsletter::where('is_subscribed', true)
                ->where('subscribed_at', '>=', now()->startOfMonth())
                ->count(),
        ];

        return $this->success([
            'subscribers' => $subscribers,
            'statistics' => $stats,
        ], 'Subscribers retrieved successfully');
    }

    /**
     * Send newsletter to subscribers.
     */
    public function send(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'content' => 'required|string',
            'preview_only' => 'sometimes|boolean',
            'test_email' => 'nullable|email',
        ]);

        // If preview only, just return the formatted content
        if ($request->boolean('preview_only')) {
            return $this->success([
                'subject' => $validated['subject'],
                'content' => $validated['content'],
                'preview' => true,
            ], 'Newsletter preview generated');
        }

        // If test email provided, send only to that address
        if (!empty($validated['test_email'])) {
            try {
                $this->sendEmail($validated['test_email'], $validated['subject'], $validated['content']);
                return $this->success(null, 'Test email sent successfully to ' . $validated['test_email']);
            } catch (\Exception $e) {
                return $this->error('Failed to send test email: ' . $e->getMessage(), 500);
            }
        }

        // Get all active subscribers
        $subscribers = Newsletter::where('is_subscribed', true)->pluck('email');

        if ($subscribers->isEmpty()) {
            return $this->error('No active subscribers found', 400);
        }

        // In a production environment, this should be queued
        $sent = 0;
        $failed = 0;

        foreach ($subscribers as $email) {
            try {
                $this->sendEmail($email, $validated['subject'], $validated['content']);
                $sent++;
            } catch (\Exception $e) {
                $failed++;
            }
        }

        // Log the campaign
        $this->logCampaign($validated['subject'], $sent, $failed);

        return $this->success([
            'sent' => $sent,
            'failed' => $failed,
            'total' => $subscribers->count(),
        ], "Newsletter sent: {$sent} successful, {$failed} failed");
    }

    /**
     * Get newsletter campaign history.
     */
    public function campaigns(Request $request): JsonResponse
    {
        // Check if newsletter_campaigns table exists
        if (!\Schema::hasTable('newsletter_campaigns')) {
            return $this->success([
                'campaigns' => [],
                'message' => 'Campaign tracking is not yet configured.',
            ], 'No campaigns available');
        }

        $campaigns = DB::table('newsletter_campaigns')
            ->orderByDesc('sent_at')
            ->paginate($request->per_page ?? 10);

        return $this->success($campaigns, 'Campaigns retrieved successfully');
    }

    /**
     * Send email to a single recipient.
     */
    private function sendEmail(string $email, string $subject, string $content): void
    {
        // In production, use proper Mail facade with templates
        Mail::raw($content, function ($message) use ($email, $subject) {
            $message->to($email)
                ->subject($subject)
                ->from(config('mail.from.address', 'noreply@kazisasa.co.ke'), config('mail.from.name', 'Kazi Sasa'));
        });
    }

    /**
     * Log newsletter campaign.
     */
    private function logCampaign(string $subject, int $sent, int $failed): void
    {
        try {
            if (\Schema::hasTable('newsletter_campaigns')) {
                DB::table('newsletter_campaigns')->insert([
                    'subject' => $subject,
                    'sent_count' => $sent,
                    'failed_count' => $failed,
                    'sent_at' => now(),
                    'sent_by' => auth()->id(),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        } catch (\Exception $e) {
            // Silently fail
        }
    }
}
