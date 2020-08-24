<?php 

use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;


function uploadOne(UploadedFile $uploadedFile, $folder = null, $disk = 'public', $filename = null)
{
    $name = !is_null($filename) ? $filename : Str::random(25);
    $file = $uploadedFile->storeAs($folder, $name . '.' . $uploadedFile->getClientOriginalExtension(), $disk);
    return $file;
}

function uploadAndGetFilePath(Request $request, $folder_name, $file_name)
{
    if ($request->has($file_name) && $request->file($file_name) != null) {
        $file_path = '';
        $kfile = $request->file($file_name);
        if (!is_array($kfile))
            $kfile = [$kfile];
        foreach ($kfile as $file) {
            $name = $file_name . '_' . time() . Str::random(2);
            $folder_to_upload_into = '/uploads/' . $folder_name . '/';
            $folder_path_to_save_db = '/storage/' . $folder_to_upload_into;
            $current_file = asset($folder_path_to_save_db . $name . '.' . $file->getClientOriginalExtension());
            $file_path .= $current_file;
            if (sizeof($kfile) > 1)
                $file_path = $file_path . ';';
            uploadOne($file, $folder_to_upload_into, 'public', $name);
        }
        return $file_path;
    }
    return null;
}

