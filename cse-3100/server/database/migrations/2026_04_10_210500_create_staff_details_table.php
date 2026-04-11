<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateStaffDetailsTable extends Migration
{
    public function up()
    {
        Schema::create('StaffDetails', function (Blueprint $table) {
            // StaffID equals the UserID of the staff member (not auto-increment)
            $table->unsignedBigInteger('StaffID')->primary();
            $table->unsignedBigInteger('CanteenID')->default(1);
            $table->decimal('HourlyRate', 10, 2)->default(0);
            $table->decimal('WorkingHours', 10, 2)->default(0);
            $table->date('HireDate')->nullable();

            $table->foreign('StaffID')
                  ->references('UserID')
                  ->on('Users')
                  ->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('StaffDetails');
    }
}
