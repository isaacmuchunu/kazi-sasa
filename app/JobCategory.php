<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class JobCategory extends Model
{
    protected $fillable = [
        'name', 'slug', 'icon_class', 'description', 'job_count', 'is_featured'
    ];

    protected $casts = [
        'is_featured' => 'boolean',
    ];

    // Relationships
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

    // Update job count when jobs are added/removed
    public function updateJobCount()
    {
        $this->job_count = $this->jobs()->where('status', 'active')->count();
        $this->save();
    }
}
