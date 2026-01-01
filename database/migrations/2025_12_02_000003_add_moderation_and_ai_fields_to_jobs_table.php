<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('jobs', function (Blueprint $table) {
            // Moderation fields
            $table->boolean('is_approved')->default(false)->after('status');
            $table->timestamp('approved_at')->nullable()->after('is_approved');
            $table->foreignId('approved_by')->nullable()->after('approved_at')->constrained('users')->nullOnDelete();
            $table->text('rejection_reason')->nullable()->after('approved_by');
            $table->timestamp('rejected_at')->nullable()->after('rejection_reason');

            // AI/ML matching fields
            $table->json('required_skills')->nullable()->after('skills_required'); // Normalized skills for AI matching
            $table->json('preferred_skills')->nullable()->after('required_skills');
            $table->string('required_education')->nullable()->after('preferred_skills');
            $table->integer('min_experience')->nullable()->after('required_education');
            $table->integer('max_experience')->nullable()->after('min_experience');
            $table->boolean('is_remote')->default(false)->after('max_experience');
            $table->string('currency', 3)->default('KES')->after('salary_period');

            // Additional fields
            $table->text('benefits')->nullable()->after('requirements');
            $table->string('application_url')->nullable()->after('apply_deadline');
            $table->string('application_email')->nullable()->after('application_url');
            $table->integer('positions_available')->default(1)->after('application_email');

            // Renamed deadline for consistency
            $table->date('application_deadline')->nullable()->after('apply_deadline');

            // Indexes
            $table->index('is_approved');
            $table->index('is_remote');
            $table->index(['is_approved', 'status']);
        });
    }

    public function down(): void
    {
        Schema::table('jobs', function (Blueprint $table) {
            $table->dropIndex(['is_approved']);
            $table->dropIndex(['is_remote']);
            $table->dropIndex(['is_approved', 'status']);

            $table->dropColumn([
                'is_approved',
                'approved_at',
                'approved_by',
                'rejection_reason',
                'rejected_at',
                'required_skills',
                'preferred_skills',
                'required_education',
                'min_experience',
                'max_experience',
                'is_remote',
                'currency',
                'benefits',
                'application_url',
                'application_email',
                'positions_available',
                'application_deadline',
            ]);
        });
    }
};
