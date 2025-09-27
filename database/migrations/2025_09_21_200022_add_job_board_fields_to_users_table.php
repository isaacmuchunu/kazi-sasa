<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->enum('user_type', ['candidate', 'employer', 'admin'])->default('candidate');
            $table->string('job_title')->nullable();
            $table->integer('experience_years')->nullable();
            $table->string('location')->nullable();
            $table->string('country')->nullable();
            $table->string('city')->nullable();
            $table->string('zip_code')->nullable();
            $table->string('profile_image')->nullable();
            $table->json('social_links')->nullable();
            $table->text('bio')->nullable();
            $table->boolean('is_verified')->default(false);
            $table->timestamp('last_active_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'user_type', 'job_title', 'experience_years', 'location',
                'country', 'city', 'zip_code', 'profile_image',
                'social_links', 'bio', 'is_verified', 'last_active_at'
            ]);
        });
    }
};
