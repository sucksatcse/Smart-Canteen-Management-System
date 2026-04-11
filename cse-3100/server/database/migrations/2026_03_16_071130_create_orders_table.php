<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOrdersTable extends Migration
{
    public function up()
    {
        Schema::create('Orders', function (Blueprint $table) {
            $table->bigIncrements('OrderID');
            $table->unsignedBigInteger('CustomerID');
            $table->unsignedBigInteger('CanteenID')->default(1);
            $table->unsignedBigInteger('AssignedStaffID')->nullable();
            $table->decimal('TotalAmount', 10, 2)->default(0.00);
            $table->enum('Status', ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'delivered', 'cancelled'])->default('pending');
            $table->string('TableNumber')->nullable();
            $table->text('SpecialNotes')->nullable();
            $table->timestamp('CreatedAt')->nullable();
            $table->timestamp('UpdatedAt')->nullable();

            $table->foreign('CustomerID')->references('UserID')->on('Users')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('Orders');
    }
}
