<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PpdbRegistration extends Model
{
    protected $fillable = [
        'nama_calon_santri',
        'nama_orang_tua',
        'tempat_lahir',
        'tanggal_lahir',
        'alamat',
        'no_hp',
        'email',
        'jenjang',
        'program_pilihan',
        'dokumen_pendukung',
        'status',
    ];

    protected $casts = [
        'tanggal_lahir' => 'date',
    ];
}