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
        if (Schema::hasTable('ppdb_registrations') && !Schema::hasColumn('ppdb_registrations', 'program_pilihan')) {
            Schema::table('ppdb_registrations', function (Blueprint $table) {
                $table->string('program_pilihan')->nullable()->after('jenjang');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('ppdb_registrations') && Schema::hasColumn('ppdb_registrations', 'program_pilihan')) {
            Schema::table('ppdb_registrations', function (Blueprint $table) {
                $table->dropColumn('program_pilihan');
            });
        }
    }
};
