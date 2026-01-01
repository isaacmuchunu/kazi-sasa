<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class AdminSettingsController extends Controller
{
    /**
     * Default settings structure.
     */
    private array $defaultSettings = [
        'general' => [
            'site_name' => 'Kazi Sasa',
            'site_description' => 'Kenya\'s Leading Job Portal',
            'contact_email' => 'info@kazisasa.co.ke',
            'support_email' => 'support@kazisasa.co.ke',
            'phone' => '+254 700 000 000',
            'address' => 'Nairobi, Kenya',
        ],
        'jobs' => [
            'require_approval' => false,
            'max_applications_per_job' => 100,
            'default_expiry_days' => 30,
            'allow_remote_jobs' => true,
            'featured_job_duration' => 14,
        ],
        'users' => [
            'require_email_verification' => true,
            'allow_registration' => true,
            'default_profile_visibility' => true,
            'max_saved_jobs' => 50,
        ],
        'companies' => [
            'require_verification' => true,
            'allow_unverified_posting' => false,
            'max_free_job_posts' => 3,
        ],
        'notifications' => [
            'email_new_application' => true,
            'email_application_status' => true,
            'email_new_job_match' => true,
            'email_newsletter' => true,
        ],
        'seo' => [
            'meta_title' => 'Kazi Sasa - Find Your Dream Job in Kenya',
            'meta_description' => 'Browse thousands of job opportunities across Kenya. Post jobs, find candidates, and build your career with Kazi Sasa.',
            'meta_keywords' => 'jobs, kenya, careers, employment, hiring',
        ],
    ];

    /**
     * Get all settings.
     */
    public function index(): JsonResponse
    {
        $settings = $this->getAllSettings();

        return $this->success($settings, 'Settings retrieved successfully');
    }

    /**
     * Get settings by group.
     */
    public function group($group): JsonResponse
    {
        if (!array_key_exists($group, $this->defaultSettings)) {
            return $this->error('Invalid settings group', 404);
        }

        $settings = $this->getSettingsGroup($group);

        return $this->success($settings, "Settings for '{$group}' retrieved successfully");
    }

    /**
     * Update settings.
     */
    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'group' => 'required|string',
            'settings' => 'required|array',
        ]);

        $group = $validated['group'];

        if (!array_key_exists($group, $this->defaultSettings)) {
            return $this->error('Invalid settings group', 400);
        }

        // Validate against known settings
        $validKeys = array_keys($this->defaultSettings[$group]);
        $settings = array_intersect_key($validated['settings'], array_flip($validKeys));

        // Save settings to database
        foreach ($settings as $key => $value) {
            $this->saveSetting($group, $key, $value);
        }

        // Clear settings cache
        Cache::forget('admin_settings');

        // Log the change
        $this->logAudit('update_settings', $group, $settings);

        return $this->success(
            $this->getSettingsGroup($group),
            'Settings updated successfully'
        );
    }

    /**
     * Get all settings from database, merged with defaults.
     */
    private function getAllSettings(): array
    {
        return Cache::remember('admin_settings', 3600, function () {
            $settings = $this->defaultSettings;

            // Try to load from database if settings table exists
            try {
                if (\Schema::hasTable('settings')) {
                    $dbSettings = DB::table('settings')->get();

                    foreach ($dbSettings as $setting) {
                        if (isset($settings[$setting->group][$setting->key])) {
                            $settings[$setting->group][$setting->key] = $this->castValue(
                                $setting->value,
                                $setting->type ?? 'string'
                            );
                        }
                    }
                }
            } catch (\Exception $e) {
                // Use defaults if database fails
            }

            return $settings;
        });
    }

    /**
     * Get settings for a specific group.
     */
    private function getSettingsGroup(string $group): array
    {
        $all = $this->getAllSettings();
        return $all[$group] ?? [];
    }

    /**
     * Save a single setting to database.
     */
    private function saveSetting(string $group, string $key, $value): void
    {
        try {
            if (\Schema::hasTable('settings')) {
                $type = is_bool($value) ? 'boolean' : (is_array($value) ? 'json' : 'string');
                $storedValue = is_array($value) ? json_encode($value) : (string) $value;

                DB::table('settings')->updateOrInsert(
                    ['group' => $group, 'key' => $key],
                    [
                        'value' => $storedValue,
                        'type' => $type,
                        'updated_at' => now(),
                    ]
                );
            }
        } catch (\Exception $e) {
            // Silently fail if database operation fails
        }
    }

    /**
     * Cast value based on type.
     */
    private function castValue($value, string $type)
    {
        return match ($type) {
            'boolean' => filter_var($value, FILTER_VALIDATE_BOOLEAN),
            'integer' => (int) $value,
            'json' => json_decode($value, true),
            default => $value,
        };
    }

    /**
     * Log admin actions for audit trail.
     */
    private function logAudit(string $action, string $group, array $data = []): void
    {
        if (class_exists(\App\Models\AuditLog::class)) {
            try {
                \App\Models\AuditLog::create([
                    'user_id' => auth()->id(),
                    'action' => $action,
                    'model_type' => 'settings',
                    'model_id' => 0,
                    'new_values' => json_encode(['group' => $group, 'settings' => $data]),
                    'ip_address' => request()->ip(),
                    'user_agent' => request()->userAgent(),
                ]);
            } catch (\Exception $e) {
                // Silently fail
            }
        }
    }
}
