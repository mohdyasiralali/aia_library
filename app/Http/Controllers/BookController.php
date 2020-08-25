<?php

namespace App\Http\Controllers;

use App\Book;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Mockery\Undefined;

require "UploadImage.php";

class BookController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */

    public function get()
    {
        $books_array = [];
        $books = Book::latest()->get();
        foreach ($books as $book) {

            array_push($books_array, [
                'book' => $book,
                'publisher' => $book->publisher,
                'category' => $book->category,
                'authors' => $book->authors
            ]);
        }

        return ['books' => $books_array];
    }

    public function getByCatg($catId)
    {
        $books_array = [];
        $books = Book::where('category_id', '=', $catId)->latest()->get();
        foreach ($books as $book) {

            array_push($books_array, [
                'book' => $book,
                'publisher' => $book->publisher,
                'category' => $book->category,
                'authors' => $book->authors
            ]);
        }

        return ['books' => $books_array];
    }

    public function getByKey($key)
    {
        $books = Book::leftJoin('categories', 'categories.id', '=', 'books.category_id')
            ->leftJoin('publishers', 'publishers.id', '=', 'books.publisher_id')
            ->leftJoin('author_book', 'author_book.book_id', '=', 'books.id')
            ->leftJoin('authors', 'author_book.author_id', '=', 'authors.id')
            ->select('books.*')
            ->where('books.name', 'like', '%' . $key . '%')
            ->orWhere('categories.title', 'like', '%' . $key . '%')
            ->orWhere('publishers.name', 'like', '%' . $key . '%')
            ->orWhere('authors.name', 'like', '%' . $key . '%')
            ->distinct()
            ->latest()
            ->get();

        $books_array = [];
        foreach ($books as $book) {

            array_push($books_array, [
                'book' => $book,
                'publisher' => $book->publisher,
                'category' => $book->category,
                'authors' => $book->authors
            ]);
        }

        return $books_array;
    }

    public function getCPByKey($key)
    {
        $books = Book::where('name', 'like', '%' . $key . '%')->latest()->get();

        $books_array = [];
        foreach ($books as $book) {

            array_push($books_array, [
                'book' => $book,
                'publisher' => $book->publisher,
                'category' => $book->category,
                'authors' => $book->authors
            ]);
        }

        return $books_array;
    }


    public function store(Request $request)
    {
        $book = new Book;

        $book->name = $request->name;
        $book->book_description = $request->book_description;
        $book->numberOfPages = $request->numberOfPages;
        $book->language = $request->language;
        if ($request->cover_page) {
            $book->cover_page = uploadAndGetFilePath($request, 'BooksCoverPages', 'cover_page');
        } else {
            $book->cover_page = 'http://localhost:8000/storage//uploads/BooksCoverPages/default.png';
        }
        $book->pdf_file = uploadAndGetFilePath($request, 'BooksPdfFiles', 'pdf_file');
        $book->category_id = $request->category;
        $book->publisher_id = $request->publisher;

        $book->save();
        $book->authors()->attach($request->authors);

        return [
            'book' => $book,
            'publisher' => $book->publisher,
            'category' => $book->category,
            'authors' => $book->authors
        ];
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Book  $book
     * @return \Illuminate\Http\Response
     */
    public function show(Book $book)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Book  $book
     * @return \Illuminate\Http\Response
     */
    public function edit(Book $book)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Book  $book
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Book $book)
    {
        $book->name = $request->name;
        $book->book_description = $request->book_description;
        $book->numberOfPages = $request->numberOfPages;
        $book->language = $request->language;
        $book->category_id = $request->category;
        $book->publisher_id = $request->publisher;

        if (($request->cover_page != 'undefined')) {
            $book->cover_page = uploadAndGetFilePath($request, 'BooksCoverPages', 'cover_page');
        }

        if ($request->pdf_file) {
            $book->pdf_file = uploadAndGetFilePath($request, 'BooksPdfFiles', 'pdf_file');
        }
        $book->save();

        $auths = count($request->authors);
        if ($auths > 0) {
            $prev_au = $book->authors;
            $arr = [];
            foreach ($prev_au as $au) {
                array_push($arr, strval($au->id));
            }
            $book->authors()->detach($arr);
            $book->authors()->attach($request->authors);
        }

        return [
            'book' => $book,
            'publisher' => $book->publisher,
            'category' => $book->category,
            'authors' => $book->authors
        ];
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Book  $book
     * @return \Illuminate\Http\Response
     */
    public function destroy(Book $book)
    {
        DB::table('author_book')->where('book_id', '=', $book->id)->delete();
        $book->delete();
        return response()->json(['deleted' => 1]);
    }
}
