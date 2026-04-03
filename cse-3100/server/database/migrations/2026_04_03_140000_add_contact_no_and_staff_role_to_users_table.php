<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class AddContactNoAndStaffRoleToUsersTable extends Migration
{
    public function up()
    {
        if (Schema::hasTable('users')) {
            if (!Schema::hasColumn('users', 'contact_no')) {
                Schema::table('users', function (Blueprint $table) {
                    $table->string('contact_no', 20)->nullable()->after('email');
                });
            }

            if (Schema::hasColumn('users', 'role')) {
                DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('customer','staff','admin') NOT NULL DEFAULT 'customer'");
            }
        }
    }

    public function down()
    {
        if (Schema::hasTable('users')) {
            if (Schema::hasColumn('users', 'contact_no')) {
                Schema::table('users', function (Blueprint $table) {
                    $table->dropColumn('contact_no');
                });
            }

            if (Schema::hasColumn('users', 'role')) {
                DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('customer','admin') NOT NULL DEFAULT 'customer'");
            }
        }
    }
}
