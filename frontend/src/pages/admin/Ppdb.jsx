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

export default function Ppdb() {
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
            console.error('Error fetching PPDB candidates:', err);
            setError('Gagal memuat daftar pendaftar PPDB.');
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

        const headers = ["ID", "Nama Calon Santri", "Nama Orang Tua", "Jenjang", "Tempat Lahir", "Tanggal Lahir", "Alamat", "No HP", "Email", "Status", "Tanggal Daftar"];
        const rows = dataToExport.map((r) => [
            String(r.id),
            String(r.nama_calon_santri),
            String(r.nama_orang_tua),
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
        link.setAttribute("download", `ppdb-registrations-${new Date().toISOString().slice(0, 10)}.csv`);
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
            <PageHeader title="Pendaftar PPDB">
                <button
                    onClick={exportToCsv}
                    disabled={loading || filteredPendaftar.length === 0}
                    className="flex items-center space-x-2 bg-emerald-700 hover:bg-emerald-600 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold py-2 sm:py-2.5 px-3 sm:px-4.5 rounded-xl shadow-xs transition cursor-pointer text-xs select-none border-none shrink-0"
                >
                    <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                    <span>Unduh CSV</span>
                </button>
            </PageHeader>

            <main className="flex-grow p-6 md:p-8 overflow-y-auto max-w-7xl w-full space-y-6">
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
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-slate-50/50 text-[9px] sm:text-[10px] font-bold text-slate-450 uppercase tracking-wider border-b border-slate-100">
                                                    <th className="px-6 py-4 font-semibold">Nama Calon Santri</th>
                                                    <th className="px-6 py-4 font-semibold">Nama Orang Tua</th>
                                                    <th className="px-6 py-4 font-semibold">Jenjang</th>
                                                    <th className="px-6 py-4 font-semibold">No HP</th>
                                                    <th className="px-6 py-4 font-semibold">Status</th>
                                                    <th className="px-6 py-4 font-semibold">Ubah Status</th>
                                                    <th className="px-6 py-4 font-semibold text-right">Detail</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                                                {paginatedPendaftar.map((item) => (
                                                    <tr key={item.id} className="hover:bg-slate-50/40 transition-colors">
                                                        <td className="px-6 py-4 font-bold text-slate-900 text-xs sm:text-sm max-w-[150px] sm:max-w-xs md:max-w-md truncate" title={item.nama_calon_santri}>{item.nama_calon_santri}</td>
                                                        <td className="px-6 py-4 text-slate-500 font-medium text-[11px] sm:text-xs">{item.nama_orang_tua}</td>
                                                        <td className="px-6 py-4">
                                                            <span className="bg-slate-100 text-slate-700 text-[9px] sm:text-[10px] font-bold px-2.5 py-1 rounded-lg">
                                                                {item.jenjang}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-slate-500 font-mono text-[10px] sm:text-[11px]">{item.no_hp}</td>
                                                        <td className="px-6 py-4">
                                                            <span className={`border text-[8px] sm:text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${getStatusBadge(item.status)}`}>
                                                                {item.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <select
                                                                value={item.status}
                                                                onChange={(e) => handleStatusChange(item.id, e.target.value)}
                                                                className="border border-slate-200 bg-slate-50 hover:bg-slate-100 text-[11px] sm:text-xs font-bold rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 cursor-pointer transition-colors shadow-xs"
                                                            >
                                                                <option value="pending">Pending</option>
                                                                <option value="diverifikasi">Diverifikasi</option>
                                                                <option value="diterima">Diterima</option>
                                                                <option value="ditolak">Ditolak</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <button
                                                                onClick={() => setSelectedCandidate(item)}
                                                                className="p-2 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-150 rounded-xl transition cursor-pointer shadow-xs"
                                                                title="Detail Lengkap"
                                                            >
                                                                <Eye className="w-3.5 h-3.5" />
                                                            </button>
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
                                        <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Jenjang Pilihan</span>
                                        <p className="text-xs font-bold text-emerald-700">{selectedCandidate.jenjang}</p>
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
                                        <p className="text-slate-700 text-xs flex items-center space-x-1">
                                            <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                                            <span>{selectedCandidate.no_hp}</span>
                                        </p>
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
