<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class UserReport extends Model
{
    protected $fillable = [
        'reporter_id',
        'reportable_type',
        'reportable_id',
        'reason',
        'description',
        'status',
        'resolved_by',
        'resolution_notes',
        'resolved_at',
    ];

    protected $casts = [
        'resolved_at' => 'datetime',
    ];

    const REASONS = [
        'spam' => 'Spam or misleading',
        'inappropriate' => 'Inappropriate content',
        'harassment' => 'Harassment or bullying',
        'fake' => 'Fake or fraudulent',
        'discrimination' => 'Discrimination',
        'copyright' => 'Copyright violation',
        'other' => 'Other',
    ];

    const STATUSES = [
        'pending' => 'Pending Review',
        'reviewing' => 'Under Review',
        'resolved' => 'Resolved',
        'dismissed' => 'Dismissed',
    ];

    public function reporter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reporter_id');
    }

    public function resolver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'resolved_by');
    }

    public function reportable(): MorphTo
    {
        return $this->morphTo();
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeUnresolved($query)
    {
        return $query->whereIn('status', ['pending', 'reviewing']);
    }

    public function resolve(int $userId, string $notes, string $status = 'resolved'): void
    {
        $this->update([
            'status' => $status,
            'resolved_by' => $userId,
            'resolution_notes' => $notes,
            'resolved_at' => now(),
        ]);
    }
}
