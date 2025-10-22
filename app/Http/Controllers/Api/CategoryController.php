<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JobCategory;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Display a listing of categories.
     */
    public function index(Request $request)
    {
        $categories = JobCategory::withCount('jobs')
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->orderBy('name')
            ->paginate($request->per_page ?? 20);

        return $this->success($categories, 'Categories retrieved successfully');
    }

    /**
     * Display the specified category.
     */
    public function show($id)
    {
        $category = JobCategory::with('jobs.company')
            ->withCount('jobs')
            ->findOrFail($id);

        return $this->success($category, 'Category retrieved successfully');
    }
}