<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    /**
     * Display user account dashboard.
     */
    public function account()
    {
        return view('account.index');
    }

    /**
     * Display user profile form.
     */
    public function profile()
    {
        $user = Auth::user();
        return view('account.profile', compact('user'));
    }

    /**
     * Update user profile.
     */
    public function updateProfile(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:20',
            'location' => 'nullable|string|max:255',
            'bio' => 'nullable|string|max:1000',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $data = $request->only(['name', 'email', 'phone', 'location', 'bio']);

        if ($request->hasFile('avatar')) {
            // Delete old avatar if exists
            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }

            $data['avatar'] = $request->file('avatar')->store('avatars', 'public');
        }

        $user->update($data);

        return redirect()->route('account.profile')->with('success', 'Profile updated successfully!');
    }

    /**
     * Display resume management page.
     */
    public function resume()
    {
        $user = Auth::user();
        return view('account.resume', compact('user'));
    }

    /**
     * Upload resume file.
     */
    public function uploadResume(Request $request)
    {
        $request->validate([
            'resume' => 'required|file|mimes:pdf,doc,docx|max:5120', // 5MB max
        ]);

        $user = Auth::user();

        // Delete old resume if exists
        if ($user->resume) {
            Storage::disk('public')->delete($user->resume);
        }

        $resumePath = $request->file('resume')->store('resumes', 'public');

        $user->update(['resume' => $resumePath]);

        return redirect()->route('account.resume')->with('success', 'Resume uploaded successfully!');
    }

    /**
     * Display applied jobs.
     */
    public function appliedJobs()
    {
        // For now, return empty data
        // In a real application, you would query applied jobs

        $appliedJobs = collect();
        return view('account.applied-jobs', compact('appliedJobs'));
    }

    /**
     * Display saved jobs.
     */
    public function savedJobs()
    {
        // For now, return empty data
        // In a real application, you would query saved jobs

        $savedJobs = collect();
        return view('account.saved-jobs', compact('savedJobs'));
    }

    /**
     * Display messages.
     */
    public function messages()
    {
        // For now, return empty data
        // In a real application, you would query messages

        $messages = collect();
        return view('account.messages', compact('messages'));
    }

    /**
     * Display change password form.
     */
    public function changePassword()
    {
        return view('account.change-password');
    }

    /**
     * Update user password.
     */
    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = Auth::user();

        if (!Hash::check($request->current_password, $user->password)) {
            return back()->withErrors(['current_password' => 'Current password is incorrect.']);
        }

        $user->update([
            'password' => Hash::make($request->password),
        ]);

        return redirect()->route('account.change-password')->with('success', 'Password updated successfully!');
    }

    /**
     * Delete user account.
     */
    public function deleteAccount()
    {
        $user = Auth::user();

        // Delete user files
        if ($user->avatar) {
            Storage::disk('public')->delete($user->avatar);
        }
        if ($user->resume) {
            Storage::disk('public')->delete($user->resume);
        }

        // Logout and delete user
        Auth::logout();
        $user->delete();

        return redirect()->route('home')->with('success', 'Account deleted successfully!');
    }
}