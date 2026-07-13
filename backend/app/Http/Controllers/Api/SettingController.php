<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    // Public
    public function index()
    {
        $settings = SiteSetting::all()->pluck('value', 'key');
        return response()->json($settings);
    }

    // Admin
    public function update(Request $request)
    {
        $validated = $request->validate([
            'nama_pesantren' => 'nullable|string|max:255',
            'tagline' => 'nullable|string|max:255',
            'deskripsi_singkat' => 'nullable|string',
            'logo' => 'nullable|string',
            'favicon' => 'nullable|string',
            'hero_title' => 'nullable|string|max:255',
            'hero_subtitle' => 'nullable|string',
            'hero_image' => 'nullable|string',
            'cta_utama_text' => 'nullable|string|max:100',
            'cta_sekunder_text' => 'nullable|string|max:100',
            'running_text' => 'nullable|string',
            'alamat' => 'nullable|string',
            'no_telp' => 'nullable|string|max:50',
            'no_wa' => 'nullable|string|max:50',
            'email_kontak' => 'nullable|email|max:100',
            'link_facebook' => 'nullable|string|max:255',
            'link_instagram' => 'nullable|string|max:255',
            'link_youtube' => 'nullable|string|max:255',
            'copyright_text' => 'nullable|string|max:255',
            'deskripsi_footer' => 'nullable|string',
            'visi' => 'nullable|string',
            'misi' => 'nullable|string',
            'sambutan_pimpinan' => 'nullable|string',
            'sambutan_image' => 'nullable|string',
            'nama_pimpinan' => 'nullable|string|max:255',
            'jabatan_pimpinan' => 'nullable|string|max:255',
            'sejarah_singkat' => 'nullable|string',
            'stats_tahun' => 'nullable|string|max:50',
            'stats_santri' => 'nullable|string|max:50',
            'stats_alumni' => 'nullable|string|max:50',
            'stats_asatidzah' => 'nullable|string|max:50',
            'nilai_1_title' => 'nullable|string|max:100',
            'nilai_1_desc' => 'nullable|string|max:500',
            'nilai_2_title' => 'nullable|string|max:100',
            'nilai_2_desc' => 'nullable|string|max:500',
            'nilai_3_title' => 'nullable|string|max:100',
            'nilai_3_desc' => 'nullable|string|max:500',
            'timeline_json' => 'nullable|string',
        ]);

        foreach ($validated as $key => $value) {
            SiteSetting::updateOrCreate(
                ['key' => $key],
                ['value' => $value ?? '']
            );
        }

        // Keep backward compatibility keys
        if (isset($validated['link_facebook'])) {
            SiteSetting::updateOrCreate(['key' => 'link_fb'], ['value' => $validated['link_facebook'] ?? '']);
        }
        if (isset($validated['link_instagram'])) {
            SiteSetting::updateOrCreate(['key' => 'link_ig'], ['value' => $validated['link_instagram'] ?? '']);
        }

        return response()->json(['message' => 'Pengaturan berhasil disimpan.']);
    }
}