<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\User;
use Illuminate\Database\Seeder;

class CompanySeeder extends Seeder
{
    public function run(): void
    {
        $companies = [
            [
                'email' => 'john@techcorp.co.ke',
                'company' => [
                    'name' => 'TechCorp Kenya',
                    'slug' => 'techcorp-kenya',
                    'description' => 'Leading technology solutions company in East Africa, specializing in software development, cloud services, and digital transformation.',
                    'industry' => 'Technology',
                    'company_size' => '51-200',
                    'founded_year' => 2015,
                    'website' => 'https://techcorp.co.ke',
                    'location' => 'Nairobi, Kenya',
                    'address' => 'Westlands, Nairobi',
                    'phone' => '+254701111111',
                    'email' => 'info@techcorp.co.ke',
                    'is_verified' => true,
                ],
            ],
            [
                'email' => 'mary@innovate.co.ke',
                'company' => [
                    'name' => 'Innovate Solutions',
                    'slug' => 'innovate-solutions',
                    'description' => 'A dynamic startup focused on creating innovative products for the African market. We build mobile apps, fintech solutions, and e-commerce platforms.',
                    'industry' => 'Technology',
                    'company_size' => '11-50',
                    'founded_year' => 2019,
                    'website' => 'https://innovate.co.ke',
                    'location' => 'Mombasa, Kenya',
                    'address' => 'Nyali, Mombasa',
                    'phone' => '+254702222222',
                    'email' => 'hello@innovate.co.ke',
                    'is_verified' => true,
                ],
            ],
            [
                'email' => 'peter@globaltech.co.ke',
                'company' => [
                    'name' => 'GlobalTech Africa',
                    'slug' => 'globaltech-africa',
                    'description' => 'International technology consulting firm with a presence across Africa. We provide enterprise solutions, IT consulting, and managed services.',
                    'industry' => 'Consulting',
                    'company_size' => '201-500',
                    'founded_year' => 2010,
                    'website' => 'https://globaltech.co.ke',
                    'location' => 'Kisumu, Kenya',
                    'address' => 'Milimani, Kisumu',
                    'phone' => '+254703333333',
                    'email' => 'contact@globaltech.co.ke',
                    'is_verified' => true,
                ],
            ],
        ];

        foreach ($companies as $data) {
            $user = User::where('email', $data['email'])->first();
            if ($user) {
                Company::create(array_merge($data['company'], [
                    'user_id' => $user->id,
                ]));
            }
        }
    }
}
