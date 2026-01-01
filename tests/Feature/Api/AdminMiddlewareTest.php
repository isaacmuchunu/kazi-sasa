<?php

namespace Tests\Feature\Api;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminMiddlewareTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test admin can access admin routes.
     */
    public function test_admin_can_access_admin_routes(): void
    {
        $admin = User::factory()->create([
            'user_type' => 'admin',
        ]);

        $response = $this->actingAs($admin)
            ->getJson('/api/v1/admin/dashboard');

        $response->assertStatus(200);
    }

    /**
     * Test candidate cannot access admin routes.
     */
    public function test_candidate_cannot_access_admin_routes(): void
    {
        $candidate = User::factory()->create([
            'user_type' => 'candidate',
        ]);

        $response = $this->actingAs($candidate)
            ->getJson('/api/v1/admin/dashboard');

        $response->assertStatus(403);
    }

    /**
     * Test employer cannot access admin routes.
     */
    public function test_employer_cannot_access_admin_routes(): void
    {
        $employer = User::factory()->create([
            'user_type' => 'employer',
        ]);

        $response = $this->actingAs($employer)
            ->getJson('/api/v1/admin/dashboard');

        $response->assertStatus(403);
    }

    /**
     * Test suspended admin cannot access admin routes.
     */
    public function test_suspended_admin_cannot_access_admin_routes(): void
    {
        $admin = User::factory()->create([
            'user_type' => 'admin',
            'is_suspended' => true,
        ]);

        $response = $this->actingAs($admin)
            ->getJson('/api/v1/admin/dashboard');

        $response->assertStatus(403);
    }

    /**
     * Test unauthenticated user cannot access admin routes.
     */
    public function test_unauthenticated_user_cannot_access_admin_routes(): void
    {
        $response = $this->getJson('/api/v1/admin/dashboard');

        $response->assertStatus(401);
    }

    /**
     * Test admin can manage users.
     */
    public function test_admin_can_list_users(): void
    {
        $admin = User::factory()->create([
            'user_type' => 'admin',
        ]);

        // Create some users
        User::factory()->count(5)->create();

        $response = $this->actingAs($admin)
            ->getJson('/api/v1/admin/users');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data',
            ]);
    }

    /**
     * Test admin can suspend a user.
     */
    public function test_admin_can_suspend_user(): void
    {
        $admin = User::factory()->create([
            'user_type' => 'admin',
        ]);

        $user = User::factory()->create([
            'user_type' => 'candidate',
        ]);

        $response = $this->actingAs($admin)
            ->postJson("/api/v1/admin/users/{$user->id}/ban", [
                'reason' => 'Violation of terms',
            ]);

        $response->assertStatus(200);

        $user->refresh();
        $this->assertTrue($user->is_banned || $user->is_suspended);
    }

    /**
     * Test admin can view audit logs.
     */
    public function test_admin_can_view_audit_logs(): void
    {
        $admin = User::factory()->create([
            'user_type' => 'admin',
        ]);

        $response = $this->actingAs($admin)
            ->getJson('/api/v1/admin/audit-logs');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data',
            ]);
    }
}
