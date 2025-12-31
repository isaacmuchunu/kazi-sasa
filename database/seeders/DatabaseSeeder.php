<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            JobCategorySeeder::class,
            UserSeeder::class,
            CompanySeeder::class,
            JobSeeder::class,
            BlogSeeder::class,
        ]);
    }
}
