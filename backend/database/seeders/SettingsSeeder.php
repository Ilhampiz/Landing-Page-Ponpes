<?php

namespace Database\Seeders;

use App\Models\SiteSetting;
use Illuminate\Database\Seeder;

class SettingsSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            'nama_pesantren' => "Al-Hikmatul Furqon",
            'tagline' => "Membentuk Generasi Rabbani yang Unggul & Berkarakter Mulia",
            'deskripsi_singkat' => "Lembaga pendidikan Islam terpadu yang berfokus pada tahfidz Al-Qur'an mutqin, kajian kitab kuning klasik, dan penguasaan sains teknologi modern.",
            'running_text' => "Pendaftaran santri dibuka",
            'hero_title' => "Pondok Pesantren Al-Hikmatul Furqon",
            'hero_subtitle' => "Membentuk generasi penghafal Al-Qur'an yang cerdas, berkarakter mulia, mandiri, berwawasan luas, dan berintegritas tinggi.",
            'link_facebook' => "https://facebook.com/pesantrenalhikmatulfurqon",
            'link_fb' => "https://facebook.com/pesantrenalhikmatulfurqon",
            'link_instagram' => "https://instagram.com/pesantrenalhikmatulfurqon",
            'link_ig' => "https://instagram.com/pesantrenalhikmatulfurqon",
            'link_youtube' => "https://youtube.com/pesantrenalhikmatulfurqon",
            'alamat' => "Jl. Kebon Agung No. 12, Sleman, Yogyakarta",
            'no_telp' => "(0274) 123456",
            'no_wa' => "+62 812-3456-7890",
            'email_kontak' => "info@alhikmatulfurqon.com",
            'deskripsi_footer' => "Membentuk generasi penghafal Al-Qur'an yang cerdas dan berakhlak mulia...",
            'copyright_text' => "© 2026 Pondok Pesantren Al-Hikmatul Furqon. All rights reserved.",
            'sejarah_singkat' => "Pondok Pesantren Al-Hikmatul Furqon didirikan pada tahun 2012 oleh Ky. Ainurrohim. Bermula dari sebuah mushola kecil dengan beberapa santri mukim, pesantren ini terus berkembang pesat menjadi salah satu lembaga pendidikan Islam terpadu yang terakreditasi unggul secara nasional.\n\nDengan memadukan kurikulum kepesantrenan salafiyah tahfidzul qur'an dan kurikulum formal modern, kami mendidik santri untuk menjadi pribadi yang kokoh secara spiritual, mandiri, dan tanggap terhadap perkembangan zaman.",
            'visi' => "Terwujudnya lembaga pendidikan Islam unggulan yang mencetak hafizh/hafizhah mutqin, berilmu amaliyah, beramal ilmiah, dan berakhlak mulia.",
            'misi' => "Menyelenggarakan program Tahfidzul Qur'an yang terstruktur, mutqin, dan berkualitas dengan bimbingan ustadz pemegang sanad.\nMembekali santri dengan pemahaman kitab kuning klasik yang mendalam serta program pendidikan formal terakreditasi unggul.\nMenanamkan nilai-nilai akhlakul karimah, keteladanan sosial, kedisiplinan, dan kemandirian dalam ekosistem asrama pesantren.",
            'sambutan_pimpinan' => "Assalamu'alaikum Warahmatullahi Wabarakatuh. Selamat datang di laman resmi Pondok Pesantren Al-Hikmatul Furqon. Kami berkomitmen untuk mendidik generasi Qurani yang berakhlak mulia, unggul dalam sains, cerdas, dan mandiri. Semoga media informasi ini bermanfaat bagi wali santri dan masyarakat luas..",
            'nama_pimpinan' => "Ky. Ainurrohim",
            'jabatan_pimpinan' => "Pengasuh Pondok Pesantren",
            'stats_santri' => "500+",
            'stats_asatidzah' => "40+",
            'stats_alumni' => "250+",
            'stats_tahun' => "10+",
            'nilai_1_title' => "Integritas (Amanah)",
            'nilai_1_desc' => "Menjunjung tinggi kejujuran, keadilan, dan keselarasan ucapan dengan perbuatan dalam setiap aspek kehidupan.",
            'nilai_2_title' => "Ukhuwah (Kebersamaan)",
            'nilai_2_desc' => "Membina persaudaraan yang erat di antara santri, asatidzah, orang tua, dan masyarakat luas dalam bingkai toleransi.",
            'nilai_3_title' => "Disiplin & Mandiri",
            'nilai_3_desc' => "Membiasakan hidup teratur, bertanggung jawab atas perbuatan pribadi, dan tangguh mengarungi tantangan harian.",
            'timeline_json' => '[{"year":"Tahun 2012","title":"Awal Mula Perjalanan","desc":"Didirikan oleh Ky. Ainurrohim, Pondok Pesantren Al-Hikmatul Furqon bermula dari sebuah mushola kecil dengan beberapa santri yang memiliki tekad kuat mendalami Al-Qur\'an secara intensif.","details":["Dimulai dengan 5 santri mukim di pondokan bambu sederhana.","Ky. Ainurrohim bertindak langsung sebagai pengajar utama tahfidz.","Fokus pembelajaran awal pada pemantapan makhraj dan tajwid hafalan."]},{"year":"Pertumbuhan & Kemitraan","title":"Membangun Kepercayaan & Kredibilitas","desc":"Dedikasi dalam memberikan pendidikan berkualitas melahirkan reputasi positif di mata wali santri. Melalui kerja sama erat pengurus dan donatur, fasilitas asrama pertama berhasil dibangun demi kenyamanan santri.","details":["Mendapatkan izin operasional resmi Madrasah Tsanawiyah (MTs).","Penerimaan wakaf tanah seluas 1 hektar untuk pembangunan asrama terpadu.","Mengembangkan program kemitraan pengajar dengan alumni Universitas Timur Tengah."]},{"year":"Kondisi Saat Ini","title":"Lembaga Pendidikan Formal & Pesantren Terpadu","desc":"Kini menaungi jenjang Madrasah Ibtidaiyah (MI), Madrasah Tsanawiyah (MTs), dan Madrasah Aliyah (MA) terakreditasi unggul. Dilengkapi kompleks asrama representatif serta laboratorium terintegrasi guna mendukung program Tahfidz dan Sains.","details":["Telah meluluskan lebih dari 250 santri penghafal Al-Qur\'an 30 juz mutqin.","Meraih predikat Akreditasi A (Unggul) secara nasional pada semua jenjang formal.","Menyediakan beasiswa studi lanjut ke universitas terkemuka di Mesir, Madinah, dan PTN."]}]'
        ];

        foreach ($settings as $key => $value) {
            SiteSetting::updateOrCreate(
                ['key' => $key],
                ['value' => $value]
            );
        }
    }
}
