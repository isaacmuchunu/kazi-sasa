<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CandidateProfile extends Model
{
    protected $fillable = [
        'user_id', 'about_me', 'resume_path', 'education', 'work_experience',
        'skills', 'certifications', 'languages', 'portfolio_url',
        'expected_salary', 'available_for_hire'
    ];

    protected $casts = [
        'education' => 'array',
        'work_experience' => 'array',
        'skills' => 'array',
        'certifications' => 'array',
        'languages' => 'array',
        'expected_salary' => 'decimal:2',
        'available_for_hire' => 'boolean',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
