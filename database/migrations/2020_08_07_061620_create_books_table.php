<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBooksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */


    // authors: this.state.selectedAuthorsIds,

    public function up()
    {
        Schema::create('books', function (Blueprint $table) {
            $table->id();
            $table->text('name');
            $table->text('book_description');
            $table->text('numberOfPages');
            $table->text('language');
            $table->text('cover_page');
            $table->text('pdf_file');
            $table->timestamps();
        });

        Schema::table('books', function (Blueprint $table) {
            $table->bigInteger('category_id')->unsigned();
            $table->bigInteger('publisher_id')->unsigned();


            $table->foreign('category_id')
                ->references('id')
                ->on('categories')
                ->OnDelete('cascade');

            $table->foreign('publisher_id')
                ->references('id')
                ->on('publishers')
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
        Schema::dropIfExists('books');
    }
}
