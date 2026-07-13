import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Image as ImageIcon, Trash2, Plus, X, Tag, Edit2, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import PageHeader from '../../components/admin/PageHeader';
import { useImageUpload } from '../../hooks/useImageUpload';
import FormModal from '../../components/admin/FormModal';
import LoadingState from '../../components/admin/LoadingState';
import EmptyState from '../../components/admin/EmptyState';

export default function Gallery() {
    const [gallery, setGallery] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Modal & Form state
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        image_path: '',
        category: '',
    });

    // Search, Filter & Pagination states
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(8);
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
                image_path: path
            }));
        }
    };

    const fetchGallery = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/gallery');
            setGallery(Array.isArray(res.data) ? res.data : (res.data?.data || []));
        } catch (err) {
            console.error('Error fetching gallery:', err);
            setError('Gagal memuat daftar galeri.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGallery();
    }, []);

    const handleOpenCreate = () => {
        setEditingItem(null);
        setFormData({
            title: '',
            image_path: '',
            category: '',
        });
        setIsFormOpen(true);
    };

    const handleOpenEdit = (item) => {
        setEditingItem(item);
        setFormData({
            title: item.title || '',
            image_path: item.image_path || '',
            category: item.category || '',
        });
        setIsFormOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus foto ini?')) return;
        try {
            await api.delete(`/admin/gallery/${id}`);
            setSuccess('Foto berhasil dihapus dari galeri.');
            fetchGallery();
        } catch (err) {
            console.error('Delete error:', err);
            setError('Gagal menghapus foto.');
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        setSuccess('');
        try {
            if (editingItem) {
                await api.put(`/admin/gallery/${editingItem.id}`, formData);
                setSuccess('Foto galeri berhasil diperbarui.');
            } else {
                await api.post('/admin/gallery', formData);
                setSuccess('Foto baru berhasil ditambahkan.');
            }
            setIsFormOpen(false);
            fetchGallery();
        } catch (err) {
            console.error('Form submit error:', err);
            setError(err.response?.data?.message || 'Gagal menyimpan foto.');
        } finally {
            setSubmitting(false);
        }
    };

    // Derived state for categories, search & filter
    const categories = Array.from(new Set(gallery.map(item => item.category).filter(Boolean)));

    const filteredGallery = gallery.filter(item => {
        const matchesSearch = (item.title || '').toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const totalFiltered = filteredGallery.length;
    const totalPages = Math.ceil(totalFiltered / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedGallery = filteredGallery.slice(startIndex, endIndex);

    return (
        <>
            <PageHeader title="Kelola Galeri Foto">
                <button
                    onClick={handleOpenCreate}
                    className="bg-emerald-700 hover:bg-emerald-600 text-white font-semibold px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 shadow transition cursor-pointer"
                >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Foto</span>
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
                        <LoadingState message="Memuat galeri foto..." />
                    ) : gallery.length === 0 ? (
                        <EmptyState 
                            title="Galeri masih kosong" 
                            message="Silakan tambahkan foto baru untuk ditampilkan." 
                            icon={ImageIcon} 
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
                                        placeholder="Cari foto galeri..."
                                        className="w-full pl-9.5 pr-4 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 bg-slate-50/50 hover:bg-slate-50 focus:bg-white transition-all placeholder-slate-450"
                                    />
                                </div>
                                <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
                                    <span className="text-xs font-bold text-slate-500 shrink-0">Kategori:</span>
                                    <select
                                        value={categoryFilter}
                                        onChange={(e) => {
                                            setCategoryFilter(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                        className="border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 cursor-pointer transition-colors shadow-xs w-full sm:w-40"
                                    >
                                        <option value="all">Semua Kategori</option>
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Gallery Grid & Pagination Container */}
                            {filteredGallery.length === 0 ? (
                                <EmptyState 
                                    title="Foto tidak ditemukan" 
                                    message="Coba ganti filter kategori atau kata kunci pencarian Anda." 
                                    icon={ImageIcon} 
                                />
                            ) : (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                        {paginatedGallery.map((item) => (
                                            <div key={item.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between group hover:shadow-md hover:border-slate-300 transition-all duration-300">
                                                <div className="aspect-video bg-slate-100 relative overflow-hidden flex items-center justify-center border-b border-slate-100">
                                                    {item.image_path ? (
                                                        <img
                                                            src={getImageUrl(item.image_path)}
                                                            alt={item.title}
                                                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = 'https://placehold.co/600x400?text=Gambar+Rusak';
                                                            }}
                                                        />
                                                    ) : (
                                                        <ImageIcon className="w-8 h-8 text-slate-350" />
                                                    )}
                                                    {item.category && (
                                                        <span className="absolute top-3 left-3 bg-emerald-650/90 text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg flex items-center space-x-1 shadow-sm backdrop-blur-xs">
                                                            <Tag className="w-2.5 h-2.5" />
                                                            <span>{item.category}</span>
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="p-4 flex justify-between items-center bg-white border-t border-slate-50">
                                                    <div className="min-w-0 pr-2 space-y-0.5">
                                                        <h4 className="font-bold text-slate-800 text-xs truncate" title={item.title}>{item.title}</h4>
                                                        <p className="text-[9px] text-slate-400 truncate font-mono">{item.image_path}</p>
                                                    </div>
                                                    <div className="inline-flex items-center space-x-2 shrink-0">
                                                        <button
                                                            onClick={() => handleOpenEdit(item)}
                                                            className="p-2 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-150 rounded-xl transition cursor-pointer"
                                                            title="Edit Foto"
                                                        >
                                                            <Edit2 className="w-3.5 h-3.5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(item.id)}
                                                            className="p-2 text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-150 rounded-xl transition cursor-pointer"
                                                            title="Hapus Foto"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Pagination Controls */}
                                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 border border-slate-200 rounded-2xl shadow-sm text-[11px] text-slate-500">
                                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                                            <span>
                                                Menampilkan <strong>{totalFiltered > 0 ? startIndex + 1 : 0}</strong>–<strong>{Math.min(endIndex, totalFiltered)}</strong> dari <strong>{totalFiltered}</strong> foto
                                            </span>
                                            <div className="flex items-center gap-1.5 shrink-0">
                                                <span>Foto per halaman:</span>
                                                <select
                                                    value={pageSize}
                                                    onChange={(e) => {
                                                        setPageSize(Number(e.target.value));
                                                        setCurrentPage(1);
                                                    }}
                                                    className="border border-slate-200 bg-slate-50 hover:bg-slate-100 text-[10px] font-bold rounded-lg px-1.5 py-0.5 focus:outline-none cursor-pointer transition"
                                                >
                                                    <option value={8}>8</option>
                                                    <option value={16}>16</option>
                                                    <option value={32}>32</option>
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

            {/* Upload Modal Form */}
            <FormModal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                title={editingItem ? 'Edit Foto Galeri' : 'Tambah Foto Baru'}
                maxWidthClass="max-w-lg"
            >
                <form onSubmit={handleFormSubmit} className="space-y-5">
                    <div className="flex flex-col space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">Judul Foto / Keterangan</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 bg-slate-50/50 hover:bg-slate-50 focus:bg-white transition-all placeholder-slate-400"
                            placeholder="Contoh: Gedung Madrasah Aliyah"
                        />
                    </div>

                    <div className="flex flex-col space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">File Foto Galeri</label>
                        <div className="flex items-center gap-4">
                            {formData.image_path && (
                                <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-150 shrink-0 bg-slate-50 relative group">
                                    <img 
                                        src={getImageUrl(formData.image_path)} 
                                        alt="Preview" 
                                        className="w-full h-full object-cover" 
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, image_path: '' }))}
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
                                    id="gallery-image-upload"
                                />
                                <label
                                    htmlFor="gallery-image-upload"
                                    className="inline-flex items-center justify-center px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-705 font-bold rounded-xl text-xs cursor-pointer border border-slate-200 hover:border-slate-350 transition-all shadow-xs"
                                >
                                    {uploadingImage ? 'Mengunggah...' : 'Pilih & Upload Foto'}
                                </label>
                                <p className="text-[10px] text-slate-400 mt-1">Format: JPG, PNG, WEBP (Maksimal 5MB)</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">Kategori</label>
                        <input
                            type="text"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 bg-slate-50/50 hover:bg-slate-50 focus:bg-white transition-all placeholder-slate-400"
                            placeholder="Contoh: Kegiatan, Fasilitas, Akademik (Opsional)"
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
                            {submitting ? 'Menyimpan...' : 'Simpan Foto'}
                        </button>
                    </div>
                </form>
            </FormModal>
            </>
    );
}
