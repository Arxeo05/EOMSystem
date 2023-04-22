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
        Schema::create('program_flows', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('programId');
            $table->foreign('programId')->references('id')->on('programs')->onDelete('cascade');
            $table->string('event');
            $table->string('remarks');
            $table->time('time');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('program_flows');
    }
};
