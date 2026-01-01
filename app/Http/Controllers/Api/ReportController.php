<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UserReport;
use App\Models\User;
use App\Models\Job;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ReportController extends Controller
{
    /**
     * Submit a new report.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'reportable_type' => 'required|in:user,job,company,review,message',
            'reportable_id' => 'required|integer',
            'reason' => 'required|string|in:spam,harassment,inappropriate,fraud,other',
            'description' => 'required|string|max:1000',
        ]);

        // Map reportable types to model classes
        $typeMap = [
            'user' => User::class,
            'job' => Job::class,
            'company' => Company::class,
            'review' => \App\Models\Review::class,
            'message' => \App\Models\Message::class,
        ];

        $modelClass = $typeMap[$validated['reportable_type']];

        // Verify the reportable exists
        if (!$modelClass::find($validated['reportable_id'])) {
            return response()->json([
                'success' => false,
                'message' => 'The reported item does not exist.',
            ], 404);
        }

        // Check for duplicate reports from same user
        $existingReport = UserReport::where('reporter_id', $request->user()->id)
            ->where('reportable_type', $modelClass)
            ->where('reportable_id', $validated['reportable_id'])
            ->where('status', 'pending')
            ->first();

        if ($existingReport) {
            return response()->json([
                'success' => false,
                'message' => 'You have already reported this item.',
            ], 400);
        }

        $report = UserReport::create([
            'reporter_id' => $request->user()->id,
            'reportable_type' => $modelClass,
            'reportable_id' => $validated['reportable_id'],
            'reason' => $validated['reason'],
            'description' => $validated['description'],
            'status' => 'pending',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Report submitted successfully. We will review it shortly.',
            'data' => $report,
        ], 201);
    }

    /**
     * Get reports submitted by the current user.
     */
    public function myReports(Request $request): JsonResponse
    {
        $reports = UserReport::where('reporter_id', $request->user()->id)
            ->with('reportable')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $reports,
        ]);
    }
}
