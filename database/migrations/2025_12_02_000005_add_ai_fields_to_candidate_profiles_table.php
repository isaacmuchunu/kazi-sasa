<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('candidate_profiles', function (Blueprint $table) {
            // AI matching preferences
            if (!Schema::hasColumn('candidate_profiles', 'preferred_job_types')) {
                $table->json('preferred_job_types')->nullable()->after('skills'); // ['full-time', 'remote']
            }

            if (!Schema::hasColumn('candidate_profiles', 'preferred_categories')) {
                $table->json('preferred_categories')->nullable()->after('preferred_job_types'); // category IDs
            }

            if (!Schema::hasColumn('candidate_profiles', 'preferred_locations')) {
                $table->json('preferred_locations')->nullable()->after('preferred_categories');
            }

            if (!Schema::hasColumn('candidate_profiles', 'expected_salary_min')) {
                $table->decimal('expected_salary_min', 12, 2)->nullable()->after('preferred_locations');
            }

            if (!Schema::hasColumn('candidate_profiles', 'expected_salary_max')) {
                $table->decimal('expected_salary_max', 12, 2)->nullable()->after('expected_salary_min');
            }

            if (!Schema::hasColumn('candidate_profiles', 'salary_currency')) {
                $table->string('salary_currency', 3)->default('KES')->after('expected_salary_max');
            }

            if (!Schema::hasColumn('candidate_profiles', 'is_open_to_remote')) {
                $table->boolean('is_open_to_remote')->default(true)->after('salary_currency');
            }

            if (!Schema::hasColumn('candidate_profiles', 'is_open_to_relocation')) {
                $table->boolean('is_open_to_relocation')->default(false)->after('is_open_to_remote');
            }

            if (!Schema::hasColumn('candidate_profiles', 'availability')) {
                $table->string('availability')->nullable()->after('is_open_to_relocation'); // immediately, 2-weeks, 1-month
            }

            if (!Schema::hasColumn('candidate_profiles', 'job_search_status')) {
                $table->enum('job_search_status', ['active', 'passive', 'not_looking'])->default('active')->after('availability');
            }

            // Profile metrics
            if (!Schema::hasColumn('candidate_profiles', 'views_count')) {
                $table->integer('views_count')->default(0)->after('job_search_status');
            }

            if (!Schema::hasColumn('candidate_profiles', 'profile_score')) {
                $table->integer('profile_score')->default(0)->after('views_count'); // Calculated profile completeness
            }

            // Languages
            if (!Schema::hasColumn('candidate_profiles', 'languages')) {
                $table->json('languages')->nullable()->after('profile_score'); // [{language: 'English', level: 'fluent'}]
            }

            // Certifications
            if (!Schema::hasColumn('candidate_profiles', 'certifications')) {
                $table->json('certifications')->nullable()->after('languages');
            }
        });
    }

    public function down(): void
    {
        Schema::table('candidate_profiles', function (Blueprint $table) {
            $columns = [
                'preferred_job_types',
                'preferred_categories',
                'preferred_locations',
                'expected_salary_min',
                'expected_salary_max',
                'salary_currency',
                'is_open_to_remote',
                'is_open_to_relocation',
                'availability',
                'job_search_status',
                'views_count',
                'profile_score',
                'languages',
                'certifications',
            ];

            foreach ($columns as $column) {
                if (Schema::hasColumn('candidate_profiles', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
