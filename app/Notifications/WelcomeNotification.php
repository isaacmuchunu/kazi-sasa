<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class WelcomeNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $userType = $notifiable->user_type;
        $dashboardUrl = config('app.frontend_url', config('app.url'));

        $message = (new MailMessage)
            ->subject('Welcome to ' . config('app.name') . '!')
            ->greeting('Hello ' . $notifiable->first_name . '!');

        if ($userType === 'candidate') {
            $message->line('Welcome to ' . config('app.name') . '! We\'re excited to help you find your dream job.')
                ->line('Here\'s what you can do to get started:')
                ->line('1. Complete your profile to stand out to employers')
                ->line('2. Upload your resume for quick applications')
                ->line('3. Set up job alerts to be notified of new opportunities')
                ->line('4. Browse thousands of job listings from top companies')
                ->action('Complete Your Profile', $dashboardUrl . '/dashboard-candidate');
        } elseif ($userType === 'employer') {
            $message->line('Welcome to ' . config('app.name') . '! We\'re excited to help you find the perfect candidates.')
                ->line('Here\'s what you can do to get started:')
                ->line('1. Complete your company profile')
                ->line('2. Post your first job listing')
                ->line('3. Browse our database of qualified candidates')
                ->line('4. Use our AI-powered matching to find the best fits')
                ->action('Post Your First Job', $dashboardUrl . '/dashboard-employer');
        } else {
            $message->line('Welcome to ' . config('app.name') . '! Your account has been created successfully.')
                ->action('Go to Dashboard', $dashboardUrl . '/dashboard');
        }

        return $message
            ->line('If you have any questions, don\'t hesitate to reach out to our support team.')
            ->salutation('Best regards, The ' . config('app.name') . ' Team');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'welcome',
            'message' => 'Welcome to ' . config('app.name'),
        ];
    }
}
