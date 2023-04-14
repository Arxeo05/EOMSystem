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
        Schema::create('member_programs', function (Blueprint $table) {
            $table->unsignedBigInteger('programId');
            $table->foreign('programId')->references('id')->on('programs')->onDelete('cascade');
            $table->unsignedBigInteger('memberId');
            $table->foreign('memberId')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('member_programs');
    }
};
