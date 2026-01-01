<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AccountSuspendedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * The suspension reason.
     */
    protected ?string $reason;

    /**
     * Create a new notification instance.
     */
    public function __construct(?string $reason = null)
    {
        $this->reason = $reason;
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
        $message = (new MailMessage)
            ->subject('Account Suspended - ' . config('app.name'))
            ->greeting('Hello ' . $notifiable->first_name)
            ->line('Your account on ' . config('app.name') . ' has been suspended.');

        if ($this->reason) {
            $message->line('Reason: ' . $this->reason);
        }

        return $message
            ->line('If you believe this is a mistake or would like to appeal this decision, please contact our support team.')
            ->action('Contact Support', config('app.frontend_url', config('app.url')) . '/contact')
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
            'type' => 'account_suspended',
            'reason' => $this->reason,
        ];
    }
}
