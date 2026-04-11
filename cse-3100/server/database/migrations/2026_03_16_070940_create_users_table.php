<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    public function up()
    {
        Schema::create('Users', function (Blueprint $table) {
            $table->bigIncrements('UserID');
            $table->string('Name');
            $table->string('Email')->unique();
            $table->string('PhoneNo', 20)->nullable();
            $table->string('PasswordHash');
            $table->enum('Role', ['customer', 'staff', 'admin'])->default('customer');
            $table->string('AvatarPath')->nullable();
            $table->rememberToken();
            $table->timestamp('CreatedAt')->nullable();
            $table->timestamp('UpdatedAt')->nullable();
        });
    }

    public function down()
    {
        Schema::dropIfExists('Users');
    }
}
