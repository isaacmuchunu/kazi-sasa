<?php

namespace Tests\Feature\Api;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    /**
     * Test user registration with valid data.
     */
    public function test_user_can_register_with_valid_data(): void
    {
        $password = 'SecurePass123!';

        $response = $this->postJson('/api/v1/register', [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'user_name' => 'johndoe',
            'email' => 'john@example.com',
            'password' => $password,
            'password_confirmation' => $password,
            'gender' => 'male',
            'dob' => '1990-01-15',
            'phone_number' => '+254712345678',
            'user_type' => 'candidate',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => ['user', 'token'],
            ])
            ->assertJson(['success' => true]);

        $this->assertDatabaseHas('users', [
            'email' => 'john@example.com',
            'user_name' => 'johndoe',
        ]);
    }

    /**
     * Test registration fails with weak password.
     */
    public function test_registration_fails_with_weak_password(): void
    {
        $response = $this->postJson('/api/v1/register', [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'user_name' => 'johndoe',
            'email' => 'john@example.com',
            'password' => 'weak',
            'password_confirmation' => 'weak',
            'gender' => 'male',
            'dob' => '1990-01-15',
            'phone_number' => '+254712345678',
            'user_type' => 'candidate',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['password']);
    }

    /**
     * Test registration fails with invalid username format.
     */
    public function test_registration_fails_with_invalid_username(): void
    {
        $response = $this->postJson('/api/v1/register', [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'user_name' => 'john doe!', // Contains space and special char
            'email' => 'john@example.com',
            'password' => 'SecurePass123!',
            'password_confirmation' => 'SecurePass123!',
            'gender' => 'male',
            'dob' => '1990-01-15',
            'phone_number' => '+254712345678',
            'user_type' => 'candidate',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['user_name']);
    }

    /**
     * Test user can login with valid credentials.
     */
    public function test_user_can_login_with_valid_credentials(): void
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => Hash::make('SecurePass123!'),
        ]);

        $response = $this->postJson('/api/v1/login', [
            'email' => 'test@example.com',
            'password' => 'SecurePass123!',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => ['user', 'token', 'email_verified'],
            ])
            ->assertJson(['success' => true]);
    }

    /**
     * Test login fails with invalid credentials.
     */
    public function test_login_fails_with_invalid_credentials(): void
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => Hash::make('SecurePass123!'),
        ]);

        $response = $this->postJson('/api/v1/login', [
            'email' => 'test@example.com',
            'password' => 'WrongPassword!',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    /**
     * Test suspended user cannot login.
     */
    public function test_suspended_user_cannot_login(): void
    {
        $user = User::factory()->create([
            'email' => 'suspended@example.com',
            'password' => Hash::make('SecurePass123!'),
            'is_suspended' => true,
            'suspension_reason' => 'Violation of terms',
        ]);

        $response = $this->postJson('/api/v1/login', [
            'email' => 'suspended@example.com',
            'password' => 'SecurePass123!',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    /**
     * Test authenticated user can logout.
     */
    public function test_authenticated_user_can_logout(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->postJson('/api/v1/logout');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Logged out successfully',
            ]);
    }

    /**
     * Test authenticated user can get their profile.
     */
    public function test_authenticated_user_can_get_profile(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->getJson('/api/v1/me');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => ['user', 'email_verified', 'profile_complete'],
            ]);
    }

    /**
     * Test unauthenticated user cannot access protected routes.
     */
    public function test_unauthenticated_user_cannot_access_protected_routes(): void
    {
        $response = $this->getJson('/api/v1/me');

        $response->assertStatus(401);
    }

    /**
     * Test password reset request.
     */
    public function test_user_can_request_password_reset(): void
    {
        $user = User::factory()->create([
            'email' => 'reset@example.com',
        ]);

        $response = $this->postJson('/api/v1/password/forgot', [
            'email' => 'reset@example.com',
        ]);

        $response->assertStatus(200)
            ->assertJson(['success' => true]);

        $this->assertDatabaseHas('password_reset_tokens', [
            'email' => 'reset@example.com',
        ]);
    }

    /**
     * Test password reset with non-existent email returns success (security).
     */
    public function test_password_reset_with_nonexistent_email_returns_success(): void
    {
        $response = $this->postJson('/api/v1/password/forgot', [
            'email' => 'nonexistent@example.com',
        ]);

        // Should return success to prevent email enumeration
        $response->assertStatus(200)
            ->assertJson(['success' => true]);
    }

    /**
     * Test user can change password when authenticated.
     */
    public function test_authenticated_user_can_change_password(): void
    {
        $user = User::factory()->create([
            'password' => Hash::make('OldPassword123!'),
        ]);

        $response = $this->actingAs($user)
            ->postJson('/api/v1/user/change-password', [
                'current_password' => 'OldPassword123!',
                'password' => 'NewPassword456!',
                'password_confirmation' => 'NewPassword456!',
            ]);

        $response->assertStatus(200)
            ->assertJson(['success' => true]);

        // Verify the password was changed
        $user->refresh();
        $this->assertTrue(Hash::check('NewPassword456!', $user->password));
    }

    /**
     * Test password change fails with wrong current password.
     */
    public function test_password_change_fails_with_wrong_current_password(): void
    {
        $user = User::factory()->create([
            'password' => Hash::make('OldPassword123!'),
        ]);

        $response = $this->actingAs($user)
            ->postJson('/api/v1/user/change-password', [
                'current_password' => 'WrongPassword!',
                'password' => 'NewPassword456!',
                'password_confirmation' => 'NewPassword456!',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['current_password']);
    }
}
