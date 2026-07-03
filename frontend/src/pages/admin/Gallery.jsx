import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Sidebar from '../../components/Sidebar';
import { Image as ImageIcon, Trash2, Plus, X, Tag } from 'lucide-react';

export default function Gallery() {
    const [gallery, setGallery] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Modal & Form state
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        image_path: '',
        category: '',
    });
    const [submitting, setSubmitting] = useState(false);

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
        setFormData({
            title: '',
            image_path: '',
            category: '',
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
            await api.post('/admin/gallery', formData);
            setSuccess('Foto baru berhasil ditambahkan.');
            setIsFormOpen(false);
            fetchGallery();
        } catch (err) {
            console.error('Form submit error:', err);
            setError(err.response?.data?.message || 'Gagal menyimpan foto.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-slate-50 font-sans">
            {/* Sidebar fixed di kiri */}
            <Sidebar />

            {/* Konten di kanan (margin-left: 220px untuk mengimbangi sidebar fixed) */}
            <div className="flex-grow ml-[220px] flex flex-col min-w-0">
                <header className="bg-white border-b border-slate-200 py-4 px-8 flex justify-between items-center h-16 shrink-0 shadow-xs">
                    <h1 className="text-lg font-bold text-slate-800 font-serif">Kelola Galeri Foto</h1>
                    <button
                        onClick={handleOpenCreate}
                        className="bg-emerald-700 hover:bg-emerald-600 text-white font-semibold px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 shadow transition cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Tambah Foto</span>
                    </button>
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
                            <p className="text-slate-500 text-xs mt-2">Memuat galeri foto...</p>
                        </div>
                    ) : gallery.length === 0 ? (
                        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500">
                            <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                            <p className="font-semibold text-slate-600">Galeri masih kosong</p>
                            <p className="text-xs">Silakan tambahkan foto baru untuk ditampilkan.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {gallery.map((item) => (
                                <div key={item.id} className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden flex flex-col justify-between group hover:shadow-md transition-shadow">
                                    <div className="aspect-video bg-slate-100 relative overflow-hidden flex items-center justify-center border-b border-slate-100">
                                        {item.image_path ? (
                                            <img
                                                src={item.image_path}
                                                alt={item.title}
                                                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = 'https://placehold.co/600x400?text=Gambar+Rusak';
                                                }}
                                            />
                                        ) : (
                                            <ImageIcon className="w-8 h-8 text-slate-300" />
                                        )}
                                        {item.category && (
                                            <span className="absolute top-3 left-3 bg-emerald-700 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center space-x-1 shadow-sm">
                                                <Tag className="w-2.5 h-2.5" />
                                                <span>{item.category}</span>
                                            </span>
                                        )}
                                    </div>
                                    <div className="p-4 flex justify-between items-center bg-white">
                                        <div className="min-w-0 pr-2">
                                            <h4 className="font-serif font-bold text-slate-800 text-xs truncate">{item.title}</h4>
                                            <p className="text-[9px] text-slate-400 truncate">{item.image_path}</p>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-rose-600 shrink-0 transition cursor-pointer"
                                            title="Hapus Foto"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>

            {/* Upload Modal Form */}
            {isFormOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in font-sans">
                    <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative">
                        <div className="bg-emerald-900 p-6 text-white flex justify-between items-center">
                            <h3 className="font-serif font-bold text-base">Tambah Foto Baru</h3>
                            <button onClick={() => setIsFormOpen(false)} className="text-white/80 hover:text-white cursor-pointer">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleFormSubmit} className="p-6 space-y-5">
                            <div className="flex flex-col space-y-1.5">
                                <label className="text-xs font-bold text-slate-700">Judul Foto / Keterangan</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="border border-slate-300 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                                    placeholder="Contoh: Gedung Madrasah Aliyah"
                                />
                            </div>

                            <div className="flex flex-col space-y-1.5">
                                <label className="text-xs font-bold text-slate-700">URL Gambar (image_path)</label>
                                <input
                                    type="url"
                                    required
                                    value={formData.image_path}
                                    onChange={(e) => setFormData({ ...formData, image_path: e.target.value })}
                                    className="border border-slate-300 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                                    placeholder="Contoh: https://example.com/foto.jpg"
                                />
                            </div>

                            <div className="flex flex-col space-y-1.5">
                                <label className="text-xs font-bold text-slate-700">Kategori</label>
                                <input
                                    type="text"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="border border-slate-300 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                                    placeholder="Contoh: Kegiatan, Fasilitas, Akademik (Opsional)"
                                />
                            </div>

                            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setIsFormOpen(false)}
                                    className="px-5 py-2 rounded-xl text-slate-500 hover:bg-slate-100 text-xs font-semibold transition cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 disabled:bg-emerald-900/60 text-white text-xs font-bold shadow transition cursor-pointer"
                                >
                                    {submitting ? 'Menyimpan...' : 'Simpan Foto'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
