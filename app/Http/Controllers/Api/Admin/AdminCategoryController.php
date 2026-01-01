<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\JobCategory;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class AdminCategoryController extends Controller
{
    /**
     * Get all categories with job counts.
     */
    public function index(Request $request): JsonResponse
    {
        $categories = JobCategory::query()
            ->withCount(['jobs', 'jobs as active_jobs_count' => function ($query) {
                $query->where('status', 'active');
            }])
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->when($request->has('is_active'), function ($query) use ($request) {
                $query->where('is_active', $request->boolean('is_active'));
            })
            ->when($request->sort_by, function ($query, $sortBy) use ($request) {
                $direction = $request->get('sort_direction', 'asc');
                $query->orderBy($sortBy, $direction);
            }, function ($query) {
                $query->orderBy('name');
            })
            ->paginate($request->per_page ?? 20);

        return $this->success($categories, 'Categories retrieved successfully');
    }

    /**
     * Get a specific category.
     */
    public function show($id): JsonResponse
    {
        $category = JobCategory::withCount([
            'jobs',
            'jobs as active_jobs_count' => function ($query) {
                $query->where('status', 'active');
            }
        ])->findOrFail($id);

        // Get top jobs in this category
        $category->top_jobs = $category->jobs()
            ->with('company:id,name,logo')
            ->where('status', 'active')
            ->orderByDesc('views_count')
            ->take(5)
            ->get(['id', 'title', 'company_id', 'location', 'views_count']);

        return $this->success($category, 'Category retrieved successfully');
    }

    /**
     * Create a new category.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:job_categories',
            'description' => 'nullable|string|max:500',
            'icon' => 'nullable|string|max:100',
            'icon_class' => 'nullable|string|max:100',
            'is_active' => 'sometimes|boolean',
            'is_featured' => 'sometimes|boolean',
        ]);

        $validated['slug'] = Str::slug($validated['name']);
        $validated['is_active'] = $validated['is_active'] ?? true;

        $category = JobCategory::create($validated);

        $this->logAudit('create', $category);

        return $this->success($category, 'Category created successfully', 201);
    }

    /**
     * Update a category.
     */
    public function update(Request $request, $id): JsonResponse
    {
        $category = JobCategory::findOrFail($id);

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255', Rule::unique('job_categories')->ignore($id)],
            'description' => 'nullable|string|max:500',
            'icon' => 'nullable|string|max:100',
            'icon_class' => 'nullable|string|max:100',
            'is_active' => 'sometimes|boolean',
            'is_featured' => 'sometimes|boolean',
        ]);

        if (isset($validated['name'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $category->update($validated);

        $this->logAudit('update', $category, $validated);

        return $this->success($category, 'Category updated successfully');
    }

    /**
     * Delete a category.
     */
    public function destroy($id): JsonResponse
    {
        $category = JobCategory::withCount('jobs')->findOrFail($id);

        if ($category->jobs_count > 0) {
            return $this->error(
                "Cannot delete category with {$category->jobs_count} job(s). Please reassign jobs first or deactivate the category.",
                400
            );
        }

        $this->logAudit('delete', $category);

        $category->delete();

        return $this->success(null, 'Category deleted successfully');
    }

    /**
     * Log admin actions for audit trail.
     */
    private function logAudit(string $action, JobCategory $category, array $data = []): void
    {
        if (class_exists(\App\Models\AuditLog::class)) {
            try {
                \App\Models\AuditLog::create([
                    'user_id' => auth()->id(),
                    'action' => $action,
                    'model_type' => JobCategory::class,
                    'model_id' => $category->id,
                    'old_values' => json_encode($category->getOriginal()),
                    'new_values' => json_encode($data),
                    'ip_address' => request()->ip(),
                    'user_agent' => request()->userAgent(),
                ]);
            } catch (\Exception $e) {
                // Silently fail
            }
        }
    }
}
