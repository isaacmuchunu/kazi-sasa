<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CompanyReview extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id',
        'reviewer_id',
        'rating',
        'title',
        'comment',
        'status',
        'verified_purchase',
        'review_date',
    ];

    protected $casts = [
        'verified_purchase' => 'boolean',
        'review_date' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class)->with('user');
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }

    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeByCompany($query, $companyId)
    {
        return $query->where('company_id', $companyId);
    }

    public function scopeVerified($query)
    {
        return $query->where('verified_purchase', true);
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
