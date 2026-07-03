<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\News;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class NewsController extends Controller
{
    // Public
    public function index()
    {
        $news = News::whereNotNull('published_at')
            ->orderBy('published_at', 'desc')
            ->get();

        return response()->json($news);
    }

    public function show($slug)
    {
        $news = News::where('slug', $slug)->firstOrFail();
        return response()->json($news);
    }

    // Admin
    public function adminIndex()
    {
        return response()->json(News::orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'title'   => 'required|string',
            'content' => 'required',
        ]);

        $news = News::create([
            'title'        => $request->title,
            'slug'         => Str::slug($request->title) . '-' . time(),
            'content'      => $request->content,
            'thumbnail'    => $request->thumbnail,
            'author_id'    => $request->user()->id,
            'published_at' => $request->published_at,
        ]);

        return response()->json($news, 201);
    }

    public function update(Request $request, $id)
    {
        $news = News::findOrFail($id);
        $news->update($request->all());
        return response()->json($news);
    }

    public function destroy($id)
    {
        News::findOrFail($id)->delete();
        return response()->json(['message' => 'Berita dihapus.']);
    }
}