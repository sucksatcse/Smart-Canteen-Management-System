<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePaymentsTable extends Migration
{
    public function up()
    {
        Schema::create('Payments', function (Blueprint $table) {
            $table->bigIncrements('PaymentID');
            $table->unsignedBigInteger('OrderID');
            $table->decimal('Amount', 10, 2);
            $table->string('PaymentMethod', 50)->default('cash');
            $table->enum('Status', ['pending', 'paid', 'failed', 'refunded'])->default('pending');
            $table->timestamp('PaymentTime')->nullable();

            $table->foreign('OrderID')->references('OrderID')->on('Orders')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('Payments');
    }
}
