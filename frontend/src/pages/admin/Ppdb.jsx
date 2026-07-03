import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Sidebar from '../../components/Sidebar';
import { Users, Eye, X, Phone, Mail, MapPin } from 'lucide-react';

export default function Ppdb() {
    const [pendaftar, setPendaftar] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Detail modal state
    const [selectedCandidate, setSelectedCandidate] = useState(null);

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
                return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'diverifikasi':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'diterima':
                return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'ditolak':
                return 'bg-rose-100 text-rose-800 border-rose-200';
            default:
                return 'bg-slate-100 text-slate-800 border-slate-200';
        }
    };

    return (
        <div className="min-h-screen flex bg-slate-50 font-sans">
            {/* Sidebar fixed di kiri */}
            <Sidebar />

            {/* Konten di kanan (margin-left: 220px untuk mengimbangi sidebar fixed) */}
            <div className="flex-grow ml-[220px] flex flex-col min-w-0">
                <header className="bg-white border-b border-slate-200 py-4 px-8 flex justify-between items-center h-16 shrink-0 shadow-xs">
                    <h1 className="text-lg font-bold text-slate-800 font-serif">Pendaftar PPDB</h1>
                </header>

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
                        <div className="text-center py-12">
                            <div className="inline-block w-8 h-8 border-4 border-emerald-700 border-t-transparent rounded-full animate-spin" />
                            <p className="text-slate-500 text-xs mt-2">Memuat data pendaftar...</p>
                        </div>
                    ) : pendaftar.length === 0 ? (
                        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500">
                            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                            <p className="font-semibold text-slate-600">Belum ada pendaftar</p>
                            <p className="text-xs">Data pendaftar baru dari formulir online akan muncul di sini.</p>
                        </div>
                    ) : (
                        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 text-slate-600 text-xs font-semibold uppercase border-b border-slate-200">
                                            <th className="px-6 py-4">Nama Calon Santri</th>
                                            <th className="px-6 py-4">Nama Orang Tua</th>
                                            <th className="px-6 py-4">Jenjang</th>
                                            <th className="px-6 py-4">No HP</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4">Ubah Status</th>
                                            <th className="px-6 py-4 text-right">Detail</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                                        {pendaftar.map((item) => (
                                            <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4 font-semibold text-slate-900">{item.nama_calon_santri}</td>
                                                <td className="px-6 py-4 text-slate-500">{item.nama_orang_tua}</td>
                                                <td className="px-6 py-4">
                                                    <span className="bg-slate-100 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                                                        {item.jenjang}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-slate-500 font-mono">{item.no_hp}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`border text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${getStatusBadge(item.status)}`}>
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <select
                                                        value={item.status}
                                                        onChange={(e) => handleStatusChange(item.id, e.target.value)}
                                                        className="border border-slate-300 bg-white text-xs font-semibold rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 cursor-pointer"
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
                                                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-emerald-700 transition cursor-pointer"
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
                        </div>
                    )}
                </main>
            </div>

            {/* Candidate Detail Modal */}
            {selectedCandidate && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in font-sans">
                    <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative">
                        <div className="bg-emerald-900 p-6 text-white flex justify-between items-center">
                            <h3 className="font-serif font-bold text-base">Detail Lengkap Santri</h3>
                            <button onClick={() => setSelectedCandidate(null)} className="text-white/80 hover:text-white cursor-pointer">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-6 space-y-5 max-h-[85vh] overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Nama Calon Santri</span>
                                    <p className="font-serif font-bold text-slate-800 text-sm">{selectedCandidate.nama_calon_santri}</p>
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
                                    <p className="text-slate-700 text-xs">{selectedCandidate.tempat_lahir}, {selectedCandidate.tanggal_lahir}</p>
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
                                        className="border border-slate-300 bg-white text-xs font-semibold rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 cursor-pointer"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="diverifikasi">Diverifikasi</option>
                                        <option value="diterima">Diterima</option>
                                        <option value="ditolak">Ditolak</option>
                                    </select>
                                    <button
                                        onClick={() => setSelectedCandidate(null)}
                                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-4 py-1.5 rounded-xl text-xs transition cursor-pointer"
                                    >
                                        Tutup
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
