<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobApplication extends Model
{
    use HasFactory;

    protected $fillable = [
        'job_id',
        'user_id',
        'applied_at',
        'status',
        'cover_letter',
        'resume_path',
        'notes',
        'candidate_contact_info',
        'expected_salary',
        'available_from',
        'portfolio_links',
        'feedback',
        'interview_scheduled_at',
        'interviewed_at',
        'rejected_at',
        'accepted_at',
    ];

    protected $casts = [
        'applied_at' => 'datetime',
        'interview_scheduled_at' => 'datetime',
        'interviewed_at' => 'datetime',
        'rejected_at' => 'datetime',
        'accepted_at' => 'datetime',
        'expected_salary' => 'decimal:2',
        'candidate_contact_info' => 'array',
        'portfolio_links' => 'array',
    ];

    public function job()
    {
        return $this->belongsTo(Job::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function candidate()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeReviewing($query)
    {
        return $query->where('status', 'reviewing');
    }

    public function scopeAccepted($query)
    {
        return $query->where('status', 'accepted');
    }

    public function scopeRejected($query)
    {
        return $query->where('status', 'rejected');
    }

    public function scopeShortlisted($query)
    {
        return $query->where('status', 'shortlisted');
    }

    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    public function isReviewing(): bool
    {
        return $this->status === 'reviewing';
    }

    public function isAccepted(): bool
    {
        return $this->status === 'accepted';
    }

    public function isRejected(): bool
    {
        return $this->status === 'rejected';
    }

    public function isShortlisted(): bool
    {
        return $this->status === 'shortlisted';
    }

    public function getStatusColor(): string
    {
        return match($this->status) {
            'pending' => 'yellow',
            'reviewing' => 'blue',
            'shortlisted' => 'purple',
            'accepted' => 'green',
            'rejected' => 'red',
            default => 'gray',
        };
    }

    public function getStatusLabel(): string
    {
        return match($this->status) {
            'pending' => 'Pending Review',
            'reviewing' => 'Under Review',
            'shortlisted' => 'Shortlisted',
            'accepted' => 'Accepted',
            'rejected' => 'Rejected',
            default => ucfirst($this->status),
        };
    }
}
