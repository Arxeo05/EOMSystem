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
            $table->dateTime('start-date');
            $table->dateTime('end-date');
            $table->string('place');
            $table->unsignedBigInteger('leader_id');
            $table->foreign('leader_id')->references('id')->on('users')->onDelete('cascade');
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
