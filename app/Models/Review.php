<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    protected $fillable = [
        'reviewer_id',
        'reviewee_id',
        'reviewee_type',
        'rating',
        'title',
        'comment',
        'status',
    ];

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }

    public function reviewee()
    {
        return $this->belongsTo(User::class, 'reviewee_id');
    }

    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    public function scopeForCompany($query, $companyOwnerId)
    {
        return $query->where('reviewee_id', $companyOwnerId)
                     ->where('reviewee_type', 'company');
    }

    public function scopeForCandidate($query, $candidateId)
    {
        return $query->where('reviewee_id', $candidateId)
                     ->where('reviewee_type', 'candidate');
    }
}
