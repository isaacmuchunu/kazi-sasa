<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CandidateReview extends Model
{
    use HasFactory;

    protected $fillable = [
        'candidate_id',
        'reviewer_id',
        'rating',
        'title',
        'comment',
        'status',
        'review_date',
    ];

    protected $casts = [
        'review_date' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function candidate()
    {
        return $this->belongsTo(User::class, 'candidate_id')->where('user_type', 'candidate');
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }

    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    public function scopeByCandidate($query, $candidateId)
    {
        return $query->where('candidate_id', $candidateId);
    }

    public function scopeByEmployer($query, $employerId)
    {
        return $query->where('reviewer_id', $employerId)
                     ->whereHas('reviewer', function ($q) {
                        $q->where('user_type', 'employer');
                     });
    }

    public function getAverageRatingAttribute()
    {
        return $this->rating;
    }

    public function getRatingStarsAttribute()
    {
        $stars = [];
        for ($i = 1; $i <= 5; $i++) {
            if ($i <= $this->rating) {
                $stars[] = '★';
            } else {
                $stars[] = '☆';
            }
        }
        return implode('', $stars);
    }
}
