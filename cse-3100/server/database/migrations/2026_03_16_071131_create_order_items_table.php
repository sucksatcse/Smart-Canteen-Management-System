<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOrderItemsTable extends Migration
{
    public function up()
    {
        Schema::create('OrderItems', function (Blueprint $table) {
            $table->bigIncrements('OrderItemID');
            $table->unsignedBigInteger('OrderID');
            $table->unsignedBigInteger('ItemID');
            $table->unsignedInteger('Quantity')->default(1);
            $table->decimal('UnitPrice', 8, 2);

            $table->foreign('OrderID')->references('OrderID')->on('Orders')->onDelete('cascade');
            $table->foreign('ItemID')->references('ItemID')->on('Menu')->onDelete('restrict');
        });
    }

    public function down()
    {
        Schema::dropIfExists('OrderItems');
    }
}
