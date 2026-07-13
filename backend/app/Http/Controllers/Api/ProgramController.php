<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Program;
use Illuminate\Http\Request;

class ProgramController extends Controller
{
    // Public
    public function index()
    {
        return response()->json(Program::orderBy('order')->get());
    }

    // Admin
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'               => 'required|string|max:255',
            'description'         => 'required|string',
            'focus_and_excellence'=> 'nullable|string',
            'icon_or_image'       => 'nullable|string|max:2048',
            'order'               => 'nullable|integer|min:0',
        ]);

        $program = Program::create($validated);
        return response()->json($program, 201);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'title'               => 'sometimes|required|string|max:255',
            'description'         => 'sometimes|required|string',
            'focus_and_excellence'=> 'nullable|string',
            'icon_or_image'       => 'nullable|string|max:2048',
            'order'               => 'nullable|integer|min:0',
        ]);

        $program = Program::findOrFail($id);
        $program->update($validated);
        return response()->json($program);
    }

    public function destroy($id)
    {
        Program::findOrFail($id)->delete();
        return response()->json(['message' => 'Program dihapus.']);
    }
}