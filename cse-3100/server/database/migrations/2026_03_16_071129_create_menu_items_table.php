<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMenuItemsTable extends Migration
{
    public function up()
    {
        Schema::create('Menu', function (Blueprint $table) {
            $table->bigIncrements('ItemID');
            $table->unsignedBigInteger('CanteenID')->default(1);
            $table->string('Name');
            $table->string('Category', 100)->default('general');
            $table->decimal('Price', 8, 2);
            $table->unsignedInteger('StockQuantity')->default(0);
            $table->boolean('IsAvailable')->default(true);
            $table->string('ImageURL', 500)->nullable();
            $table->timestamp('CreatedAt')->nullable();
            $table->timestamp('UpdatedAt')->nullable();
        });
    }

    public function down()
    {
        Schema::dropIfExists('Menu');
    }
}
