<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Status Pendaftaran PPDB</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f6f9fc; font-family: 'Inter', system-ui, -apple-system, sans-serif; -webkit-font-smoothing: antialiased;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
                    <!-- Header -->
                    <tr>
                        <td align="center" style="background-color: #047857; padding: 30px 20px;">
                            <h2 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 0.5px;">Pondok Pesantren</h2>
                            <p style="color: #a7f3d0; margin: 5px 0 0 0; font-size: 14px;">Penerimaan Peserta Didik Baru (PPDB)</p>
                        </td>
                    </tr>
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <h3 style="color: #1f2937; margin-top: 0; font-size: 20px; font-weight: 600;">Halo, {{ $ppdb->nama_orang_tua }}</h3>
                            <p style="color: #4b5563; font-size: 15px; line-height: 1.6; margin-bottom: 25px;">
                                Terima kasih telah melakukan pendaftaran di Pondok Pesantren kami. Berikut adalah pembaruan status pendaftaran untuk calon santri:
                            </p>

                            <!-- Status Box -->
                            <div style="background-color: #f3f4f6; border-radius: 8px; padding: 20px; margin-bottom: 30px; border-left: 4px solid 
                                @if($ppdb->status == 'pending') #d97706 
                                @elseif($ppdb->status == 'diverifikasi') #2563eb 
                                @elseif($ppdb->status == 'diterima') #059669 
                                @else #dc2626 @endif;">
                                
                                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                    <tr>
                                        <td style="padding-bottom: 10px;">
                                            <span style="font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #6b7280;">Status Saat Ini</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <span style="font-size: 18px; font-weight: 700; display: inline-block; padding: 6px 12px; border-radius: 6px;
                                                @if($ppdb->status == 'pending') background-color: #fef3c7; color: #d97706;
                                                @elseif($ppdb->status == 'diverifikasi') background-color: #dbeafe; color: #2563eb;
                                                @elseif($ppdb->status == 'diterima') background-color: #d1fae5; color: #059669;
                                                @else background-color: #fee2e2; color: #dc2626; @endif">
                                                {{ strtoupper($ppdb->status) }}
                                            </span>
                                        </td>
                                    </tr>
                                </table>
                            </div>

                            <!-- Detail Calon Santri -->
                            <h4 style="color: #1f2937; margin-bottom: 15px; font-size: 16px; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px;">Detail Pendaftaran:</h4>
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 14px; color: #4b5563; margin-bottom: 30px;">
                                <tr>
                                    <td width="40%" style="padding: 8px 0; font-weight: 600;">Nama Calon Santri</td>
                                    <td width="60%" style="padding: 8px 0;">: {{ $ppdb->nama_calon_santri }}</td>
                                </tr>
                                @if($ppdb->program_pilihan)
                                <tr>
                                    <td style="padding: 8px 0; font-weight: 600;">Program Pilihan</td>
                                    <td style="padding: 8px 0; color: #047857; font-weight: 600;">: {{ $ppdb->program_pilihan }}</td>
                                </tr>
                                @endif
                                <tr>
                                    <td style="padding: 8px 0; font-weight: 600;">Jenjang Pendidikan</td>
                                    <td style="padding: 8px 0;">: {{ $ppdb->jenjang }}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; font-weight: 600;">No. HP Orang Tua</td>
                                    <td style="padding: 8px 0;">: {{ $ppdb->no_hp }}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; font-weight: 600;">Tanggal Daftar</td>
                                    <td style="padding: 8px 0;">: {{ $ppdb->created_at->format('d F Y H:i') }} WIB</td>
                                </tr>
                            </table>

                            <!-- Message based on status -->
                            <div style="font-size: 15px; color: #4b5563; line-height: 1.6; border-top: 1px solid #e5e7eb; padding-top: 20px;">
                                @if($ppdb->status == 'pending')
                                    <p style="margin: 0;">Pendaftaran Anda telah berhasil kami terima. Saat ini berkas pendaftaran sedang dalam antrean untuk diperiksa oleh panitia PPDB. Kami akan segera menghubungi atau mengirimkan email kembali jika status pendaftaran Anda berubah.</p>
                                @elseif($ppdb->status == 'diverifikasi')
                                    <p style="margin: 0;">Berkas pendaftaran Anda telah berhasil diverifikasi oleh panitia PPDB. Calon santri selanjutnya akan dijadwalkan untuk mengikuti seleksi/wawancara. Informasi lebih lanjut mengenai jadwal akan kami sampaikan segera.</p>
                                @elseif($ppdb->status == 'diterima')
                                    <p style="margin: 0; font-weight: 600; color: #047857;">Selamat! Calon santri dinyatakan DITERIMA di Pondok Pesantren kami @if($ppdb->program_pilihan) pada program {{ $ppdb->program_pilihan }} @endif. Silakan melakukan proses daftar ulang dan administrasi sesuai petunjuk yang dikirimkan atau hubungi panitia melalui nomor kontak resmi kami.</p>
                                @elseif($ppdb->status == 'ditolak')
                                    <p style="margin: 0;">Mohon maaf, pendaftaran calon santri belum dapat kami terima saat ini karena kuota yang terbatas atau tidak terpenuhinya kriteria seleksi berkas. Terima kasih atas minat dan kepercayaan Anda kepada Pondok Pesantren kami.</p>
                                @endif
                            </div>
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f9fafb; padding: 25px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0; font-size: 12px; color: #9ca3af; line-height: 1.5;">
                                Email ini dikirim secara otomatis oleh Sistem PPDB Pondok Pesantren.<br>
                                Harap tidak membalas email ini secara langsung.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
