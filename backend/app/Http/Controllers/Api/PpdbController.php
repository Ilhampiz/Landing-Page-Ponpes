<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PpdbRegistration;
use Illuminate\Http\Request;

class PpdbController extends Controller
{
    // Public - submit formulir
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_calon_santri' => 'required|string|max:255',
            'nama_orang_tua'    => 'required|string|max:255',
            'tempat_lahir'      => 'required|string|max:100',
            'tanggal_lahir'     => 'required|date',
            'alamat'            => 'required|string|max:1000',
            'no_hp'             => 'required|string|max:20|regex:/^[0-9+\-\s]+$/',
            'email'             => 'nullable|email|max:100',
            'jenjang'           => 'required|in:MI/SD,MTs/SMP,MA/SMA',
        ]);

        $validated['status'] = 'pending'; // Status hanya boleh diset oleh sistem, bukan user

        $ppdb = PpdbRegistration::create($validated);
        return response()->json($ppdb, 201);
    }

    // Admin
    public function index()
    {
        return response()->json(PpdbRegistration::orderBy('created_at', 'desc')->get());
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,diverifikasi,diterima,ditolak',
        ]);

        $ppdb = PpdbRegistration::findOrFail($id);
        $ppdb->update(['status' => $request->status]);
        return response()->json($ppdb);
    }
}