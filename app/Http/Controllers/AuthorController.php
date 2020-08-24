<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
// use Intervention\Image\Facades\Image;
use App\Author;

require "UploadImage.php";

class AuthorController extends Controller
{

    public function store(Request $request)
    {
        $author = new Author();
        $author->name = $request->name;
        $author->description = $request->description;

        if ($request->profile_picture != '') {
            $author->profile_picture = uploadAndGetFilePath($request, 'AuthorsProfilePictures', 'profile_picture');
        } else {
            $author->profile_picture = 'http://localhost:8000/storage//uploads/AuthorsProfilePictures/default_male_avatar.png';
        }

        $author->save();
        return $author;
    }

    public function get()
    {
        $authors = Author::orderBy('name')->get();
        return $authors;
    }

    public function getByKey($key)
    {
        $authors = Author::where('name', 'like', '%' . $key . '%')->latest()->get();
        return $authors;
    }

    public function update(Request $request, Author $author)
    {
        $author->name = $request->name;
        $author->description = $request->description;

        if ($request->profile_picture != '') {
            $author->profile_picture = uploadAndGetFilePath($request, 'AuthorsProfilePictures', 'profile_picture');
        } 

        $author->save();
        return $author;
    }

    public function destroy(Author $author)
    {
        try {
            $author->delete();
        } catch(\Exception $exception){
            $errormsg = 'Make sure to delete all related books!' . $exception->getCode();
            return response()->json(['deleted' => $errormsg]);
        }

        return response()->json(['deleted' => 1]);
    }
}
