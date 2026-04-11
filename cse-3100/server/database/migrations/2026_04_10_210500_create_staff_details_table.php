<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateStaffDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('StaffDetails', function (Blueprint $table) {
            $table->id('StaffID');
            $table->unsignedBigInteger('UserID');
            $table->decimal('HourlyRate', 10, 2)->default(0);
            $table->decimal('TotalWorkingHours', 10, 2)->default(0);
            $table->date('HireDate')->nullable();

            $table->foreign('UserID')
                  ->references('UserID')
                  ->on('Users')
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('StaffDetails');
    }
}
