<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Newsletter extends Model
{
    protected $fillable = [
        'email', 'is_subscribed', 'subscribed_at', 'unsubscribed_at'
    ];

    protected $casts = [
        'is_subscribed' => 'boolean',
        'subscribed_at' => 'datetime',
        'unsubscribed_at' => 'datetime',
    ];

    // Scopes
    public function scopeSubscribed($query)
    {
        return $query->where('is_subscribed', true);
    }

    public function scopeUnsubscribed($query)
    {
        return $query->where('is_subscribed', false);
    }
}
