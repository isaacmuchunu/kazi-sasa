<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\JobApplication;

class JobApplicationNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * The job application.
     */
    protected JobApplication $application;

    /**
     * The notification type (submitted, viewed, shortlisted, rejected).
     */
    protected string $type;

    /**
     * Create a new notification instance.
     */
    public function __construct(JobApplication $application, string $type = 'submitted')
    {
        $this->application = $application;
        $this->type = $type;
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
        $company = $job->company;
        $frontendUrl = config('app.frontend_url', config('app.url'));

        $message = (new MailMessage)
            ->greeting('Hello ' . $notifiable->first_name . '!');

        switch ($this->type) {
            case 'submitted':
                $message->subject('Application Submitted - ' . $job->title)
                    ->line('Your application for "' . $job->title . '" at ' . $company->name . ' has been submitted successfully.')
                    ->line('The employer will review your application and get back to you soon.')
                    ->action('View Your Applications', $frontendUrl . '/dashboard-candidate/applications');
                break;

            case 'viewed':
                $message->subject('Your Application Was Viewed - ' . $job->title)
                    ->line('Great news! ' . $company->name . ' has viewed your application for "' . $job->title . '".')
                    ->line('This is a positive sign that your profile caught their attention.')
                    ->action('View Job Details', $frontendUrl . '/jobs/' . $job->slug);
                break;

            case 'shortlisted':
                $message->subject('Congratulations! You\'ve Been Shortlisted - ' . $job->title)
                    ->line('Congratulations! You have been shortlisted for "' . $job->title . '" at ' . $company->name . '.')
                    ->line('The employer may reach out to you soon for the next steps.')
                    ->action('View Your Applications', $frontendUrl . '/dashboard-candidate/applications');
                break;

            case 'rejected':
                $message->subject('Application Update - ' . $job->title)
                    ->line('Thank you for your interest in "' . $job->title . '" at ' . $company->name . '.')
                    ->line('After careful consideration, the employer has decided to move forward with other candidates.')
                    ->line('Don\'t give up! There are many other opportunities waiting for you.')
                    ->action('Browse More Jobs', $frontendUrl . '/jobs');
                break;

            case 'hired':
                $message->subject('Congratulations! You\'ve Been Hired - ' . $job->title)
                    ->line('Congratulations! You have been selected for "' . $job->title . '" at ' . $company->name . '!')
                    ->line('The employer will contact you with further details soon.')
                    ->action('View Job Details', $frontendUrl . '/jobs/' . $job->slug);
                break;

            default:
                $message->subject('Application Update - ' . $job->title)
                    ->line('There\'s an update on your application for "' . $job->title . '" at ' . $company->name . '.')
                    ->action('View Your Applications', $frontendUrl . '/dashboard-candidate/applications');
        }

        return $message->salutation('Best regards, The ' . config('app.name') . ' Team');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $job = $this->application->job;
        $company = $job->company;

        return [
            'type' => 'job_application_' . $this->type,
            'application_id' => $this->application->id,
            'job_id' => $job->id,
            'job_title' => $job->title,
            'company_name' => $company->name,
            'status' => $this->type,
        ];
    }
}
