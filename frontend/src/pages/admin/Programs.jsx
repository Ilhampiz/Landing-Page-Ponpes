import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Sidebar from '../../components/Sidebar';
import { GraduationCap, Edit2, Trash2, Plus, X } from 'lucide-react';

export default function Programs() {
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Modal & Form state
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        icon_or_image: '',
        order: 0,
    });
    const [submitting, setSubmitting] = useState(false);

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

    return (
        <div className="min-h-screen flex bg-slate-50 font-sans">
            {/* Sidebar fixed di kiri */}
            <Sidebar />

            {/* Konten di kanan (margin-left: 220px untuk mengimbangi sidebar fixed) */}
            <div className="flex-grow ml-[220px] flex flex-col min-w-0">
                <header className="bg-white border-b border-slate-200 py-4 px-8 flex justify-between items-center h-16 shrink-0 shadow-xs">
                    <h1 className="text-lg font-bold text-slate-800 font-serif">Kelola Program Pendidikan</h1>
                    <button
                        onClick={handleOpenCreate}
                        className="bg-emerald-700 hover:bg-emerald-600 text-white font-semibold px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 shadow transition cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Tambah Program</span>
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
                            <p className="text-slate-500 text-xs mt-2">Memuat daftar program...</p>
                        </div>
                    ) : programs.length === 0 ? (
                        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500">
                            <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                            <p className="font-semibold text-slate-600">Belum ada program pendidikan</p>
                            <p className="text-xs">Silakan buat program baru dengan tombol di kanan atas.</p>
                        </div>
                    ) : (
                        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 text-slate-600 text-xs font-semibold uppercase border-b border-slate-200">
                                            <th className="px-6 py-4">Urutan</th>
                                            <th className="px-6 py-4">Nama Program</th>
                                            <th className="px-6 py-4">Deskripsi</th>
                                            <th className="px-6 py-4 text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                                        {programs.map((item) => (
                                            <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4 text-slate-500 font-mono">{item.order}</td>
                                                <td className="px-6 py-4 font-semibold text-slate-900">{item.title}</td>
                                                <td className="px-6 py-4 text-slate-500 max-w-md truncate">{item.description}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="inline-flex items-center space-x-2">
                                                        <button
                                                            onClick={() => handleOpenEdit(item)}
                                                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-emerald-700 transition cursor-pointer"
                                                            title="Edit Program"
                                                        >
                                                            <Edit2 className="w-3.5 h-3.5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(item.id)}
                                                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-rose-600 transition cursor-pointer"
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
                        </div>
                    )}
                </main>
            </div>

            {/* Create/Edit Modal Form */}
            {isFormOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in font-sans">
                    <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative">
                        <div className="bg-emerald-900 p-6 text-white flex justify-between items-center">
                            <h3 className="font-serif font-bold text-base">{editingItem ? 'Edit Program' : 'Tambah Program Baru'}</h3>
                            <button onClick={() => setIsFormOpen(false)} className="text-white/80 hover:text-white cursor-pointer">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleFormSubmit} className="p-6 space-y-5">
                            <div className="flex flex-col space-y-1.5">
                                <label className="text-xs font-bold text-slate-700">Nama Program</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="border border-slate-300 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                                    placeholder="Contoh: Program Tahfidzul Qur'an"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700">Ikon / URL Gambar (Opsional)</label>
                                    <input
                                        type="text"
                                        value={formData.icon_or_image}
                                        onChange={(e) => setFormData({ ...formData, icon_or_image: e.target.value })}
                                        className="border border-slate-300 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                                        placeholder="Contoh: https://example.com/logo.png"
                                    />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700">Urutan Tampilan</label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.order}
                                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                                        className="border border-slate-300 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col space-y-1.5">
                                <label className="text-xs font-bold text-slate-700">Deskripsi Program</label>
                                <textarea
                                    required
                                    rows="5"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="border border-slate-300 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white resize-none"
                                    placeholder="Tuliskan penjelasan lengkap mengenai program pendidikan ini..."
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
                                    {submitting ? 'Menyimpan...' : 'Simpan Program'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
