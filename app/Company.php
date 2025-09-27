<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Company extends Model
{
    protected $fillable = [
        'name', 'slug', 'logo', 'email', 'website', 'location',
        'description', 'user_id', 'is_verified', 'social_links'
    ];

    protected $casts = [
        'social_links' => 'array',
        'is_verified' => 'boolean',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function jobs()
    {
        return $this->hasMany(Job::class);
    }

    // Mutators
    public function setNameAttribute($value)
    {
        $this->attributes['name'] = $value;
        $this->attributes['slug'] = Str::slug($value);
    }

    // Accessors
    public function getJobsCountAttribute()
    {
        return $this->jobs()->where('status', 'active')->count();
    }
}
