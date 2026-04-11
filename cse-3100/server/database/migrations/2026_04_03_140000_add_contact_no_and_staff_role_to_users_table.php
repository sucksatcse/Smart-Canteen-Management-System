<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// This migration is now a no-op because the Users table already includes
// PhoneNo and Role in the base create_users_table migration.
class AddContactNoAndStaffRoleToUsersTable extends Migration
{
    public function up()
    {
        // No-op: PhoneNo and Role are already in the Users table migration
    }

    public function down()
    {
        // No-op
    }
}
