<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Check if columns don't exist before adding
            if (!Schema::hasColumn('users', 'suspension_reason')) {
                $table->text('suspension_reason')->nullable()->after('is_suspended');
            }

            if (!Schema::hasColumn('users', 'suspended_at')) {
                $table->timestamp('suspended_at')->nullable()->after('suspension_reason');
            }

            if (!Schema::hasColumn('users', 'is_super_admin')) {
                $table->boolean('is_super_admin')->default(false)->after('user_type');
            }

            if (!Schema::hasColumn('users', 'last_active_at')) {
                $table->timestamp('last_active_at')->nullable()->after('last_login_at');
            }

            if (!Schema::hasColumn('users', 'profile_views_count')) {
                $table->integer('profile_views_count')->default(0)->after('last_active_at');
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $columns = [];

            if (Schema::hasColumn('users', 'suspension_reason')) {
                $columns[] = 'suspension_reason';
            }
            if (Schema::hasColumn('users', 'suspended_at')) {
                $columns[] = 'suspended_at';
            }
            if (Schema::hasColumn('users', 'is_super_admin')) {
                $columns[] = 'is_super_admin';
            }
            if (Schema::hasColumn('users', 'last_active_at')) {
                $columns[] = 'last_active_at';
            }
            if (Schema::hasColumn('users', 'profile_views_count')) {
                $columns[] = 'profile_views_count';
            }

            if (!empty($columns)) {
                $table->dropColumn($columns);
            }
        });
    }
};
