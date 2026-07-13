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
        if (Schema::hasTable('programs') && !Schema::hasColumn('programs', 'focus_and_excellence')) {
            Schema::table('programs', function (Blueprint $table) {
                $table->text('focus_and_excellence')->nullable()->after('description');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('programs') && Schema::hasColumn('programs', 'focus_and_excellence')) {
            Schema::table('programs', function (Blueprint $table) {
                $table->dropColumn('focus_and_excellence');
            });
        }
    }
};
