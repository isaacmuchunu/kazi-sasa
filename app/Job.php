<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Job extends Model
{
    protected $fillable = [
        'title', 'slug', 'company_id', 'job_category_id', 'description', 'requirements',
        'location', 'job_type', 'experience_level', 'salary_min', 'salary_max', 'salary_period',
        'apply_deadline', 'tags', 'skills_required', 'is_featured', 'is_urgent', 'status',
        'views_count', 'applications_count'
    ];

    protected $casts = [
        'tags' => 'array',
        'skills_required' => 'array',
        'is_featured' => 'boolean',
        'is_urgent' => 'boolean',
        'apply_deadline' => 'date',
        'salary_min' => 'decimal:2',
        'salary_max' => 'decimal:2',
    ];

    // Relationships
    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function jobCategory()
    {
        return $this->belongsTo(JobCategory::class);
    }

    public function applications()
    {
        return $this->hasMany(JobApplication::class);
    }

    public function savedByUsers()
    {
        return $this->hasMany(SavedJob::class);
    }

    // Mutators
    public function setTitleAttribute($value)
    {
        $this->attributes['title'] = $value;
        $this->attributes['slug'] = Str::slug($value);
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

    // Accessors
    public function getSalaryRangeAttribute()
    {
        if ($this->salary_min && $this->salary_max) {
            return '$' . number_format($this->salary_min) . ' - $' . number_format($this->salary_max) . ' per ' . $this->salary_period;
        }
        return 'Salary not specified';
    }

    public function getIsExpiredAttribute()
    {
        return $this->apply_deadline && $this->apply_deadline->isPast();
    }
}
