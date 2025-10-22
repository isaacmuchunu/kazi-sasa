<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Job extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'company_id',
        'job_category_id',
        'description',
        'location',
        'job_type',
        'experience_level',
        'salary_min',
        'salary_max',
        'salary_period',
        'apply_deadline',
        'skills_required',
        'tags',
        'status',
        'is_featured',
        'is_urgent',
        'views_count',
        'applications_count',
    ];

    protected $casts = [
        'skills_required' => 'array',
        'tags' => 'array',
        'apply_deadline' => 'date',
        'salary_min' => 'decimal:2',
        'salary_max' => 'decimal:2',
        'is_featured' => 'boolean',
        'is_urgent' => 'boolean',
        'views_count' => 'integer',
        'applications_count' => 'integer',
    ];

    // Relationships
    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function category()
    {
        return $this->belongsTo(JobCategory::class, 'job_category_id');
    }

    public function applications()
    {
        return $this->hasMany(JobApplication::class);
    }

    public function savedJobs()
    {
        return $this->hasMany(SavedJob::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeUrgent($query)
    {
        return $query->where('is_urgent', true);
    }

    /**
     * Get the formatted salary range for the job.
     */
    public function getSalaryRangeAttribute()
    {
        if (!$this->salary_min && !$this->salary_max) {
            return 'Salary not disclosed';
        }

        $period = ucfirst($this->salary_period ?? 'month');

        if ($this->salary_min && $this->salary_max) {
            return number_format($this->salary_min) . ' - ' . number_format($this->salary_max) . ' per ' . $period;
        } elseif ($this->salary_min) {
            return 'From ' . number_format($this->salary_min) . ' per ' . $period;
        } else {
            return 'Up to ' . number_format($this->salary_max) . ' per ' . $period;
        }
    }

    /**
     * Check if the job posting has expired.
     */
    public function getIsExpiredAttribute()
    {
        return $this->apply_deadline && $this->apply_deadline->isPast();
    }
}
