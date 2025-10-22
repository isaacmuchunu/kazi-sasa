<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Company extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'slug',
        'description',
        'website',
        'logo',
        'industry',
        'size',
        'location',
        'is_verified',
        'founded_year',
        'employee_count',
        'social_links',
        'company_type',
        'mission',
        'vision',
        'values',
        'location_type',
        'latitude',
        'longitude',
        'is_featured',
        'is_active',
    ];

    protected $casts = [
        'is_verified' => 'boolean',
        'founded_year' => 'integer',
        'employee_count' => 'integer',
        'social_links' => 'array',
        'company_type' => 'string',
        'mission' => 'string',
        'vision' => 'string',
        'values' => 'array',
        'location_type' => 'string',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function jobs()
    {
        return $this->hasMany(Job::class);
    }

    public function reviews()
    {
        return $this->hasMany(CompanyReview::class);
    }

    public function jobApplications()
    {
        return $this->hasManyThrough('jobs', 'jobApplications');
    }

    public function getJobsCountAttribute()
    {
        return $this->jobs()->where('status', 'active')->count();
    }

    public function getAverageRatingAttribute()
    {
        return $this->reviews()->approved()->avg('rating') ?? 0;
    }

    /**
     * Set the company name and auto-generate slug.
     */
    public function setNameAttribute($value)
    {
        $this->attributes['name'] = $value;
        $this->attributes['slug'] = Str::slug($value);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeVerified($query)
    {
        return $query->where('is_verified', true);
    }

    public function scopeByIndustry($query, $industry)
    {
        return $query->where('industry', $industry);
    }

    public function scopeBySize($query, $size)
    {
        return $query->where('company_size', $size);
    }
}
