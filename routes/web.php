<?php

use App\Http\Controllers\CategoryController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Auth::routes();


Route::get('/admin', 'AdminController@index')->name('admin');

Route::prefix('/api')->group(function () {

    Route::get('/category/get_all', 'CategoryController@get');
    Route::get('/category/get/{Key}', 'CategoryController@getByKey');
    Route::post('/category/store', 'CategoryController@store');
    Route::put('/category/update/{category}', 'CategoryController@update');
    Route::delete('/category/destroy/{category}', 'CategoryController@destroy');

    Route::get('/publisher/get_all', 'PublisherController@get');
    Route::get('/publisher/get/{Key}', 'PublisherController@getByKey');
    Route::post('/publisher/store', 'PublisherController@store');
    Route::put('/publisher/update/{publisher}', 'PublisherController@update');
    Route::delete('/publisher/destroy/{publisher}', 'PublisherController@destroy');

    Route::get('/authors/get', 'AuthorController@get');
    Route::get('/authors/get/{author}', 'AuthorController@getByKey');
    Route::post('/author/store', 'AuthorController@store');
    Route::post('/author/update/{author}', 'AuthorController@update');
    Route::delete('/author/destroy/{author}', 'AuthorController@destroy');

    Route::get('/books/get', 'BookController@get');
    Route::get('/books/get/{Key}', 'BookController@getByKey');
    Route::get('/books/cp/get/{Key}', 'BookController@getCPByKey');
    Route::post('/book/store', 'BookController@store');
    Route::post('/book/update/{book}', 'BookController@update');
    Route::delete('/book/destroy/{book}', 'BookController@destroy');
});
