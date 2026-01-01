<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class AdminAuditController extends Controller
{
    /**
     * Get audit logs with filtering.
     */
    public function index(Request $request): JsonResponse
    {
        // Check if audit_logs table exists
        if (!\Schema::hasTable('audit_logs')) {
            return $this->success([
                'data' => [],
                'message' => 'Audit logging is not yet configured. Please run migrations.',
            ], 'Audit logs not available');
        }

        $logs = DB::table('audit_logs')
            ->leftJoin('users', 'audit_logs.user_id', '=', 'users.id')
            ->select([
                'audit_logs.*',
                'users.first_name',
                'users.last_name',
                'users.email as user_email',
            ])
            ->when($request->user_id, function ($query, $userId) {
                $query->where('audit_logs.user_id', $userId);
            })
            ->when($request->action, function ($query, $action) {
                $query->where('audit_logs.action', $action);
            })
            ->when($request->model_type, function ($query, $modelType) {
                $query->where('audit_logs.model_type', 'like', "%{$modelType}%");
            })
            ->when($request->date_from, function ($query, $date) {
                $query->where('audit_logs.created_at', '>=', $date);
            })
            ->when($request->date_to, function ($query, $date) {
                $query->where('audit_logs.created_at', '<=', $date);
            })
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('audit_logs.action', 'like', "%{$search}%")
                        ->orWhere('audit_logs.model_type', 'like', "%{$search}%")
                        ->orWhere('users.first_name', 'like', "%{$search}%")
                        ->orWhere('users.last_name', 'like', "%{$search}%");
                });
            })
            ->orderByDesc('audit_logs.created_at')
            ->paginate($request->per_page ?? 20);

        // Transform the data
        $logs->getCollection()->transform(function ($log) {
            return [
                'id' => $log->id,
                'user' => $log->user_id ? [
                    'id' => $log->user_id,
                    'name' => trim("{$log->first_name} {$log->last_name}"),
                    'email' => $log->user_email,
                ] : null,
                'action' => $log->action,
                'model_type' => class_basename($log->model_type),
                'model_id' => $log->model_id,
                'old_values' => json_decode($log->old_values, true),
                'new_values' => json_decode($log->new_values, true),
                'ip_address' => $log->ip_address,
                'user_agent' => $log->user_agent,
                'created_at' => $log->created_at,
            ];
        });

        return $this->success($logs, 'Audit logs retrieved successfully');
    }

    /**
     * Get a specific audit log entry.
     */
    public function show($id): JsonResponse
    {
        if (!\Schema::hasTable('audit_logs')) {
            return $this->error('Audit logging is not configured', 404);
        }

        $log = DB::table('audit_logs')
            ->leftJoin('users', 'audit_logs.user_id', '=', 'users.id')
            ->select([
                'audit_logs.*',
                'users.first_name',
                'users.last_name',
                'users.email as user_email',
            ])
            ->where('audit_logs.id', $id)
            ->first();

        if (!$log) {
            return $this->error('Audit log not found', 404);
        }

        $result = [
            'id' => $log->id,
            'user' => $log->user_id ? [
                'id' => $log->user_id,
                'name' => trim("{$log->first_name} {$log->last_name}"),
                'email' => $log->user_email,
            ] : null,
            'action' => $log->action,
            'model_type' => $log->model_type,
            'model_type_short' => class_basename($log->model_type),
            'model_id' => $log->model_id,
            'old_values' => json_decode($log->old_values, true),
            'new_values' => json_decode($log->new_values, true),
            'ip_address' => $log->ip_address,
            'user_agent' => $log->user_agent,
            'created_at' => $log->created_at,
        ];

        return $this->success($result, 'Audit log retrieved successfully');
    }

    /**
     * Get available actions for filtering.
     */
    public function actions(): JsonResponse
    {
        if (!\Schema::hasTable('audit_logs')) {
            return $this->success([], 'No actions available');
        }

        $actions = DB::table('audit_logs')
            ->select('action')
            ->distinct()
            ->orderBy('action')
            ->pluck('action');

        return $this->success($actions, 'Available actions retrieved');
    }
}
