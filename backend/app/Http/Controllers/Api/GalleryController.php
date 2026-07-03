<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use Illuminate\Http\Request;

class GalleryController extends Controller
{
    // Public
    public function index()
    {
        return response()->json(Gallery::orderBy('created_at', 'desc')->get());
    }

    // Admin
    public function store(Request $request)
    {
        $request->validate([
            'title'      => 'required|string',
            'image_path' => 'required|string',
        ]);

        $gallery = Gallery::create($request->all());
        return response()->json($gallery, 201);
    }

    public function destroy($id)
    {
        Gallery::findOrFail($id)->delete();
        return response()->json(['message' => 'Foto dihapus.']);
    }
}