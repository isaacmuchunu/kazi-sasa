<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\Job;
use Illuminate\Http\Request;

class CompanyController extends Controller
{
    /**
     * Display a listing of companies.
     */
    public function index(Request $request)
    {
        $companies = Company::withCount('jobs')
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->orderBy('name')
            ->paginate($request->per_page ?? 20);

        return $this->success($companies, 'Companies retrieved successfully');
    }

    /**
     * Display the specified company.
     */
    public function show($id)
    {
        $company = Company::withCount('jobs')
            ->findOrFail($id);

        return $this->success($company, 'Company retrieved successfully');
    }

    /**
     * Get jobs for a specific company.
     */
    public function jobs($id, Request $request)
    {
        $company = Company::findOrFail($id);
        
        $jobs = Job::with(['category'])
            ->where('company_id', $id)
            ->active()
            ->when($request->search, function ($query, $search) {
                $query->where(function($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate($request->per_page ?? 10);

        return $this->success([
            'company' => $company,
            'jobs' => $jobs
        ], 'Company jobs retrieved successfully');
    }
}