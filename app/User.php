<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'first_name', 'last_name', 'user_name', 'gender', 'dob', 'email', 'phone_number', 'password',
        'user_type', 'job_title', 'experience_years', 'location', 'country', 'city', 'zip_code',
        'profile_image', 'social_links', 'bio', 'is_verified', 'last_active_at'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'social_links' => 'array',
        'last_active_at' => 'datetime',
        'dob' => 'date',
    ];

    // Relationships
    public function companies()
    {
        return $this->hasMany(Company::class);
    }

    public function candidateProfile()
    {
        return $this->hasOne(CandidateProfile::class);
    }

    public function jobApplications()
    {
        return $this->hasMany(JobApplication::class);
    }

    public function savedJobs()
    {
        return $this->hasMany(SavedJob::class);
    }

    public function blogs()
    {
        return $this->hasMany(Blog::class, 'author_id');
    }
}
