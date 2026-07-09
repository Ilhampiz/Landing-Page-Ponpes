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
            'title'      => 'required|string|max:255',
            'image_path' => 'required|string|max:2048',
        ]);

        $gallery = Gallery::create($request->only(['title', 'image_path', 'category']));
        return response()->json($gallery, 201);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'title'      => 'sometimes|required|string|max:255',
            'image_path' => 'sometimes|required|string|max:2048',
        ]);

        $gallery = Gallery::findOrFail($id);
        $gallery->update($validated);
        return response()->json($gallery);
    }

    public function destroy($id)
    {
        Gallery::findOrFail($id)->delete();
        return response()->json(['message' => 'Foto dihapus.']);
    }

    public function upload(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,webp|max:5120', // SVG dihapus — rentan SVG XSS
        ]);

        if ($request->file('image')) {
            $file = $request->file('image');
            $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            
            $targetDir = public_path('uploads');
            if (!file_exists($targetDir)) {
                mkdir($targetDir, 0755, true);
            }

            $file->move($targetDir, $filename);
            
            return response()->json([
                'url' => asset('uploads/' . $filename),
                'path' => '/uploads/' . $filename
            ]);
        }

        return response()->json(['message' => 'Upload gagal.'], 400);
    }
}