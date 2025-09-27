<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CompanyController extends Controller
{
    /**
     * Display a listing of companies.
     */
    public function index(Request $request)
    {
        // For now, return a simple view
        // In a real application, you would query companies from database

        return view('companies.index');
    }

    /**
     * Display the specified company.
     */
    public function show($id)
    {
        // For now, use sample data
        $company = (object) [
            'id' => $id,
            'name' => 'Tourt Design LTD',
            'logo' => asset('assets/img/company-logo/1.png'),
            'location' => 'Wellesley Rd, London',
            'website' => 'www.company.com',
            'email' => 'hello@company.com',
            'description' => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
            'employees' => '50-100',
            'founded' => '2010',
            'industry' => 'Technology'
        ];

        return view('companies.show', compact('company'));
    }

    /**
     * Display jobs for the specified company.
     */
    public function jobs($id, Request $request)
    {
        // For now, redirect to jobs list with company filter
        $request->merge(['company' => $id]);
        return app(JobController::class)->list($request);
    }
}