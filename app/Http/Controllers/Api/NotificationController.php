<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\User;
use App\Models\JobApplication;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
{
    public function index(Request $request): JsonResponse
    {
        $user = Auth::user();
        
        // Generate system notifications based on applications
        $this->generateSystemNotifications($user);
        
        $query = $user->notifications()
            ->latest()
            ->with('notifiable');

        if ($request->type) {
            $query->where('type', $request->type);
        }

        $notifications = $query->paginate($request->get('per_page', 20));

        return response()->json([
            'success' => true,
            'data' => $notifications
        ]);
    }

    public function getCount(Request $request): JsonResponse
    {
        $user = Auth::user();
        
        // Generate system notifications based on applications
        $this->generateSystemNotifications($user);
        
        $unreadCount = $user->notifications()->unread()->count();

        return response()->json([
            'success' => true,
            'data' => [
                'unread_count' => $unreadCount,
                'has_unread' => $unreadCount > 0
            ]
        ]);
    }

    private function generateSystemNotifications($user)
    {
        // Create notifications for pending applications
        $applications = JobApplication::with(['job'])
            ->where('user_id', $user->id)
            ->where('status', 'pending')
            ->get();

        foreach ($applications as $application) {
            // Check if notification already exists
            $existingNotification = $user->notifications()
                ->where('type', 'application')
                ->where('notifiable_type', 'App\\Models\\JobApplication')
                ->where('notifiable_id', $application->id)
                ->exists();

            if (!$existingNotification) {
                $user->notifications()->create([
                    'type' => 'application',
                    'title' => 'Job Application',
                    'message' => "Your application for {$application->job->title} is being reviewed",
                    'notifiable_type' => 'App\\Models\\JobApplication',
                    'notifiable_id' => $application->id,
                    'data' => [
                        'application_id' => $application->id,
                        'job_id' => $application->job_id,
                        'status' => $application->status
                    ]
                ]);
            }
        }

        // For employers, create notifications for new applications
        if ($user->isEmployer()) {
            $applications = JobApplication::with(['user', 'job'])
                ->whereHas('job', function($query) use ($user) {
                    $query->where('user_id', $user->id);
                })
                ->get();

            foreach ($applications as $application) {
                $existingNotification = $user->notifications()
                    ->where('type', 'new_application')
                    ->where('notifiable_type', 'App\\Models\\JobApplication')
                    ->where('notifiable_id', $application->id)
                    ->exists();

                if (!$existingNotification) {
                    $user->notifications()->create([
                        'type' => 'new_application',
                        'title' => 'New Application',
                        'message' => "{$application->user->first_name} {$application->user->last_name} applied for {$application->job->title}",
                        'notifiable_type' => 'App\\Models\\JobApplication',
                        'notifiable_id' => $application->id,
                        'data' => [
                            'application_id' => $application->id,
                            'job_id' => $application->job_id,
                            'candidate_id' => $application->user_id
                        ]
                    ]);
                }
            }
        }
    }

    public function markRead($id): JsonResponse
    {
        $notification = Auth::user()->notifications()->findOrFail($id);
        $notification->markAsRead();

        return response()->json([
            'success' => true,
            'message' => 'Notification marked as read'
        ]);
    }

    public function markAllRead(): JsonResponse
    {
        Auth::user()->notifications()->unread()->update([
            'is_read' => true,
            'read_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'All notifications marked as read'
        ]);
    }

    public function getSettings(): JsonResponse
    {
        // In a real implementation, you would get user notification settings
        $settings = [
            'email_notifications' => true,
            'push_notifications' => true,
            'application_updates' => true,
            'new_messages' => true,
            'job_recommendations' => true,
            'marketing_emails' => false,
        ];

        return response()->json([
            'success' => true,
            'data' => $settings
        ]);
    }

    public function updateSettings(Request $request): JsonResponse
    {
        $validator = $request->validate([
            'email_notifications' => 'boolean',
            'push_notifications' => 'boolean',
            'application_updates' => 'boolean',
            'new_messages' => 'boolean',
            'job_recommendations' => 'boolean',
            'marketing_emails' => 'boolean',
        ]);

        // In a real implementation, you would save these settings to the database
        // For now, we'll just return success
        
        return response()->json([
            'success' => true,
            'message' => 'Notification settings updated successfully',
            'data' => $validator
        ]);
    }
}
