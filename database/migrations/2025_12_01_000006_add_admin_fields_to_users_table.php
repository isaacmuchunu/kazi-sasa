<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('is_banned')->default(false)->after('is_verified');
            $table->text('ban_reason')->nullable()->after('is_banned');
            $table->timestamp('banned_at')->nullable()->after('ban_reason');
            $table->foreignId('banned_by')->nullable()->after('banned_at')->constrained('users')->nullOnDelete();
            $table->boolean('is_suspended')->default(false)->after('banned_by');
            $table->timestamp('suspended_until')->nullable()->after('is_suspended');
            $table->integer('failed_login_attempts')->default(0)->after('suspended_until');
            $table->timestamp('lockout_until')->nullable()->after('failed_login_attempts');
            $table->timestamp('last_login_at')->nullable()->after('lockout_until');
            $table->string('last_login_ip', 45)->nullable()->after('last_login_at');
            $table->boolean('two_factor_enabled')->default(false)->after('last_login_ip');
            $table->string('two_factor_secret')->nullable()->after('two_factor_enabled');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'is_banned',
                'ban_reason',
                'banned_at',
                'banned_by',
                'is_suspended',
                'suspended_until',
                'failed_login_attempts',
                'lockout_until',
                'last_login_at',
                'last_login_ip',
                'two_factor_enabled',
                'two_factor_secret',
            ]);
        });
    }
};
