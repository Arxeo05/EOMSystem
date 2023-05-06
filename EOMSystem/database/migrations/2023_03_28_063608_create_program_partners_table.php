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
        Schema::create('program_partners', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('programId');
            $table->foreign('programId')->references('id')->on('programs')->onDelete('cascade');
            $table->string('name');
            $table->string('address');
            $table->string('contactPerson');
            $table->string('contactNumber');
            $table->string('MoaFile');
            $table->date('startPartnership');
            $table->date('endPartnership');
            $table->timestamps();
            $table->boolean('archived')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('program_partners');
    }
};
