<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('newsletter_campaigns', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('subject');
            $table->text('content');
            $table->enum('status', ['draft', 'scheduled', 'sending', 'sent', 'failed'])->default('draft');
            $table->timestamp('scheduled_at')->nullable();
            $table->timestamp('sent_at')->nullable();
            $table->integer('recipients_count')->default(0);
            $table->integer('opened_count')->default(0);
            $table->integer('clicked_count')->default(0);
            $table->integer('bounced_count')->default(0);
            $table->integer('unsubscribed_count')->default(0);
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index('status');
            $table->index('scheduled_at');
        });

        // Add newsletter campaign tracking to newsletters table
        Schema::table('newsletters', function (Blueprint $table) {
            $table->string('name')->nullable()->after('email');
            $table->string('source')->nullable()->after('is_subscribed'); // where they subscribed from
            $table->json('preferences')->nullable()->after('source'); // email preferences
            $table->string('unsubscribe_token')->nullable()->after('preferences');
            $table->timestamp('last_email_sent_at')->nullable()->after('unsubscribed_at');
            $table->integer('emails_received_count')->default(0)->after('last_email_sent_at');
        });
    }

    public function down(): void
    {
        Schema::table('newsletters', function (Blueprint $table) {
            $table->dropColumn([
                'name',
                'source',
                'preferences',
                'unsubscribe_token',
                'last_email_sent_at',
                'emails_received_count',
            ]);
        });

        Schema::dropIfExists('newsletter_campaigns');
    }
};
