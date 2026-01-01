<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\LoginHistory;
use App\Notifications\PasswordResetNotification;
use App\Notifications\WelcomeNotification;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Illuminate\Validation\Rules\Password as PasswordRule;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Events\Verified;

class AuthController extends Controller
{
    /**
     * Handle user registration.
     */
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'user_name' => 'required|string|max:255|unique:users|regex:/^[a-zA-Z0-9_]+$/',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => [
                'required',
                'confirmed',
                PasswordRule::min(8)
                    ->letters()
                    ->mixedCase()
                    ->numbers()
                    ->symbols()
            ],
            'gender' => 'required|in:male,female,other',
            'dob' => 'required|date|before:today|after:1900-01-01',
            'phone_number' => 'required|string|max:20',
            'user_type' => 'required|in:candidate,employer',
        ], [
            'user_name.regex' => 'Username can only contain letters, numbers, and underscores.',
            'password.min' => 'Password must be at least 8 characters.',
        ]);

        try {
            $user = User::create([
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'user_name' => $validated['user_name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'gender' => $validated['gender'],
                'dob' => $validated['dob'],
                'phone_number' => $validated['phone_number'],
                'user_type' => $validated['user_type'],
            ]);

            // Fire registered event (triggers email verification notification)
            event(new Registered($user));

            // Send welcome notification
            $user->notify(new WelcomeNotification());

            $token = $user->createToken('auth_token')->plainTextToken;

            // Record login history
            if (class_exists(LoginHistory::class)) {
                LoginHistory::recordLogin($user, $request);
            }

            Log::info('New user registered', [
                'user_id' => $user->id,
                'email' => $user->email,
                'user_type' => $user->user_type,
                'ip' => $request->ip(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Registration successful. Please check your email to verify your account.',
                'data' => [
                    'user' => $user,
                    'token' => $token,
                ],
            ], 201);
        } catch (\Exception $e) {
            Log::error('Registration failed', [
                'email' => $validated['email'] ?? 'unknown',
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Registration failed. Please try again.',
            ], 500);
        }
    }

    /**
     * Handle user login.
     */
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        // Rate limiting for login attempts
        $key = 'login_attempts:' . $request->ip();
        if (RateLimiter::tooManyAttempts($key, 5)) {
            $seconds = RateLimiter::availableIn($key);
            throw ValidationException::withMessages([
                'email' => ["Too many login attempts. Please try again in {$seconds} seconds."],
            ]);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            RateLimiter::hit($key, 60); // Lock for 60 seconds after 5 attempts

            Log::warning('Failed login attempt', [
                'email' => $request->email,
                'ip' => $request->ip(),
            ]);

            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Clear rate limiter on successful login
        RateLimiter::clear($key);

        if ($user->is_banned ?? false) {
            throw ValidationException::withMessages([
                'email' => ['Your account has been banned. Please contact support.'],
            ]);
        }

        if ($user->is_suspended ?? false) {
            throw ValidationException::withMessages([
                'email' => ['Your account is temporarily suspended. Reason: ' . ($user->suspension_reason ?? 'Contact support for details.')],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        // Update last active timestamp
        $user->touchLastActive();

        // Record login history
        if (class_exists(LoginHistory::class)) {
            LoginHistory::recordLogin($user, $request);
        }

        Log::info('User logged in', [
            'user_id' => $user->id,
            'ip' => $request->ip(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'data' => [
                'user' => $user->load(['company', 'candidateProfile']),
                'token' => $token,
                'email_verified' => $user->hasVerifiedEmail(),
            ],
        ]);
    }

    /**
     * Handle user logout.
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        Log::info('User logged out', [
            'user_id' => $request->user()->id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully',
        ]);
    }

    /**
     * Logout from all devices.
     */
    public function logoutAll(Request $request): JsonResponse
    {
        $request->user()->tokens()->delete();

        Log::info('User logged out from all devices', [
            'user_id' => $request->user()->id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Logged out from all devices successfully',
        ]);
    }

    /**
     * Get authenticated user information.
     */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user()->load(['company', 'candidateProfile']);

        // Update last active timestamp
        $user->touchLastActive();

        return response()->json([
            'success' => true,
            'data' => [
                'user' => $user,
                'email_verified' => $user->hasVerifiedEmail(),
                'profile_complete' => $this->isProfileComplete($user),
            ],
        ]);
    }

    /**
     * Handle forgot password request.
     */
    public function forgotPassword(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        // Rate limiting for password reset requests
        $key = 'password_reset:' . $request->ip();
        if (RateLimiter::tooManyAttempts($key, 3)) {
            $seconds = RateLimiter::availableIn($key);
            return response()->json([
                'success' => false,
                'message' => "Too many password reset attempts. Please try again in {$seconds} seconds.",
            ], 429);
        }

        $user = User::where('email', $request->email)->first();

        // Always return success to prevent email enumeration
        if (!$user) {
            RateLimiter::hit($key, 300); // 5 minutes
            return response()->json([
                'success' => true,
                'message' => 'If an account exists with this email, a password reset link will be sent.',
            ]);
        }

        RateLimiter::hit($key, 300);

        $token = Str::random(64);

        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $request->email],
            [
                'token' => Hash::make($token),
                'created_at' => now(),
            ]
        );

        // Send password reset notification
        $user->notify(new PasswordResetNotification($token));

        Log::info('Password reset requested', [
            'user_id' => $user->id,
            'ip' => $request->ip(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'If an account exists with this email, a password reset link will be sent.',
        ]);
    }

    /**
     * Handle password reset.
     */
    public function resetPassword(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
            'token' => 'required|string',
            'password' => [
                'required',
                'confirmed',
                PasswordRule::min(8)
                    ->letters()
                    ->mixedCase()
                    ->numbers()
                    ->symbols()
            ],
        ]);

        $record = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->first();

        if (!$record) {
            throw ValidationException::withMessages([
                'email' => ['Invalid password reset request.'],
            ]);
        }

        if (!Hash::check($request->token, $record->token)) {
            throw ValidationException::withMessages([
                'token' => ['Invalid or expired reset token.'],
            ]);
        }

        // Check if token is expired (1 hour)
        if (now()->diffInMinutes($record->created_at) > 60) {
            DB::table('password_reset_tokens')->where('email', $request->email)->delete();
            throw ValidationException::withMessages([
                'token' => ['Password reset token has expired. Please request a new one.'],
            ]);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            throw ValidationException::withMessages([
                'email' => ['User not found.'],
            ]);
        }

        $user->update([
            'password' => Hash::make($request->password),
        ]);

        // Revoke all existing tokens for security
        $user->tokens()->delete();

        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        Log::info('Password reset successful', [
            'user_id' => $user->id,
            'ip' => $request->ip(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Password has been reset successfully. Please login with your new password.',
        ]);
    }

    /**
     * Handle email verification.
     */
    public function verifyEmail(Request $request, $id, $hash): JsonResponse
    {
        $user = User::findOrFail($id);

        if (!hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
            throw ValidationException::withMessages([
                'email' => ['Invalid verification link.'],
            ]);
        }

        if ($user->hasVerifiedEmail()) {
            return response()->json([
                'success' => true,
                'message' => 'Email already verified.',
                'already_verified' => true,
            ]);
        }

        $user->markEmailAsVerified();
        event(new Verified($user));

        Log::info('Email verified', [
            'user_id' => $user->id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Email verified successfully. You can now access all features.',
        ]);
    }

    /**
     * Resend email verification link.
     */
    public function resendVerification(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user) {
            $request->validate([
                'email' => 'required|email|exists:users,email',
            ]);
            $user = User::where('email', $request->email)->first();
        }

        if ($user->hasVerifiedEmail()) {
            return response()->json([
                'success' => false,
                'message' => 'Email already verified.',
            ], 400);
        }

        // Rate limiting
        $key = 'verification_email:' . $user->id;
        if (RateLimiter::tooManyAttempts($key, 3)) {
            $seconds = RateLimiter::availableIn($key);
            return response()->json([
                'success' => false,
                'message' => "Please wait {$seconds} seconds before requesting another verification email.",
            ], 429);
        }

        RateLimiter::hit($key, 60); // 1 minute cooldown

        $user->sendEmailVerificationNotification();

        return response()->json([
            'success' => true,
            'message' => 'Verification link has been sent to your email.',
        ]);
    }

    /**
     * Refresh the authentication token.
     */
    public function refresh(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();
        $token = $request->user()->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'data' => [
                'token' => $token,
            ],
        ]);
    }

    /**
     * Change user password (authenticated).
     */
    public function changePassword(Request $request): JsonResponse
    {
        $request->validate([
            'current_password' => 'required|string',
            'password' => [
                'required',
                'confirmed',
                PasswordRule::min(8)
                    ->letters()
                    ->mixedCase()
                    ->numbers()
                    ->symbols()
            ],
        ]);

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['Current password is incorrect.'],
            ]);
        }

        $user->update([
            'password' => Hash::make($request->password),
        ]);

        // Revoke all other tokens for security
        $user->tokens()->where('id', '!=', $user->currentAccessToken()->id)->delete();

        Log::info('Password changed', [
            'user_id' => $user->id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Password changed successfully.',
        ]);
    }

    /**
     * Get login history for the authenticated user.
     */
    public function loginHistory(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!class_exists(LoginHistory::class)) {
            return response()->json([
                'success' => true,
                'data' => [],
            ]);
        }

        $history = $user->loginHistory()
            ->orderBy('created_at', 'desc')
            ->limit(20)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $history,
        ]);
    }

    /**
     * Delete user account.
     */
    public function deleteAccount(Request $request): JsonResponse
    {
        $request->validate([
            'password' => 'required|string',
            'confirmation' => 'required|in:DELETE',
        ], [
            'confirmation.in' => 'Please type DELETE to confirm account deletion.',
        ]);

        $user = $request->user();

        if (!Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'password' => ['Password is incorrect.'],
            ]);
        }

        Log::info('User account deleted', [
            'user_id' => $user->id,
            'email' => $user->email,
        ]);

        // Revoke all tokens
        $user->tokens()->delete();

        // Soft delete or hard delete based on business requirements
        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'Your account has been deleted successfully.',
        ]);
    }

    /**
     * Check if user profile is complete.
     */
    private function isProfileComplete(User $user): bool
    {
        $requiredFields = ['first_name', 'last_name', 'email', 'phone_number'];

        foreach ($requiredFields as $field) {
            if (empty($user->$field)) {
                return false;
            }
        }

        if ($user->isCandidate()) {
            return $user->candidateProfile !== null;
        }

        if ($user->isEmployer()) {
            return $user->company !== null;
        }

        return true;
    }
}
