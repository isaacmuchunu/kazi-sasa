<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreJobRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check() && auth()->user()->user_type === 'employer';
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'job_category_id' => ['required', 'exists:job_categories,id'],
            'location' => ['required', 'string', 'max:255'],
            'job_type' => ['required', 'in:full-time,part-time,contract,internship,freelance'],
            'experience_level' => ['required', 'in:entry,mid,senior,executive'],
            'description' => ['required', 'string'],
            'requirements' => ['nullable', 'string'],
            'salary_min' => ['nullable', 'numeric', 'min:0'],
            'salary_max' => ['nullable', 'numeric', 'min:0', 'gte:salary_min'],
            'salary_period' => ['nullable', 'in:hourly,monthly,yearly'],
            'skills_required' => ['nullable', 'array'],
            'skills_required.*' => ['string', 'max:50'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['string', 'max:50'],
            'application_deadline' => ['nullable', 'date', 'after:today'],
            'status' => ['required', 'in:active,closed,draft'],
            'is_featured' => ['boolean'],
            'is_urgent' => ['boolean'],
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'title.required' => 'Please enter a job title.',
            'job_category_id.required' => 'Please select a job category.',
            'job_category_id.exists' => 'The selected category does not exist.',
            'location.required' => 'Please enter a location.',
            'job_type.required' => 'Please select a job type.',
            'experience_level.required' => 'Please select an experience level.',
            'description.required' => 'Please enter a job description.',
            'salary_max.gte' => 'Maximum salary must be greater than or equal to minimum salary.',
            'application_deadline.after' => 'Application deadline must be a future date.',
        ];
    }
}
