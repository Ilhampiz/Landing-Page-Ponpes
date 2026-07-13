<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Program;

class ProgramSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $programs = [
            [
                'title' => "Program Tahfidzul Qur'an Bersanad",
                'description' => "Program intensif hafalan Al-Qur'an 30 Juz dengan metode Talaqqi dan Muroja'ah berjenjang di bawah bimbingan langsung para ustadz/ustadzah bersanad muttasil hingga Rasulullah SAW.",
                'focus_and_excellence' => "• Target mutqin hafalan 30 Juz bersanad\n• Bimbingan tahsin & tajwid bersertifikasi standar Qira'ah Asyrah\n• Evaluasi hafalan bulanan & ujian tasmi' per 5 Juz\n• Pembinaan adab ahli Qur'an & pemahaman tafsir dasar",
                'order' => 1,
            ],
            [
                'title' => "Program Dirasah Islamiyah & Kitab Kuning",
                'description' => "Pendalaman turats Islam klasik (kitab kuning) dalam disiplin ilmu Fikih, Aqidah, Nahwu-Sharaf, Ushul Fiqh, Hadits, dan Tasawuf untuk mencetak kader ulama yang tafaqquh fi ad-din.",
                'focus_and_excellence' => "• Penguasaan ilmu alat (Nahwu & Sharaf dengan Alfiyah Ibn Malik)\n• Pembelajaran metode aktif Sorogan dan Bandongan\n• Kajian tematik Fikih Syafi'iyyah dan Aqidah Ahlussunnah wal Jama'ah\n• Forum Bahtsul Masail santri mingguan untuk melatih penalaran kritis",
                'order' => 2,
            ],
            [
                'title' => "Program Madrasah Formal Terpadu (SMP & SMA)",
                'description' => "Pendidikan formal kurikulum nasional yang diintegrasikan penuh dengan kurikulum pesantren modern, berfokus pada penguatan sains, teknologi, dan kepemimpinan.",
                'focus_and_excellence' => "• Integrasi Kurikulum Merdeka dengan kurikulum khas pesantren\n• Lingkungan dwibahasa harian (Arabic & English Bilingual Environment)\n• Pembinaan riset ilmiah, olimpiade sains, dan digital literasi\n• Program bimbingan sukses beasiswa perguruan tinggi favorit dalam & luar negeri",
                'order' => 3,
            ],
        ];

        foreach ($programs as $program) {
            Program::updateOrCreate(
                ['title' => $program['title']],
                $program
            );
        }
    }
}
