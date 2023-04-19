<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('programs', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->dateTime('startDate');
            $table->dateTime('endDate');
            $table->string('place');
            $table->unsignedBigInteger('leaderId')->nullable();
            $table->foreign('leaderId')->references('id')->on('users')->onDelete('set null');
            $table->longText('flow');
            $table->longText('additionalDetail');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('programs');
    }
};
