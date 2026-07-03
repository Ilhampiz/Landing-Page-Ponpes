import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Sidebar from '../../components/Sidebar';
import { Newspaper, Edit2, Trash2, Plus, X, Calendar } from 'lucide-react';

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
    });
    const [submitting, setSubmitting] = useState(false);

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
        });
        setIsFormOpen(true);
    };

    const handleOpenEdit = (item) => {
        setEditingItem(item);
        setFormData({
            title: item.title || '',
            content: item.content || '',
            published_at: item.published_at ? item.published_at.substring(0, 10) : '',
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

    return (
        <div className="min-h-screen flex bg-slate-50 font-sans">
            {/* Sidebar fixed di kiri */}
            <Sidebar />

            {/* Konten di kanan (margin-left: 220px untuk mengimbangi sidebar fixed) */}
            <div className="flex-grow ml-[220px] flex flex-col min-w-0">
                <header className="bg-white border-b border-slate-200 py-4 px-8 flex justify-between items-center h-16 shrink-0 shadow-xs">
                    <h1 className="text-lg font-bold text-slate-800 font-serif">Kelola Berita</h1>
                    <button
                        onClick={handleOpenCreate}
                        className="bg-emerald-700 hover:bg-emerald-600 text-white font-semibold px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 shadow transition cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Tambah Berita</span>
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
                            <p className="text-slate-500 text-xs mt-2">Memuat daftar berita...</p>
                        </div>
                    ) : news.length === 0 ? (
                        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500">
                            <Newspaper className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                            <p className="font-semibold text-slate-600">Belum ada berita</p>
                            <p className="text-xs">Silakan buat berita baru dengan tombol di kanan atas.</p>
                        </div>
                    ) : (
                        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 text-slate-600 text-xs font-semibold uppercase border-b border-slate-200">
                                            <th className="px-6 py-4">Judul Berita</th>
                                            <th className="px-6 py-4">Tanggal Rilis</th>
                                            <th className="px-6 py-4 text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                                        {news.map((item) => (
                                            <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4 font-semibold text-slate-900">{item.title}</td>
                                                <td className="px-6 py-4 text-slate-500">
                                                    <span className="inline-flex items-center space-x-1">
                                                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                        <span>{item.published_at ? item.published_at.substring(0, 10) : '-'}</span>
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="inline-flex items-center space-x-2">
                                                        <button
                                                            onClick={() => handleOpenEdit(item)}
                                                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-emerald-700 transition cursor-pointer"
                                                            title="Edit Berita"
                                                        >
                                                            <Edit2 className="w-3.5 h-3.5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(item.id)}
                                                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-rose-600 transition cursor-pointer"
                                                            title="Hapus Berita"
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
                        </div>
                    )}
                </main>
            </div>

            {/* Create/Edit Modal Form */}
            {isFormOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in font-sans">
                    <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative">
                        <div className="bg-emerald-900 p-6 text-white flex justify-between items-center">
                            <h3 className="font-serif font-bold text-base">{editingItem ? 'Edit Berita' : 'Tambah Berita Baru'}</h3>
                            <button onClick={() => setIsFormOpen(false)} className="text-white/80 hover:text-white cursor-pointer">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleFormSubmit} className="p-6 space-y-5">
                            <div className="flex flex-col space-y-1.5">
                                <label className="text-xs font-bold text-slate-700">Judul Berita</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="border border-slate-300 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                                    placeholder="Masukkan judul berita"
                                />
                            </div>

                            <div className="flex flex-col space-y-1.5">
                                <label className="text-xs font-bold text-slate-700">Tanggal Publikasi</label>
                                <input
                                    type="date"
                                    required
                                    value={formData.published_at}
                                    onChange={(e) => setFormData({ ...formData, published_at: e.target.value })}
                                    className="border border-slate-300 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                                />
                            </div>

                            <div className="flex flex-col space-y-1.5">
                                <label className="text-xs font-bold text-slate-700">Konten / Isi Berita</label>
                                <textarea
                                    required
                                    rows="6"
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    className="border border-slate-300 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white resize-none"
                                    placeholder="Tuliskan isi artikel lengkap di sini..."
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
                                    {submitting ? 'Menyimpan...' : 'Simpan Berita'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
