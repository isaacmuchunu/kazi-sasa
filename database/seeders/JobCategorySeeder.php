<?php

namespace Database\Seeders;

use App\Models\JobCategory;
use Illuminate\Database\Seeder;

class JobCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Technology',
                'slug' => 'technology',
                'description' => 'Software development, IT, and technology jobs',
                'icon' => 'computer',
            ],
            [
                'name' => 'Marketing',
                'slug' => 'marketing',
                'description' => 'Marketing, advertising, and communications jobs',
                'icon' => 'megaphone',
            ],
            [
                'name' => 'Design',
                'slug' => 'design',
                'description' => 'Graphic design, UX/UI, and creative jobs',
                'icon' => 'palette',
            ],
            [
                'name' => 'Finance',
                'slug' => 'finance',
                'description' => 'Accounting, banking, and finance jobs',
                'icon' => 'currency-dollar',
            ],
            [
                'name' => 'Healthcare',
                'slug' => 'healthcare',
                'description' => 'Medical, nursing, and healthcare jobs',
                'icon' => 'heart',
            ],
            [
                'name' => 'Education',
                'slug' => 'education',
                'description' => 'Teaching, training, and education jobs',
                'icon' => 'academic-cap',
            ],
            [
                'name' => 'Engineering',
                'slug' => 'engineering',
                'description' => 'Civil, mechanical, and electrical engineering jobs',
                'icon' => 'cog',
            ],
            [
                'name' => 'Sales',
                'slug' => 'sales',
                'description' => 'Sales, business development, and retail jobs',
                'icon' => 'shopping-cart',
            ],
            [
                'name' => 'Human Resources',
                'slug' => 'human-resources',
                'description' => 'HR, recruitment, and people management jobs',
                'icon' => 'users',
            ],
            [
                'name' => 'Customer Service',
                'slug' => 'customer-service',
                'description' => 'Support, customer success, and service jobs',
                'icon' => 'chat',
            ],
        ];

        foreach ($categories as $category) {
            JobCategory::create($category);
        }
    }
}
