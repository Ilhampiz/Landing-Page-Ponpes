import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Newspaper, Edit2, Trash2, Plus, X, Calendar, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import PageHeader from '../../components/admin/PageHeader';
import { useImageUpload } from '../../hooks/useImageUpload';
import FormModal from '../../components/admin/FormModal';
import LoadingState from '../../components/admin/LoadingState';
import EmptyState from '../../components/admin/EmptyState';

export default function News() {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Modal & Form state
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        published_at: '',
        thumbnail: '',
    });

    // Search, Filter & Pagination states
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [submitting, setSubmitting] = useState(false);
    const { uploadImage, uploading: uploadingImage } = useImageUpload();

    const getImageUrl = (path) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        return `http://pesantren-api.test${path}`;
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        const path = await uploadImage(file);
        if (path) {
            setFormData(prev => ({
                ...prev,
                thumbnail: path
            }));
        }
    };

    const fetchNews = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/news');
            setNews(Array.isArray(res.data) ? res.data : (res.data?.data || []));
        } catch (err) {
            console.error('Error fetching news:', err);
            setError('Gagal memuat daftar berita.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    const handleOpenCreate = () => {
        setEditingItem(null);
        setFormData({
            title: '',
            content: '',
            published_at: new Date().toISOString().split('T')[0],
            thumbnail: '',
        });
        setIsFormOpen(true);
    };

    const handleOpenEdit = (item) => {
        setEditingItem(item);
        setFormData({
            title: item.title || '',
            content: item.content || '',
            published_at: item.published_at ? item.published_at.substring(0, 10) : '',
            thumbnail: item.thumbnail || '',
        });
        setIsFormOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus berita ini?')) return;
        try {
            await api.delete(`/admin/news/${id}`);
            setSuccess('Berita berhasil dihapus.');
            fetchNews();
        } catch (err) {
            console.error('Delete error:', err);
            setError('Gagal menghapus berita.');
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        setSuccess('');
        try {
            if (editingItem) {
                await api.put(`/admin/news/${editingItem.id}`, formData);
                setSuccess('Berita berhasil diperbarui.');
            } else {
                await api.post('/admin/news', formData);
                setSuccess('Berita baru berhasil ditambahkan.');
            }
            setIsFormOpen(false);
            fetchNews();
        } catch (err) {
            console.error('Form submit error:', err);
            setError(err.response?.data?.message || 'Gagal menyimpan berita.');
        } finally {
            setSubmitting(false);
        }
    };

    // Derived state for Search & Filter
    const filteredNews = news.filter(item => {
        const matchesSearch = 
            (item.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.content || '').toLowerCase().includes(searchQuery.toLowerCase());
        
        const isPublished = item.published_at && new Date(item.published_at) <= new Date();
        const matchesStatus = 
            statusFilter === 'all' || 
            (statusFilter === 'published' && isPublished) || 
            (statusFilter === 'draft' && !isPublished);
        
        return matchesSearch && matchesStatus;
    });

    const totalFiltered = filteredNews.length;
    const totalPages = Math.ceil(totalFiltered / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedNews = filteredNews.slice(startIndex, endIndex);

    return (
        <>
            <PageHeader title="Kelola Berita">
                <button
                    onClick={handleOpenCreate}
                    className="bg-emerald-700 hover:bg-emerald-600 text-white font-semibold px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 shadow transition cursor-pointer"
                >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Berita</span>
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
                        <LoadingState message="Memuat daftar berita..." />
                    ) : news.length === 0 ? (
                        <EmptyState 
                            title="Belum ada berita" 
                            message="Silakan buat berita baru dengan tombol di kanan atas." 
                            icon={Newspaper} 
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
                                        placeholder="Cari judul berita / isi..."
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
                                        <option value="published">Diterbitkan</option>
                                        <option value="draft">Draft</option>
                                    </select>
                                </div>
                            </div>

                            {/* Table & Pagination Container */}
                            {filteredNews.length === 0 ? (
                                <EmptyState 
                                    title="Berita tidak ditemukan" 
                                    message="Coba ganti filter status atau kata kunci pencarian Anda." 
                                    icon={Newspaper} 
                                />
                            ) : (
                                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-slate-50/50 text-[9px] sm:text-[10px] font-bold text-slate-450 uppercase tracking-wider border-b border-slate-100">
                                                    <th className="px-6 py-4 font-semibold">Foto</th>
                                                    <th className="px-6 py-4 font-semibold">Judul Berita</th>
                                                    <th className="px-6 py-4 font-semibold">Status</th>
                                                    <th className="px-6 py-4 font-semibold">Tanggal Rilis</th>
                                                    <th className="px-6 py-4 font-semibold text-right">Aksi</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                                                {paginatedNews.map((item) => {
                                                    const isPublished = item.published_at && new Date(item.published_at) <= new Date();
                                                    return (
                                                        <tr key={item.id} className="hover:bg-slate-50/40 transition-colors">
                                                            <td className="px-6 py-3.5">
                                                                {item.thumbnail ? (
                                                                    <img 
                                                                        src={getImageUrl(item.thumbnail)} 
                                                                        alt="Thumbnail" 
                                                                        className="w-12 h-12 object-cover rounded-xl border border-slate-100 bg-slate-50 shadow-xs"
                                                                        onError={(e) => {
                                                                            e.target.onerror = null;
                                                                            e.target.src = 'https://placehold.co/100x100/065f46/ffffff?text=Berita';
                                                                        }}
                                                                    />
                                                                ) : (
                                                                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 text-[10px] border border-slate-250 shadow-xs">
                                                                        N/A
                                                                    </div>
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-3.5 font-bold text-slate-900 text-xs sm:text-sm max-w-[180px] sm:max-w-xs md:max-w-md truncate" title={item.title}>{item.title}</td>
                                                            <td className="px-6 py-3.5">
                                                                <span className={`border text-[8px] sm:text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                                                    isPublished 
                                                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50' 
                                                                        : 'bg-amber-50 text-amber-700 border-amber-200/50'
                                                                }`}>
                                                                    {isPublished ? 'Diterbitkan' : 'Draft'}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-3.5 text-slate-500">
                                                                <span className="inline-flex items-center space-x-1 bg-slate-100 text-slate-600 px-2 py-1 rounded-lg font-medium text-[9px] sm:text-[10px]">
                                                                    <Calendar className="w-3 h-3 text-slate-450" />
                                                                    <span>{item.published_at ? item.published_at.substring(0, 10) : '-'}</span>
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-3.5 text-right">
                                                                <div className="inline-flex items-center space-x-2.5">
                                                                    <button
                                                                        onClick={() => handleOpenEdit(item)}
                                                                        className="p-2 text-emerald-700 bg-emerald-50 hover:bg-emerald-100/70 border border-emerald-150 rounded-xl transition cursor-pointer"
                                                                        title="Edit Berita"
                                                                    >
                                                                        <Edit2 className="w-3.5 h-3.5" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDelete(item.id)}
                                                                        className="p-2 text-rose-600 bg-rose-50 hover:bg-rose-100/70 border border-rose-150 rounded-xl transition cursor-pointer"
                                                                        title="Hapus Berita"
                                                                    >
                                                                        <Trash2 className="w-3.5 h-3.5" />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination Controls */}
                                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 border-t border-slate-100 text-[11px] text-slate-500">
                                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                                            <span>
                                                Menampilkan <strong>{totalFiltered > 0 ? startIndex + 1 : 0}</strong>–<strong>{Math.min(endIndex, totalFiltered)}</strong> dari <strong>{totalFiltered}</strong> berita
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
                title={editingItem ? 'Edit Berita' : 'Tambah Berita Baru'}
            >
                <form onSubmit={handleFormSubmit} className="space-y-5">
                    <div className="flex flex-col space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">Judul Berita</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 bg-slate-50/50 hover:bg-slate-50 focus:bg-white transition-all placeholder-slate-400"
                            placeholder="Masukkan judul berita"
                        />
                    </div>

                    <div className="flex flex-col space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">Foto Thumbnail / Sampul Berita</label>
                        <div className="flex items-center gap-4">
                            {formData.thumbnail && (
                                <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-150 shrink-0 bg-slate-50">
                                    <img 
                                        src={getImageUrl(formData.thumbnail)} 
                                        alt="Preview" 
                                        className="w-full h-full object-cover" 
                                    />
                                </div>
                            )}
                            <div className="flex-grow">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    id="news-image-upload"
                                />
                                <label
                                    htmlFor="news-image-upload"
                                    className="inline-flex items-center justify-center px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-705 font-bold rounded-xl text-xs cursor-pointer border border-slate-200 hover:border-slate-350 transition-all shadow-xs"
                                >
                                    {uploadingImage ? 'Mengunggah...' : 'Pilih & Upload Foto'}
                                </label>
                                <p className="text-[10px] text-slate-400 mt-1">Format: JPG, PNG, WEBP (Maksimal 5MB)</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">Tanggal Publikasi</label>
                        <input
                            type="date"
                            required
                            value={formData.published_at}
                            onChange={(e) => setFormData({ ...formData, published_at: e.target.value })}
                            className="border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 bg-slate-50/50 hover:bg-slate-50 focus:bg-white transition-all"
                        />
                    </div>

                    <div className="flex flex-col space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">Konten / Isi Berita</label>
                        <textarea
                            required
                            rows="6"
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            className="border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 bg-slate-50/50 hover:bg-slate-50 focus:bg-white transition-all resize-none placeholder-slate-400 leading-relaxed"
                            placeholder="Tuliskan isi artikel lengkap di sini..."
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
                            disabled={submitting || uploadingImage}
                            className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 disabled:bg-emerald-950/60 text-white text-xs font-bold shadow-sm transition cursor-pointer"
                        >
                            {submitting ? 'Menyimpan...' : 'Simpan Berita'}
                        </button>
                    </div>
                </form>
            </FormModal>
            </>
    );
}
