import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { GraduationCap, Edit2, Trash2, Plus, X, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import PageHeader from '../../components/admin/PageHeader';
import LoadingState from '../../components/admin/LoadingState';
import EmptyState from '../../components/admin/EmptyState';
import FormModal from '../../components/admin/FormModal';
import { useImageUpload } from '../../hooks/useImageUpload';

export default function Programs() {
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Modal & Form state
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    // Search & Pagination states
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        focus_and_excellence: '',
        icon_or_image: '',
        order: 0,
    });
    const [submitting, setSubmitting] = useState(false);
    const { uploadImage, uploading: uploadingImage } = useImageUpload();

    const getImageUrl = (path) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        const baseURL = api.defaults.baseURL || 'http://localhost:8000/api';
        const baseDomain = baseURL.replace(/\/api$/, '');
        return `${baseDomain}${path}`;
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const path = await uploadImage(file);
        if (path) {
            setFormData(prev => ({ ...prev, icon_or_image: path }));
        }
    };

    const fetchPrograms = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/programs');
            setPrograms(Array.isArray(res.data) ? res.data : (res.data?.data || []));
        } catch (err) {
            console.error('Error fetching programs:', err);
            setError('Gagal memuat daftar program.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPrograms();
    }, []);

    const handleOpenCreate = () => {
        setEditingItem(null);
        setFormData({
            title: '',
            description: '',
            focus_and_excellence: '',
            icon_or_image: '',
            order: programs.length,
        });
        setIsFormOpen(true);
    };

    const handleOpenEdit = (item) => {
        setEditingItem(item);
        setFormData({
            title: item.title || '',
            description: item.description || '',
            focus_and_excellence: item.focus_and_excellence || '',
            icon_or_image: item.icon_or_image || '',
            order: item.order || 0,
        });
        setIsFormOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus program ini?')) return;
        try {
            await api.delete(`/admin/programs/${id}`);
            setSuccess('Program berhasil dihapus.');
            fetchPrograms();
        } catch (err) {
            console.error('Delete error:', err);
            setError('Gagal menghapus program.');
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        setSuccess('');
        try {
            if (editingItem) {
                await api.put(`/admin/programs/${editingItem.id}`, formData);
                setSuccess('Program berhasil diperbarui.');
            } else {
                await api.post('/admin/programs', formData);
                setSuccess('Program baru berhasil ditambahkan.');
            }
            setIsFormOpen(false);
            fetchPrograms();
        } catch (err) {
            console.error('Form submit error:', err);
            setError(err.response?.data?.message || 'Gagal menyimpan program.');
        } finally {
            setSubmitting(false);
        }
    };

    // Derived state for Search & Filter
    const filteredPrograms = programs.filter(item => {
        return (item.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
               (item.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    });

    const totalFiltered = filteredPrograms.length;
    const totalPages = Math.ceil(totalFiltered / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedPrograms = filteredPrograms.slice(startIndex, endIndex);

    return (
        <>
            <PageHeader title="Kelola Program Pendidikan">
                <button
                    onClick={handleOpenCreate}
                    className="bg-emerald-700 hover:bg-emerald-600 text-white font-semibold px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 shadow transition cursor-pointer"
                >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Program</span>
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
                        <LoadingState message="Memuat daftar program..." />
                    ) : programs.length === 0 ? (
                        <EmptyState 
                            title="Belum ada program pendidikan" 
                            message="Silakan buat program baru dengan tombol di kanan atas." 
                            icon={GraduationCap} 
                        />
                    ) : (
                        <div className="space-y-4">
                            {/* Search Controls */}
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
                                        placeholder="Cari program pendidikan..."
                                        className="w-full pl-9.5 pr-4 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 bg-slate-50/50 hover:bg-slate-50 focus:bg-white transition-all placeholder-slate-450"
                                    />
                                </div>
                                <div className="text-xs text-slate-450 shrink-0 font-medium">
                                    Total: {totalFiltered} program ditemukan
                                </div>
                            </div>

                            {/* Table & Pagination Container */}
                            {filteredPrograms.length === 0 ? (
                                <EmptyState 
                                    title="Program tidak ditemukan" 
                                    message="Coba ganti kata kunci pencarian Anda." 
                                    icon={GraduationCap} 
                                />
                            ) : (
                                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-slate-50/50 text-[9px] sm:text-[10px] font-bold text-slate-450 uppercase tracking-wider border-b border-slate-100">
                                                    <th className="px-6 py-4 font-semibold">Urutan</th>
                                                    <th className="px-6 py-4 font-semibold">Nama Program</th>
                                                    <th className="px-6 py-4 font-semibold">Deskripsi</th>
                                                    <th className="px-6 py-4 font-semibold">Fokus & Unggulan</th>
                                                    <th className="px-6 py-4 font-semibold text-right">Aksi</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                                                {paginatedPrograms.map((item) => (
                                                    <tr key={item.id} className="hover:bg-slate-50/40 transition-colors">
                                                        <td className="px-6 py-4 text-slate-500 font-mono">
                                                            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-semibold text-[9px] sm:text-[10px]">
                                                                {item.order}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 font-bold text-slate-900 text-xs sm:text-sm">{item.title}</td>
                                                        <td className="px-6 py-4 text-[11px] sm:text-xs text-slate-500 max-w-[140px] sm:max-w-xs truncate leading-relaxed" title={item.description}>{item.description}</td>
                                                        <td className="px-6 py-4 text-[11px] sm:text-xs text-emerald-700 max-w-[140px] sm:max-w-xs truncate font-medium" title={item.focus_and_excellence}>{item.focus_and_excellence || '-'}</td>
                                                        <td className="px-6 py-4 text-right">
                                                            <div className="inline-flex items-center space-x-2.5">
                                                                <button
                                                                    onClick={() => handleOpenEdit(item)}
                                                                    className="p-2 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-150 rounded-xl transition cursor-pointer"
                                                                    title="Edit Program"
                                                                >
                                                                    <Edit2 className="w-3.5 h-3.5" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(item.id)}
                                                                    className="p-2 text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-150 rounded-xl transition cursor-pointer"
                                                                    title="Hapus Program"
                                                                >
                                                                    <Trash2 className="w-3.5 h-3.5" />
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
                                                Menampilkan <strong>{totalFiltered > 0 ? startIndex + 1 : 0}</strong>–<strong>{Math.min(endIndex, totalFiltered)}</strong> dari <strong>{totalFiltered}</strong> program
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

                {/* Create/Edit Modal Form */}
                <FormModal
                    isOpen={isFormOpen}
                    onClose={() => setIsFormOpen(false)}
                    title={editingItem ? 'Edit Program' : 'Tambah Program Baru'}
                >
                    <form onSubmit={handleFormSubmit} className="space-y-5">
                                <div className="flex flex-col space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700">Nama Program</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 bg-slate-50/50 hover:bg-slate-50 focus:bg-white transition-all placeholder-slate-400"
                                        placeholder="Contoh: Program Tahfidzul Qur'an"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex flex-col space-y-1.5">
                                        <label className="text-xs font-bold text-slate-700">Ikon / Gambar Program (Opsional)</label>
                                        <div className="flex items-center gap-4 mt-2">
                                            {formData.icon_or_image && (
                                                <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-150 shrink-0 bg-slate-50 relative group">
                                                    <img 
                                                        src={getImageUrl(formData.icon_or_image)} 
                                                        alt="Preview" 
                                                        className="w-full h-full object-cover" 
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormData(prev => ({ ...prev, icon_or_image: '' }))}
                                                        className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                        title="Hapus gambar"
                                                    >
                                                        <div className="p-1.5 bg-rose-500 rounded-full text-white">
                                                            <Trash2 size={12} />
                                                        </div>
                                                    </button>
                                                </div>
                                            )}
                                            <div className="flex-grow">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    className="hidden"
                                                    id="program-image-upload"
                                                />
                                                <label
                                                    htmlFor="program-image-upload"
                                                    className="inline-flex items-center justify-center px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-705 font-bold rounded-xl text-xs cursor-pointer border border-slate-200 hover:border-slate-350 transition-all shadow-xs"
                                                >
                                                    {uploadingImage ? 'Mengunggah...' : 'Pilih & Upload Gambar'}
                                                </label>
                                                <p className="text-[10px] text-slate-400 mt-1">Bisa dikosongkan. Jika kosong, ikon default akan digunakan.</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <label className="text-xs font-bold text-slate-700">Urutan Tampilan</label>
                                        <input
                                            type="number"
                                            required
                                            value={formData.order}
                                            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                                            className="border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 bg-slate-50/50 hover:bg-slate-50 focus:bg-white transition-all placeholder-slate-400"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700">Deskripsi Program</label>
                                    <textarea
                                        required
                                        rows="4"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 bg-slate-50/50 hover:bg-slate-50 focus:bg-white transition-all resize-none placeholder-slate-400 leading-relaxed"
                                        placeholder="Tuliskan penjelasan lengkap mengenai program pendidikan ini..."
                                    />
                                </div>

                                <div className="flex flex-col space-y-1.5">
                                    <div className="flex justify-between items-center">
                                        <label className="text-xs font-bold text-slate-700">Fokus & Unggulan Pembelajaran</label>
                                        <span className="text-[10px] text-slate-450 font-medium">Gunakan bullet (•) untuk poin-poin</span>
                                    </div>
                                    <textarea
                                        rows="4"
                                        value={formData.focus_and_excellence}
                                        onChange={(e) => setFormData({ ...formData, focus_and_excellence: e.target.value })}
                                        className="border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 bg-slate-50/50 hover:bg-slate-50 focus:bg-white transition-all resize-none placeholder-slate-400 leading-relaxed font-sans"
                                        placeholder="• Target hafalan mutqin 30 Juz bersanad&#10;• Kajian kitab kuning & metodologi salaf&#10;• Bilingual environment (Arabic & English)"
                                    />
                                </div>

                                <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                                    <button
                                        type="button"
                                        onClick={() => setIsFormOpen(false)}
                                        className="px-5 py-2.5 rounded-xl text-slate-500 hover:bg-slate-100 text-xs font-bold transition cursor-pointer"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 disabled:bg-emerald-950/60 text-white text-xs font-bold shadow-sm transition cursor-pointer"
                                    >
                                        {submitting ? 'Menyimpan...' : 'Simpan Program'}
                                    </button>
                                </div>
                            </form>
                        </FormModal>
            </>
    );
}
