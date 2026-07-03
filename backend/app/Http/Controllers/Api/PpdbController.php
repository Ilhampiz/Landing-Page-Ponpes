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
        $request->validate([
            'nama_calon_santri' => 'required|string',
            'nama_orang_tua'    => 'required|string',
            'tempat_lahir'      => 'required|string',
            'tanggal_lahir'     => 'required|date',
            'alamat'            => 'required|string',
            'no_hp'             => 'required|string',
            'jenjang'           => 'required|in:MI/SD,MTs/SMP,MA/SMA',
        ]);

        $data = $request->all();
        $data['status'] = 'pending';

        $ppdb = PpdbRegistration::create($data);
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