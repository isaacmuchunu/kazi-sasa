<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\CandidateProfile;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin user
        User::create([
            'first_name' => 'Admin',
            'last_name' => 'User',
            'user_name' => 'admin',
            'email' => 'admin@kazisasa.co.ke',
            'password' => Hash::make('password'),
            'user_type' => 'admin',
            'phone_number' => '+254700000000',
            'location' => 'Nairobi, Kenya',
            'country' => 'Kenya',
            'city' => 'Nairobi',
            'is_verified' => true,
            'email_verified_at' => now(),
        ]);

        // Create employer users
        $employers = [
            [
                'first_name' => 'John',
                'last_name' => 'Kamau',
                'user_name' => 'johnkamau',
                'email' => 'john@techcorp.co.ke',
                'phone_number' => '+254701111111',
                'location' => 'Nairobi, Kenya',
                'country' => 'Kenya',
                'city' => 'Nairobi',
            ],
            [
                'first_name' => 'Mary',
                'last_name' => 'Wanjiku',
                'user_name' => 'marywanjiku',
                'email' => 'mary@innovate.co.ke',
                'phone_number' => '+254702222222',
                'location' => 'Mombasa, Kenya',
                'country' => 'Kenya',
                'city' => 'Mombasa',
            ],
            [
                'first_name' => 'Peter',
                'last_name' => 'Ochieng',
                'user_name' => 'peterochieng',
                'email' => 'peter@globaltech.co.ke',
                'phone_number' => '+254703333333',
                'location' => 'Kisumu, Kenya',
                'country' => 'Kenya',
                'city' => 'Kisumu',
            ],
        ];

        foreach ($employers as $employer) {
            User::create(array_merge($employer, [
                'password' => Hash::make('password'),
                'user_type' => 'employer',
                'is_verified' => true,
                'email_verified_at' => now(),
            ]));
        }

        // Create candidate users
        $candidates = [
            [
                'first_name' => 'Alice',
                'last_name' => 'Muthoni',
                'user_name' => 'alicemuthoni',
                'email' => 'alice@email.com',
                'phone_number' => '+254711111111',
                'location' => 'Nairobi, Kenya',
                'job_title' => 'Software Developer',
                'experience_years' => 3,
                'bio' => 'Passionate software developer with experience in React and Node.js.',
            ],
            [
                'first_name' => 'David',
                'last_name' => 'Kiprop',
                'user_name' => 'davidkiprop',
                'email' => 'david@email.com',
                'phone_number' => '+254712222222',
                'location' => 'Eldoret, Kenya',
                'job_title' => 'Marketing Specialist',
                'experience_years' => 5,
                'bio' => 'Digital marketing expert with a focus on social media and content strategy.',
            ],
            [
                'first_name' => 'Grace',
                'last_name' => 'Akinyi',
                'user_name' => 'graceakinyi',
                'email' => 'grace@email.com',
                'phone_number' => '+254713333333',
                'location' => 'Mombasa, Kenya',
                'job_title' => 'UX Designer',
                'experience_years' => 4,
                'bio' => 'Creative UX designer passionate about user-centered design.',
            ],
            [
                'first_name' => 'James',
                'last_name' => 'Mwangi',
                'user_name' => 'jamesmwangi',
                'email' => 'james@email.com',
                'phone_number' => '+254714444444',
                'location' => 'Nakuru, Kenya',
                'job_title' => 'Data Analyst',
                'experience_years' => 2,
                'bio' => 'Data analyst skilled in Python, SQL, and data visualization.',
            ],
            [
                'first_name' => 'Faith',
                'last_name' => 'Njeri',
                'user_name' => 'faithnjeri',
                'email' => 'faith@email.com',
                'phone_number' => '+254715555555',
                'location' => 'Nairobi, Kenya',
                'job_title' => 'Project Manager',
                'experience_years' => 6,
                'bio' => 'Certified PMP with experience in agile project management.',
            ],
        ];

        foreach ($candidates as $candidateData) {
            $user = User::create(array_merge($candidateData, [
                'password' => Hash::make('password'),
                'user_type' => 'candidate',
                'country' => 'Kenya',
                'city' => explode(',', $candidateData['location'])[0],
                'is_verified' => true,
                'email_verified_at' => now(),
            ]));

            // Create candidate profile
            CandidateProfile::create([
                'user_id' => $user->id,
                'headline' => $candidateData['job_title'],
                'summary' => $candidateData['bio'],
                'skills' => ['Communication', 'Teamwork', 'Problem Solving'],
                'languages' => ['English', 'Swahili'],
                'availability' => 'immediately',
            ]);
        }
    }
}
