<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAuthorBookTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('author_book', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->unsignedBigInteger('book_id');
            $table->unsignedBigInteger('author_id');

            $table->unique(['book_id', 'author_id']);

            $table->foreign('author_id')
                ->references('id')
                ->on('authors')
                ->OnDelete('cascade');

            $table->foreign('book_id')
                ->references('id')
                ->on('books')
                ->OnDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('author_book');
    }
}
