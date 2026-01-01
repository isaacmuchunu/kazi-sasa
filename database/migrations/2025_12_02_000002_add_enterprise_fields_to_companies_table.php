<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            // Enterprise profile fields
            $table->string('industry')->nullable()->after('description');
            $table->string('company_size')->nullable()->after('industry'); // 1-10, 11-50, 51-200, 201-500, 500+
            $table->year('founded_year')->nullable()->after('company_size');
            $table->string('phone')->nullable()->after('email');
            $table->string('cover_image')->nullable()->after('logo');
            $table->text('benefits')->nullable()->after('description'); // JSON or text
            $table->text('culture')->nullable()->after('benefits');

            // Verification fields
            $table->timestamp('verified_at')->nullable()->after('is_verified');
            $table->foreignId('verified_by')->nullable()->after('verified_at')->constrained('users')->nullOnDelete();
            $table->text('rejection_reason')->nullable()->after('verified_by');
            $table->timestamp('rejected_at')->nullable()->after('rejection_reason');

            // Status and moderation
            $table->boolean('is_featured')->default(false)->after('rejected_at');
            $table->boolean('is_active')->default(true)->after('is_featured');
            $table->integer('views_count')->default(0)->after('is_active');

            // Indexes
            $table->index('industry');
            $table->index('is_verified');
            $table->index('is_featured');
            $table->index('is_active');
        });
    }

    public function down(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            $table->dropIndex(['industry']);
            $table->dropIndex(['is_verified']);
            $table->dropIndex(['is_featured']);
            $table->dropIndex(['is_active']);

            $table->dropColumn([
                'industry',
                'company_size',
                'founded_year',
                'phone',
                'cover_image',
                'benefits',
                'culture',
                'verified_at',
                'verified_by',
                'rejection_reason',
                'rejected_at',
                'is_featured',
                'is_active',
                'views_count',
            ]);
        });
    }
};
