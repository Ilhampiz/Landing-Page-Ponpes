import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Sidebar from '../../components/Sidebar';
import { Settings as SettingsIcon, Save, Loader2 } from 'lucide-react';

export default function Settings() {
    const [formData, setFormData] = useState({
        hero_title: '',
        alamat: '',
        no_telp: '',
        email_kontak: '',
        link_ig: '',
        link_fb: '',
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchSettings = async () => {
            setLoading(true);
            try {
                const res = await api.get('/admin/settings');
                const data = res.data || {};
                setFormData({
                    hero_title: data.hero_title || '',
                    alamat: data.alamat || '',
                    no_telp: data.no_telp || '',
                    email_kontak: data.email_kontak || '',
                    link_ig: data.link_ig || '',
                    link_fb: data.link_fb || '',
                });
            } catch (err) {
                console.error('Error fetching settings:', err);
                setError('Gagal memuat pengaturan.');
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        setSuccess('');
        try {
            await api.put('/admin/settings', formData);
            setSuccess('Pengaturan berhasil disimpan.');
        } catch (err) {
            console.error('Error saving settings:', err);
            setError(err.response?.data?.message || 'Gagal menyimpan pengaturan.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-slate-50 font-sans">
            <Sidebar />

            <div className="flex-grow flex flex-col min-w-0">
                <header className="bg-white border-b border-slate-200 py-4 px-8 flex justify-between items-center h-16 shrink-0 shadow-xs">
                    <h1 className="text-xl font-bold text-slate-800 font-serif">Pengaturan Website</h1>
                </header>

                <main className="flex-grow p-6 md:p-8 overflow-y-auto max-w-4xl w-full mx-auto space-y-6">
                    {success && (
                        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-sm">
                            {success}
                        </div>
                    )}
                    {error && (
                        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-block w-8 h-8 border-4 border-emerald-700 border-t-transparent rounded-full animate-spin" />
                            <p className="text-slate-500 text-sm mt-2">Memuat pengaturan website...</p>
                        </div>
                    ) : (
                        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden p-8 md:p-10 relative">
                            <div className="absolute top-0 inset-x-0 h-1.5 bg-emerald-700" />
                            
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="flex flex-col space-y-1.5">
                                    <label className="text-sm font-semibold text-slate-700">Hero Section Title</label>
                                    <input
                                        type="text"
                                        name="hero_title"
                                        value={formData.hero_title}
                                        onChange={handleInputChange}
                                        className="border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                                        placeholder="Judul utama landing page"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex flex-col space-y-1.5">
                                        <label className="text-sm font-semibold text-slate-700">No. Telepon / WhatsApp Hubungi Kami</label>
                                        <input
                                            type="text"
                                            name="no_telp"
                                            value={formData.no_telp}
                                            onChange={handleInputChange}
                                            className="border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                                            placeholder="Contoh: +62 812-3456-7890"
                                        />
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <label className="text-sm font-semibold text-slate-700">Email Hubungi Kami</label>
                                        <input
                                            type="email"
                                            name="email_kontak"
                                            value={formData.email_kontak}
                                            onChange={handleInputChange}
                                            className="border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                                            placeholder="Contoh: info@pesantren.com"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col space-y-1.5">
                                    <label className="text-sm font-semibold text-slate-700">Alamat Lengkap Pesantren</label>
                                    <textarea
                                        name="alamat"
                                        rows="3"
                                        value={formData.alamat}
                                        onChange={handleInputChange}
                                        className="border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white resize-none"
                                        placeholder="Masukkan alamat fisik pondok pesantren lengkap"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                                    <div className="flex flex-col space-y-1.5">
                                        <label className="text-sm font-semibold text-slate-700 font-sans">URL Profil Instagram</label>
                                        <input
                                            type="url"
                                            name="link_ig"
                                            value={formData.link_ig}
                                            onChange={handleInputChange}
                                            className="border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                                            placeholder="https://instagram.com/akun-pesantren"
                                        />
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <label className="text-sm font-semibold text-slate-700 font-sans">URL Halaman Facebook</label>
                                        <input
                                            type="url"
                                            name="link_fb"
                                            value={formData.link_fb}
                                            onChange={handleInputChange}
                                            className="border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                                            placeholder="https://facebook.com/halaman-pesantren"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-600 disabled:bg-emerald-900/60 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg hover:shadow-xl transition flex items-center justify-center space-x-2 cursor-pointer"
                                    >
                                        {submitting ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                <span>Menyimpan...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-5 h-5" />
                                                <span>Simpan Pengaturan</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
