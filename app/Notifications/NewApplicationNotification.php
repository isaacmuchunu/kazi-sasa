<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\JobApplication;

class NewApplicationNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * The job application.
     */
    protected JobApplication $application;

    /**
     * Create a new notification instance.
     */
    public function __construct(JobApplication $application)
    {
        $this->application = $application;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $job = $this->application->job;
        $applicant = $this->application->user;
        $frontendUrl = config('app.frontend_url', config('app.url'));

        return (new MailMessage)
            ->subject('New Application Received - ' . $job->title)
            ->greeting('Hello!')
            ->line('You have received a new application for "' . $job->title . '".')
            ->line('Applicant: ' . $applicant->full_name)
            ->line('Email: ' . $applicant->email)
            ->line('Applied on: ' . $this->application->created_at->format('M d, Y'))
            ->action('View Application', $frontendUrl . '/dashboard-employer/applications/' . $this->application->id)
            ->line('Review the application and respond to the candidate at your earliest convenience.')
            ->salutation('Best regards, The ' . config('app.name') . ' Team');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $job = $this->application->job;
        $applicant = $this->application->user;

        return [
            'type' => 'new_application',
            'application_id' => $this->application->id,
            'job_id' => $job->id,
            'job_title' => $job->title,
            'applicant_id' => $applicant->id,
            'applicant_name' => $applicant->full_name,
        ];
    }
}
