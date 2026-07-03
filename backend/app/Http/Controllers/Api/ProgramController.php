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
        $request->validate([
            'title'       => 'required|string',
            'description' => 'required|string',
        ]);

        $program = Program::create($request->all());
        return response()->json($program, 201);
    }

    public function update(Request $request, $id)
    {
        $program = Program::findOrFail($id);
        $program->update($request->all());
        return response()->json($program);
    }

    public function destroy($id)
    {
        Program::findOrFail($id)->delete();
        return response()->json(['message' => 'Program dihapus.']);
    }
}