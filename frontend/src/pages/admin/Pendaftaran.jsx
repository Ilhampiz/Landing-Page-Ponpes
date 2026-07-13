import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { 
    Users, 
    Eye, 
    X, 
    Phone, 
    Mail, 
    MapPin, 
    Download, 
    Search, 
    ChevronLeft, 
    ChevronRight 
} from 'lucide-react';
import PageHeader from '../../components/admin/PageHeader';
import LoadingState from '../../components/admin/LoadingState';
import EmptyState from '../../components/admin/EmptyState';

const WhatsAppIcon = ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.456h.008c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
);

const getWhatsAppLink = (noHp, namaSantri, namaOrtu, status, programPilihan) => {
    let cleanNumber = noHp.replace(/\D/g, '');
    if (cleanNumber.startsWith('08')) {
        cleanNumber = '628' + cleanNumber.slice(2);
    } else if (cleanNumber.startsWith('8')) {
        cleanNumber = '628' + cleanNumber.slice(1);
    }

    const progText = programPilihan ? ` (Program Pilihan: *${programPilihan}*)` : '';

    let pesan = '';
    if (status === 'pending') {
        pesan = `Assalamualaikum Wr. Wb. Bapak/Ibu *${namaOrtu}*,\n\nKami dari Panitia PPDB Pondok Pesantren ingin menginformasikan bahwa pendaftaran online untuk calon santri atas nama *${namaSantri}*${progText} telah kami terima dengan status *PENDING*.\n\nBerkas pendaftaran saat ini sedang diperiksa oleh panitia. Mohon ditunggu update selanjutnya. Terima kasih.\n\nWassalamualaikum Wr. Wb.`;
    } else if (status === 'diverifikasi') {
        pesan = `Assalamualaikum Wr. Wb. Bapak/Ibu *${namaOrtu}*,\n\nKami dari Panitia PPDB Pondok Pesantren menginformasikan bahwa berkas pendaftaran calon santri atas nama *${namaSantri}*${progText} telah berhasil *DIVERIFIKASI*.\n\nTahap berikutnya adalah seleksi/wawancara. Panitia akan segera menghubungi Bapak/Ibu untuk jadwal dan detail pelaksanaannya. Terima kasih.\n\nWassalamualaikum Wr. Wb.`;
    } else if (status === 'diterima') {
        pesan = `Assalamualaikum Wr. Wb. Bapak/Ibu *${namaOrtu}*,\n\nSelamat! Calon santri atas nama *${namaSantri}* dinyatakan *DITERIMA* di Pondok Pesantren${programPilihan ? ` pada program *${programPilihan}*` : ''}.\n\nUntuk informasi proses daftar ulang dan kelengkapan administrasi, silakan hubungi kami kembali melalui nomor ini atau datang ke sekretariat PPDB. Terima kasih.\n\nWassalamualaikum Wr. Wb.`;
    } else if (status === 'ditolak') {
        pesan = `Assalamualaikum Wr. Wb. Bapak/Ibu *${namaOrtu}*,\n\nKami dari Panitia PPDB Pondok Pesantren menginformasikan hasil verifikasi calon santri atas nama *${namaSantri}*${progText}. Dengan berat hati kami sampaikan bahwa pendaftaran saat ini belum dapat kami terima karena keterbatasan kuota. Terima kasih banyak atas kepercayaan Bapak/Ibu.\n\nWassalamualaikum Wr. Wb.`;
    } else {
        pesan = `Assalamualaikum Wr. Wb. Bapak/Ibu *${namaOrtu}*,\n\nKami dari Panitia PPDB Pondok Pesantren ingin menghubungi Anda terkait pendaftaran calon santri atas nama *${namaSantri}*${progText}.\n\nTerima kasih.\n\nWassalamualaikum Wr. Wb.`;
    }

    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(pesan)}`;
};

export default function Pendaftaran() {
    const [pendaftar, setPendaftar] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Detail modal state
    const [selectedCandidate, setSelectedCandidate] = useState(null);

    // Search, Filter & Pagination states
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const fetchPendaftar = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/ppdb');
            setPendaftar(Array.isArray(res.data) ? res.data : (res.data?.data || []));
        } catch (err) {
            console.error('Error fetching registration candidates:', err);
            setError('Gagal memuat daftar pendaftar.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendaftar();
    }, []);

    const handleStatusChange = async (id, newStatus) => {
        try {
            await api.put(`/admin/ppdb/${id}/status`, { status: newStatus });
            setSuccess(`Status pendaftar berhasil diperbarui menjadi "${newStatus}".`);
            
            // Update state local list
            setPendaftar(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
            
            // If the selected candidate is open in modal, update that too
            if (selectedCandidate && selectedCandidate.id === id) {
                setSelectedCandidate(prev => ({ ...prev, status: newStatus }));
            }
        } catch (err) {
            console.error('Error updating status:', err);
            setError('Gagal memperbarui status pendaftar.');
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-amber-50 text-amber-700 border-amber-200/50';
            case 'diverifikasi':
                return 'bg-blue-50 text-blue-700 border-blue-200/50';
            case 'diterima':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200/50';
            case 'ditolak':
                return 'bg-rose-50 text-rose-700 border-rose-200/50';
            default:
                return 'bg-slate-50 text-slate-700 border-slate-200/50';
        }
    };

    const exportToCsv = () => {
        const dataToExport = filteredPendaftar;
        if (dataToExport.length === 0) return;

        const headers = ["ID", "Nama Calon Santri", "Nama Orang Tua", "Program Pilihan", "Jenjang", "Tempat Lahir", "Tanggal Lahir", "Alamat", "No HP", "Email", "Status", "Tanggal Daftar"];
        const rows = dataToExport.map((r) => [
            String(r.id),
            String(r.nama_calon_santri),
            String(r.nama_orang_tua),
            String(r.program_pilihan || "-"),
            String(r.jenjang),
            String(r.tempat_lahir),
            r.tanggal_lahir ? String(r.tanggal_lahir).substring(0, 10) : "",
            String(r.alamat),
            r.no_hp ? `="${r.no_hp}"` : "",
            r.email ? String(r.email) : "",
            String(r.status),
            r.created_at ? String(r.created_at).substring(0, 10) : "",
        ]);

        const csvContent = [
            headers.join(";"),
            ...rows.map(row => 
                row.map(v => {
                    if (v.startsWith('="') && v.endsWith('"')) {
                        return v;
                    }
                    return `"${v.replace(/"/g, '""')}"`;
                }).join(";")
            ),
        ].join("\n");

        // Add UTF-8 BOM to prevent Excel character coding issues
        const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `pendaftaran-santri-baru-${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    // Derived state for Search & Filter
    const filteredPendaftar = pendaftar.filter(item => {
        const matchesSearch = 
            (item.nama_calon_santri || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.nama_orang_tua || '').toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    });

    const totalFiltered = filteredPendaftar.length;
    const totalPages = Math.ceil(totalFiltered / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedPendaftar = filteredPendaftar.slice(startIndex, endIndex);

    return (
        <>
            <PageHeader title="Pendaftar Santri Baru">
                <button
                    onClick={exportToCsv}
                    disabled={loading || filteredPendaftar.length === 0}
                    className="flex items-center space-x-2 bg-emerald-700 hover:bg-emerald-600 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold py-2 sm:py-2.5 px-3 sm:px-4.5 rounded-xl shadow-xs transition cursor-pointer text-xs select-none border-none shrink-0"
                >
                    <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                    <span>Unduh CSV</span>
                </button>
            </PageHeader>

            <main className="flex-grow p-4 sm:p-6 md:p-8 overflow-y-auto max-w-7xl w-full space-y-6">
                    {success && (
                        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs font-semibold">
                            {success}
                        </div>
                    )}
                    {error && (
                        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl text-xs font-semibold">
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <LoadingState message="Memuat data pendaftar..." />
                    ) : pendaftar.length === 0 ? (
                        <EmptyState 
                            title="Belum ada pendaftar" 
                            message="Data pendaftar baru dari formulir online akan muncul di sini." 
                            icon={Users} 
                        />
                    ) : (
                        <div className="space-y-4">
                            {/* Search & Filter Controls */}
                            <div className="flex flex-col sm:flex-row gap-3.5 justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                                <div className="relative w-full sm:max-w-xs">
                                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => {
                                            setSearchQuery(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                        placeholder="Cari nama santri / orang tua..."
                                        className="w-full pl-9.5 pr-4 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 bg-slate-50/50 hover:bg-slate-50 focus:bg-white transition-all placeholder-slate-450"
                                    />
                                </div>
                                <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
                                    <span className="text-xs font-bold text-slate-500 shrink-0">Status:</span>
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => {
                                            setStatusFilter(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                        className="border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 cursor-pointer transition-colors shadow-xs w-full sm:w-40"
                                    >
                                        <option value="all">Semua Status</option>
                                        <option value="pending">Pending</option>
                                        <option value="diverifikasi">Diverifikasi</option>
                                        <option value="diterima">Diterima</option>
                                        <option value="ditolak">Ditolak</option>
                                    </select>
                                </div>
                            </div>

                            {/* Table & Pagination Container */}
                            {filteredPendaftar.length === 0 ? (
                                <EmptyState 
                                    title="Pendaftar tidak ditemukan" 
                                    message="Coba ganti filter status atau kata kunci pencarian Anda." 
                                    icon={Users} 
                                />
                            ) : (
                                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                                    {/* Mobile Card Layout (Tampil di layar < md) */}
                                    <div className="md:hidden divide-y divide-slate-100">
                                        {paginatedPendaftar.map((item) => (
                                            <div key={item.id} className="p-4 space-y-3.5 hover:bg-slate-50/20 transition-colors">
                                                {/* Header Card */}
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="font-bold text-slate-900 text-sm">{item.nama_calon_santri}</h4>
                                                        <p className="text-[11px] text-slate-500 mt-0.5">Wali: {item.nama_orang_tua}</p>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-1 shrink-0 max-w-[170px]">
                                                        {item.program_pilihan && (
                                                            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-[9px] font-bold px-2 py-0.5 rounded-lg truncate max-w-full" title={item.program_pilihan}>
                                                                {item.program_pilihan}
                                                            </span>
                                                        )}
                                                        <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-lg">
                                                            {item.jenjang}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Detail & Kontak */}
                                                <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-100/60 text-xs text-slate-650">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">No. HP/WA:</span>
                                                        <span className="font-mono text-slate-800 font-medium">{item.no_hp}</span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Status:</span>
                                                        <span className={`border text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${getStatusBadge(item.status)}`}>
                                                            {item.status}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Actions Card */}
                                                <div className="flex items-center justify-between pt-3 border-t border-slate-100/60 gap-3">
                                                    {/* Ubah Status */}
                                                    <div className="flex items-center gap-1.5 flex-grow">
                                                        <span className="text-[10px] font-bold text-slate-400 shrink-0">Ubah:</span>
                                                        <select
                                                            value={item.status}
                                                            onChange={(e) => handleStatusChange(item.id, e.target.value)}
                                                            className="border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold rounded-xl px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 cursor-pointer transition-colors shadow-xs flex-grow"
                                                        >
                                                            <option value="pending">Pending</option>
                                                            <option value="diverifikasi">Diverifikasi</option>
                                                            <option value="diterima">Diterima</option>
                                                            <option value="ditolak">Ditolak</option>
                                                        </select>
                                                    </div>

                                                    {/* Buttons */}
                                                    <div className="flex items-center gap-1.5 shrink-0">
                                                        <a
                                                            href={getWhatsAppLink(item.no_hp, item.nama_calon_santri, item.nama_orang_tua, item.status, item.program_pilihan)}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="p-2 text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition cursor-pointer shadow-xs inline-flex items-center justify-center border-none"
                                                            title="Hubungi via WhatsApp"
                                                        >
                                                            <WhatsAppIcon className="w-3.5 h-3.5" />
                                                        </a>
                                                        <button
                                                            onClick={() => setSelectedCandidate(item)}
                                                            className="p-2 text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200/60 rounded-xl transition cursor-pointer shadow-xs inline-flex items-center justify-center"
                                                            title="Detail Lengkap"
                                                        >
                                                            <Eye className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Desktop Table View (Tampil di layar >= md) */}
                                    <div className="hidden md:block overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-slate-50/50 text-[10px] sm:text-xs font-bold text-slate-450 uppercase tracking-wider border-b border-slate-100">
                                                    <th className="px-6 py-4 font-bold">Nama Calon Santri</th>
                                                    <th className="px-6 py-4 font-bold">Nama Orang Tua</th>
                                                    <th className="px-6 py-4 font-bold">Jenjang</th>
                                                    <th className="px-6 py-4 font-bold">No HP</th>
                                                    <th className="px-6 py-4 font-bold">Status</th>
                                                    <th className="px-6 py-4 font-bold">Ubah Status</th>
                                                    <th className="px-6 py-4 font-bold text-right">Aksi</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                                                {paginatedPendaftar.map((item) => (
                                                    <tr key={item.id} className="hover:bg-slate-50/40 transition-colors">
                                                        <td className="px-6 py-4 font-bold text-slate-900 text-xs sm:text-sm max-w-[150px] sm:max-w-xs md:max-w-md truncate" title={item.nama_calon_santri}>{item.nama_calon_santri}</td>
                                                        <td className="px-6 py-4 text-slate-500 font-medium text-xs sm:text-sm">{item.nama_orang_tua}</td>
                                                        <td className="px-6 py-4">
                                                            <span className="bg-slate-100 text-slate-700 text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-lg">
                                                                {item.jenjang}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-slate-600 font-mono text-xs sm:text-sm">{item.no_hp}</td>
                                                        <td className="px-6 py-4">
                                                            <span className={`border text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${getStatusBadge(item.status)}`}>
                                                                {item.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <select
                                                                value={item.status}
                                                                onChange={(e) => handleStatusChange(item.id, e.target.value)}
                                                                className="border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs sm:text-sm font-bold rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 cursor-pointer transition-colors shadow-xs"
                                                            >
                                                                <option value="pending">Pending</option>
                                                                <option value="diverifikasi">Diverifikasi</option>
                                                                <option value="diterima">Diterima</option>
                                                                <option value="ditolak">Ditolak</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <div className="flex items-center justify-end space-x-1.5">
                                                                <a
                                                                    href={getWhatsAppLink(item.no_hp, item.nama_calon_santri, item.nama_orang_tua, item.status)}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="p-2 text-emerald-700 hover:text-white bg-emerald-50 hover:bg-emerald-600 border border-emerald-150 hover:border-emerald-600 rounded-xl transition cursor-pointer shadow-xs inline-flex items-center justify-center"
                                                                    title="Hubungi via WhatsApp"
                                                                >
                                                                    <WhatsAppIcon className="w-3.5 h-3.5" />
                                                                </a>
                                                                <button
                                                                    onClick={() => setSelectedCandidate(item)}
                                                                    className="p-2 text-slate-700 hover:text-white bg-slate-50 hover:bg-slate-650 border border-slate-200 hover:border-slate-650 rounded-xl transition cursor-pointer shadow-xs inline-flex items-center justify-center"
                                                                    title="Detail Lengkap"
                                                                >
                                                                    <Eye className="w-3.5 h-3.5" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination Controls */}
                                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 border-t border-slate-100 text-[11px] text-slate-500">
                                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                                            <span>
                                                Menampilkan <strong>{totalFiltered > 0 ? startIndex + 1 : 0}</strong>–<strong>{Math.min(endIndex, totalFiltered)}</strong> dari <strong>{totalFiltered}</strong> pendaftar
                                            </span>
                                            <div className="flex items-center gap-1.5 shrink-0">
                                                <span>Baris per halaman:</span>
                                                <select
                                                    value={pageSize}
                                                    onChange={(e) => {
                                                        setPageSize(Number(e.target.value));
                                                        setCurrentPage(1);
                                                    }}
                                                    className="border border-slate-200 bg-slate-50 hover:bg-slate-100 text-[10px] font-bold rounded-lg px-1.5 py-0.5 focus:outline-none cursor-pointer transition"
                                                >
                                                    <option value={10}>10</option>
                                                    <option value={25}>25</option>
                                                    <option value={50}>50</option>
                                                </select>
                                            </div>
                                        </div>

                                        {totalPages > 1 && (
                                            <div className="flex items-center space-x-1 self-end sm:self-auto">
                                                <button
                                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                                    disabled={currentPage === 1}
                                                    className="p-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-transparent transition cursor-pointer"
                                                    aria-label="Halaman sebelumnya"
                                                >
                                                    <ChevronLeft className="w-3.5 h-3.5" />
                                                </button>
                                                
                                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                                    <button
                                                        key={page}
                                                        onClick={() => setCurrentPage(page)}
                                                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer select-none ${
                                                            currentPage === page
                                                                ? 'bg-emerald-700 text-white font-bold shadow-xs'
                                                                : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                                                        }`}
                                                    >
                                                        {page}
                                                    </button>
                                                ))}

                                                <button
                                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                                    disabled={currentPage === totalPages}
                                                    className="p-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-transparent transition cursor-pointer"
                                                    aria-label="Halaman berikutnya"
                                                >
                                                    <ChevronRight className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </main>

                {/* Candidate Detail Modal */}
                {selectedCandidate && (
                    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in font-sans">
                        <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative border border-slate-100 flex flex-col max-h-[90vh]">
                            {/* Modal Header */}
                            <div className="px-6 py-4.5 border-b border-slate-100 flex justify-between items-center shrink-0">
                                <h2 className="text-base font-bold font-serif text-slate-900">Detail Lengkap Santri</h2>
                                <button 
                                    onClick={() => setSelectedCandidate(null)} 
                                    className="p-1.5 rounded-xl text-slate-400 hover:text-slate-650 hover:bg-slate-50 transition cursor-pointer"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            
                            {/* Modal Body */}
                            <div className="p-6 overflow-y-auto flex-grow space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Nama Calon Santri</span>
                                        <p className="font-bold text-slate-800 text-sm">{selectedCandidate.nama_calon_santri}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Program Unggulan Pilihan</span>
                                        <p className="text-xs font-bold text-emerald-700">{selectedCandidate.program_pilihan || '-'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Jenjang Pilihan</span>
                                        <p className="text-xs font-bold text-slate-800">{selectedCandidate.jenjang}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Nama Orang Tua / Wali</span>
                                        <p className="text-slate-800 text-xs font-semibold">{selectedCandidate.nama_orang_tua}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Status</span>
                                        <div>
                                            <span className={`border text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${getStatusBadge(selectedCandidate.status)}`}>
                                                {selectedCandidate.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Tempat & Tanggal Lahir</span>
                                        <p className="text-slate-700 text-xs">
                                            {selectedCandidate.tempat_lahir}, {selectedCandidate.tanggal_lahir ? String(selectedCandidate.tanggal_lahir).substring(0, 10) : ''}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                         <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Nomor HP / WhatsApp</span>
                                         <div className="flex items-center space-x-2">
                                             <p className="text-slate-700 text-xs flex items-center space-x-1">
                                                 <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                                                 <span>{selectedCandidate.no_hp}</span>
                                             </p>
                                             <a
                                                 href={getWhatsAppLink(selectedCandidate.no_hp, selectedCandidate.nama_calon_santri, selectedCandidate.nama_orang_tua, selectedCandidate.status, selectedCandidate.program_pilihan)}
                                                 target="_blank"
                                                 rel="noreferrer"
                                                 className="inline-flex items-center gap-1 text-[10px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-2 py-0.5 rounded-lg transition-colors shadow-xs"
                                                 title="Hubungi via WhatsApp"
                                             >
                                                 <WhatsAppIcon className="w-2.5 h-2.5" />
                                                 <span>Hubungi WA</span>
                                             </a>
                                         </div>
                                     </div>
                                    <div className="space-y-1">
                                        <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Alamat Email</span>
                                        <p className="text-slate-700 text-xs flex items-center space-x-1">
                                            <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                                            <span>{selectedCandidate.email || '-'}</span>
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Dokumen Pendukung</span>
                                        <p className="text-slate-700 text-xs">
                                            {selectedCandidate.dokumen_pendukung ? (
                                                <a
                                                    href={selectedCandidate.dokumen_pendukung}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-emerald-700 hover:underline font-semibold"
                                                >
                                                    Unduh / Lihat Berkas
                                                </a>
                                            ) : (
                                                <span className="text-slate-400 italic text-xs">Tidak ada dokumen</span>
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-1 border-t border-slate-100 pt-3">
                                    <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Alamat Rumah Lengkap</span>
                                    <p className="text-slate-700 text-xs leading-relaxed flex items-start space-x-1.5">
                                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                                        <span>{selectedCandidate.alamat}</span>
                                    </p>
                                </div>

                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 flex flex-col sm:flex-row justify-between items-center gap-3 mt-4">
                                    <div className="text-xs font-semibold text-slate-700">
                                        Ubah Status Pendaftaran:
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <select
                                            value={selectedCandidate.status}
                                            onChange={(e) => handleStatusChange(selectedCandidate.id, e.target.value)}
                                            className="border border-slate-250 bg-white hover:bg-slate-100 text-xs font-bold rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-700 cursor-pointer shadow-xs transition-colors"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="diverifikasi">Diverifikasi</option>
                                            <option value="diterima">Diterima</option>
                                            <option value="ditolak">Ditolak</option>
                                        </select>
                                        <button
                                            onClick={() => setSelectedCandidate(null)}
                                            className="bg-slate-150 hover:bg-slate-200 text-slate-750 font-bold px-4 py-1.5 rounded-xl text-xs transition cursor-pointer border border-slate-200/30"
                                        >
                                            Tutup
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </>
    );
}
