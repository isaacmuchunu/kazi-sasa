<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AccountActivatedNotification extends Notification implements ShouldQueue
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
        $dashboardUrl = config('app.frontend_url', config('app.url'));

        return (new MailMessage)
            ->subject('Account Reactivated - ' . config('app.name'))
            ->greeting('Great news, ' . $notifiable->first_name . '!')
            ->line('Your account on ' . config('app.name') . ' has been reactivated.')
            ->line('You now have full access to all features.')
            ->action('Go to Dashboard', $dashboardUrl . '/dashboard')
            ->line('Thank you for being a part of our community!')
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
            'type' => 'account_activated',
            'message' => 'Your account has been reactivated',
        ];
    }
}
