<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class MessageController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $messages = Message::with(['sender', 'recipient'])
            ->where(function ($query) {
                $query->where('sender_id', Auth::id())
                      ->orWhere('recipient_id', Auth::id());
            })
            ->with(['sender:id,first_name,last_name,user_name,profile_image',
                   'recipient:id,first_name,last_name,user_name,profile_image'])
            ->latest()
            ->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $messages
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'recipient_id' => 'required|exists:users,id',
            'subject' => 'required|string|max:255',
            'message' => 'required|string|max:2000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        // Check if recipient is a candidate (candidates can receive messages from employers)
        $recipient = User::findOrFail($request->recipient_id);
        if (!$recipient->isCandidate()) {
            return response()->json([
                'success' => false,
                'message' => 'Messages can only be sent to candidates'
            ], 422);
        }

        // Only employers can send messages
        if (!Auth::user()->isEmployer()) {
            return response()->json([
                'success' => false,
                'message' => 'Only employers can send messages'
            ], 403);
        }

        $message = Message::create([
            'sender_id' => Auth::id(),
            'recipient_id' => $request->recipient_id,
            'subject' => $request->subject,
            'message' => $request->message,
            'is_read' => false,
        ]);

        $message->load(['sender:id,first_name,last_name,user_name,profile_image',
                        'recipient:id,first_name,last_name,user_name,profile_image']);

        return response()->json([
            'success' => true,
            'message' => 'Message sent successfully',
            'data' => $message
        ], 201);
    }

    public function show($id): JsonResponse
    {
        $message = Message::with(['sender:id,first_name,last_name,user_name,profile_image',
                                  'recipient:id,first_name,last_name,user_name,profile_image'])
            ->where(function ($query) {
                $query->where('sender_id', Auth::id())
                      ->orWhere('recipient_id', Auth::id());
            })
            ->findOrFail($id);

        // Mark as read if current user is recipient
        if ($message->recipient_id === Auth::id()) {
            $message->update(['is_read' => true, 'read_at' => now()]);
        }

        return response()->json([
            'success' => true,
            'data' => $message
        ]);
    }

    public function conversations(Request $request): JsonResponse
    {
        $authId = Auth::id();

        // Get all unique conversations for current user
        $conversations = Message::with(['sender:id,first_name,last_name,user_name,profile_image',
                                         'recipient:id,first_name,last_name,user_name,profile_image'])
            ->where(function ($query) use ($authId) {
                $query->where('sender_id', $authId)
                      ->orWhere('recipient_id', $authId);
            })
            ->get()
            ->groupBy(function ($message) use ($authId) {
                if ($message->sender_id === $authId) {
                    return 'user_' . $message->recipient_id;
                } else {
                    return 'user_' . $message->sender_id;
                }
            })
            ->map(function ($messages) {
                return $messages->sortByDesc('created_at')->first();
            })
            ->values()
            ->sortByDesc('created_at');

        return response()->json([
            'success' => true,
            'data' => $conversations->values()
        ]);
    }

    public function markRead($id): JsonResponse
    {
        $message = Message::where('recipient_id', Auth::id())->findOrFail($id);
        $message->update(['is_read' => true, 'read_at' => now()]);

        return response()->json([
            'success' => true,
            'message' => 'Message marked as read'
        ]);
    }

    public function delete($id): JsonResponse
    {
        $message = Message::where(function ($query) {
            $query->where('sender_id', Auth::id())
                  ->orWhere('recipient_id', Auth::id());
        })->findOrFail($id);

        $message->delete();

        return response()->json([
            'success' => true,
            'message' => 'Message deleted successfully'
        ]);
    }
}
