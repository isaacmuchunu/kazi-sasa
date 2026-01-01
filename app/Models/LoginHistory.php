<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Jenssegers\Agent\Agent;

class LoginHistory extends Model
{
    protected $table = 'login_history';

    protected $fillable = [
        'user_id',
        'ip_address',
        'user_agent',
        'device_type',
        'browser',
        'platform',
        'location',
        'successful',
        'failure_reason',
        'logged_in_at',
        'logged_out_at',
    ];

    protected $casts = [
        'successful' => 'boolean',
        'logged_in_at' => 'datetime',
        'logged_out_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public static function recordLogin(User $user, bool $successful = true, ?string $failureReason = null): self
    {
        $userAgent = request()->userAgent();

        // Parse user agent for device info
        $deviceType = 'desktop';
        $browser = 'Unknown';
        $platform = 'Unknown';

        if (preg_match('/Mobile|Android|iPhone|iPad/i', $userAgent)) {
            $deviceType = preg_match('/iPad|Tablet/i', $userAgent) ? 'tablet' : 'mobile';
        }

        if (preg_match('/(Chrome|Firefox|Safari|Edge|Opera|MSIE|Trident)/i', $userAgent, $matches)) {
            $browser = $matches[1];
        }

        if (preg_match('/(Windows|Mac|Linux|Android|iOS)/i', $userAgent, $matches)) {
            $platform = $matches[1];
        }

        return self::create([
            'user_id' => $user->id,
            'ip_address' => request()->ip(),
            'user_agent' => $userAgent,
            'device_type' => $deviceType,
            'browser' => $browser,
            'platform' => $platform,
            'successful' => $successful,
            'failure_reason' => $failureReason,
            'logged_in_at' => now(),
        ]);
    }

    public function scopeSuccessful($query)
    {
        return $query->where('successful', true);
    }

    public function scopeFailed($query)
    {
        return $query->where('successful', false);
    }

    public function scopeRecent($query, int $days = 30)
    {
        return $query->where('logged_in_at', '>=', now()->subDays($days));
    }
}
