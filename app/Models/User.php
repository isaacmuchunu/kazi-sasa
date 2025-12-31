<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'user_name',
        'email',
        'gender',
        'dob',
        'password',
        'phone_number',
        'user_type',
        'job_title',
        'experience_years',
        'location',
        'country',
        'city',
        'zip_code',
        'profile_image',
        'social_links',
        'bio',
        'is_verified',
        'last_active_at',
        'email_verified_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'dob' => 'date',
            'social_links' => 'array',
            'is_verified' => 'boolean',
            'last_active_at' => 'datetime',
            'experience_years' => 'integer',
        ];
    }

    /**
     * Get the candidate profile associated with the user.
     */
    public function candidateProfile(): HasOne
    {
        return $this->hasOne(CandidateProfile::class);
    }

    /**
     * Get the company associated with the user.
     */
    public function company(): HasOne
    {
        return $this->hasOne(Company::class);
    }

    /**
     * Get the jobs posted by the user (for employers through their company).
     */
    public function jobs(): HasManyThrough
    {
        return $this->hasManyThrough(Job::class, Company::class);
    }

    /**
     * Get the job applications made by the user.
     */
    public function jobApplications(): HasMany
    {
        return $this->hasMany(JobApplication::class);
    }

    /**
     * Get the saved jobs for the user.
     */
    public function savedJobs(): HasMany
    {
        return $this->hasMany(SavedJob::class);
    }

    /**
     * Get the blogs written by the user.
     */
    public function blogs(): HasMany
    {
        return $this->hasMany(Blog::class, 'author_id');
    }

    /**
     * Get the notifications for the user.
     */
    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class);
    }

    /**
     * Get the messages sent by the user.
     */
    public function sentMessages(): HasMany
    {
        return $this->hasMany(Message::class, 'sender_id');
    }

    /**
     * Get the messages received by the user.
     */
    public function receivedMessages(): HasMany
    {
        return $this->hasMany(Message::class, 'recipient_id');
    }

    /**
     * Check if user is a candidate.
     */
    public function isCandidate(): bool
    {
        return $this->user_type === 'candidate';
    }

    /**
     * Check if user is an employer.
     */
    public function isEmployer(): bool
    {
        return $this->user_type === 'employer';
    }

    /**
     * Check if user is an admin.
     */
    public function isAdmin(): bool
    {
        return $this->user_type === 'admin';
    }

    /**
     * Get the user's full name.
     */
    public function getFullNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }

    /**
     * Get the user's profile URL.
     */
    public function getProfileUrlAttribute(): string
    {
        // Routes will be handled by React frontend
        if ($this->isCandidate()) {
            return "/candidates/{$this->user_name}";
        }

        if ($this->isEmployer() && $this->company) {
            return "/companies/{$this->company->slug}";
        }

        return '#';
    }
}
