import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { 
    Save, 
    Loader2, 
    Building2, 
    LayoutTemplate, 
    Megaphone, 
    PhoneCall, 
    Share2, 
    FileText,
    Globe,
    Upload
} from 'lucide-react';
import PageHeader from '../../components/admin/PageHeader';
import LoadingState from '../../components/admin/LoadingState';
import { useImageUpload } from '../../hooks/useImageUpload';

export default function Settings() {
    const [formData, setFormData] = useState({
        nama_pesantren: '',
        tagline: '',
        deskripsi_singkat: '',
        logo: '',
        favicon: '',
        hero_title: '',
        hero_subtitle: '',
        hero_image: '',
        cta_utama_text: '',
        cta_sekunder_text: '',
        running_text: '',
        alamat: '',
        no_telp: '',
        no_wa: '',
        email_kontak: '',
        link_facebook: '',
        link_instagram: '',
        link_youtube: '',
        copyright_text: '',
        deskripsi_footer: '',
        visi: '',
        misi: '',
        sambutan_pimpinan: '',
        sejarah_singkat: '',
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const { uploadImage, uploading: uploadingImage } = useImageUpload();

    const getImageUrl = (path) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        return `http://localhost:8000${path}`;
    };

    const handleUploadField = async (e, fieldName) => {
        const file = e.target.files[0];
        if (!file) return;
        const path = await uploadImage(file);
        if (path) {
            setFormData(prev => ({
                ...prev,
                [fieldName]: path
            }));
        }
    };

    useEffect(() => {
        const fetchSettings = async () => {
            setLoading(true);
            try {
                const res = await api.get('/admin/settings');
                const data = res.data || {};
                setFormData({
                    nama_pesantren: data.nama_pesantren || '',
                    tagline: data.tagline || '',
                    deskripsi_singkat: data.deskripsi_singkat || '',
                    logo: data.logo || '',
                    favicon: data.favicon || '',
                    hero_title: data.hero_title || '',
                    hero_subtitle: data.hero_subtitle || '',
                    hero_image: data.hero_image || '',
                    cta_utama_text: data.cta_utama_text || '',
                    cta_sekunder_text: data.cta_sekunder_text || '',
                    running_text: data.running_text || '',
                    alamat: data.alamat || '',
                    no_telp: data.no_telp || '',
                    no_wa: data.no_wa || '',
                    email_kontak: data.email_kontak || '',
                    link_facebook: data.link_facebook || data.link_fb || '',
                    link_instagram: data.link_instagram || data.link_ig || '',
                    link_youtube: data.link_youtube || '',
                    copyright_text: data.copyright_text || '',
                    deskripsi_footer: data.deskripsi_footer || '',
                    visi: data.visi || '',
                    misi: data.misi || '',
                    sambutan_pimpinan: data.sambutan_pimpinan || '',
                    sejarah_singkat: data.sejarah_singkat || '',
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

        // Payload with backward compatibility mappings
        const payload = {
            ...formData,
            link_fb: formData.link_facebook,
            link_ig: formData.link_instagram
        };

        try {
            await api.put('/admin/settings', payload);
            setSuccess('Profil dan tampilan website berhasil disimpan.');
        } catch (err) {
            console.error('Error saving settings:', err);
            setError(err.response?.data?.message || 'Gagal menyimpan pengaturan.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <PageHeader title="Profil & Tampilan Website" />

            <main className="flex-grow p-6 md:p-8 overflow-y-auto max-w-4xl w-full mx-auto space-y-6">
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
                    <LoadingState message="Memuat profil dan tampilan website..." />
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Section 1: Identitas Pesantren */}
                        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-8 relative">
                            <div className="absolute top-0 inset-x-0 h-1 bg-emerald-600 rounded-t-2xl" />
                            <div className="flex items-center space-x-2.5 mb-6">
                                <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 shadow-xs">
                                    <Building2 className="w-4 h-4" />
                                </div>
                                <h3 className="font-serif font-bold text-sm text-slate-800">Identitas Lembaga</h3>
                            </div>
                            <div className="space-y-5">
                                <div className="flex flex-col space-y-1.5">
                                    <label className="text-[11px] sm:text-xs font-bold text-slate-700">Nama Pesantren <span className="text-rose-500">*</span></label>
                                    <input
                                        type="text"
                                        name="nama_pesantren"
                                        value={formData.nama_pesantren}
                                        onChange={handleInputChange}
                                        className="border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 bg-slate-50/50 hover:bg-slate-50 focus:bg-white transition-all placeholder-slate-400"
                                        placeholder="Contoh: Pondok Pesantren Al-Qur'anul Karim"
                                        required
                                    />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <label className="text-[11px] sm:text-xs font-bold text-slate-700">Tagline Pesantren</label>
                                    <input
                                        type="text"
                                        name="tagline"
                                        value={formData.tagline}
                                        onChange={handleInputChange}
                                        className="border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 bg-slate-50/50 hover:bg-slate-50 focus:bg-white transition-all placeholder-slate-400"
                                        placeholder="Contoh: Islami, Qur'ani, Unggul, Modern"
                                    />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <label className="text-[11px] sm:text-xs font-bold text-slate-700">Deskripsi Singkat</label>
                                    <textarea
                                        name="deskripsi_singkat"
                                        rows="3"
                                        value={formData.deskripsi_singkat}
                                        onChange={handleInputChange}
                                        className="border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 bg-slate-50/50 hover:bg-slate-50 focus:bg-white transition-all resize-none placeholder-slate-400 leading-relaxed"
                                        placeholder="Deskripsi singkat pesantren untuk bagian atas halaman profil atau beranda..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Branding & Logo */}
                        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-8 relative">
                            <div className="absolute top-0 inset-x-0 h-1 bg-emerald-600 rounded-t-2xl" />
                            <div className="flex items-center space-x-2.5 mb-6">
                                <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 shadow-xs">
                                    <Globe className="w-4 h-4" />
                                </div>
                                <h3 className="font-serif font-bold text-sm text-slate-800">Branding & Logo</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Logo Upload */}
                                <div className="flex flex-col space-y-2">
                                    <label className="text-[11px] sm:text-xs font-bold text-slate-700">Logo Website</label>
                                    <div className="flex items-center gap-4">
                                        {formData.logo ? (
                                            <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-150 shrink-0 bg-slate-50 flex items-center justify-center p-2">
                                                <img 
                                                    src={getImageUrl(formData.logo)} 
                                                    alt="Logo Preview" 
                                                    className="max-w-full max-h-full object-contain" 
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-16 h-16 rounded-xl border border-dashed border-slate-200 shrink-0 bg-slate-50 flex items-center justify-center text-slate-400">
                                                <Globe className="w-6 h-6" />
                                            </div>
                                        )}
                                        <div className="flex-grow relative">
                                            <label className="flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs cursor-pointer transition select-none bg-white shadow-xs">
                                                <Upload className="w-3.5 h-3.5" />
                                                <span>{uploadingImage ? 'Mengunggah...' : 'Pilih Logo'}</span>
                                                <input 
                                                    type="file" 
                                                    accept="image/*" 
                                                    onChange={(e) => handleUploadField(e, 'logo')} 
                                                    className="hidden" 
                                                    disabled={uploadingImage}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Favicon Upload */}
                                <div className="flex flex-col space-y-2">
                                    <label className="text-[11px] sm:text-xs font-bold text-slate-700">Favicon (Icon Browser)</label>
                                    <div className="flex items-center gap-4">
                                        {formData.favicon ? (
                                            <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-150 shrink-0 bg-slate-50 flex items-center justify-center p-3">
                                                <img 
                                                    src={getImageUrl(formData.favicon)} 
                                                    alt="Favicon Preview" 
                                                    className="max-w-full max-h-full object-contain" 
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-16 h-16 rounded-xl border border-dashed border-slate-200 shrink-0 bg-slate-50 flex items-center justify-center text-slate-400">
                                                <Globe className="w-6 h-6" />
                                            </div>
                                        )}
                                        <div className="flex-grow relative">
                                            <label className="flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs cursor-pointer transition select-none bg-white shadow-xs">
                                                <Upload className="w-3.5 h-3.5" />
                                                <span>{uploadingImage ? 'Mengunggah...' : 'Pilih Favicon'}</span>
                                                <input 
                                                    type="file" 
                                                    accept="image/*" 
                                                    onChange={(e) => handleUploadField(e, 'favicon')} 
                                                    className="hidden" 
                                                    disabled={uploadingImage}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Hero / Beranda */}
                        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-8 relative">
                            <div className="absolute top-0 inset-x-0 h-1 bg-emerald-600 rounded-t-2xl" />
                            <div className="flex items-center space-x-2.5 mb-6">
                                <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 shadow-xs">
                                    <LayoutTemplate className="w-4 h-4" />
                                </div>
                                <h3 className="font-serif font-bold text-sm text-slate-800">Hero Section & Banner</h3>
                            </div>
                            <div className="space-y-5">
                                <div className="flex flex-col space-y-1.5">
                                    <label className="text-[11px] sm:text-xs font-bold text-slate-700">Hero Section Title</label>
                                    <input
                                        type="text"
                                        name="hero_title"
                                        value={formData.hero_title}
                                        onChange={handleInputChange}
                                        className="border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 bg-slate-50/50 hover:bg-slate-50 focus:bg-white transition-all placeholder-slate-400"
                                        placeholder="Contoh: Mendidik Generasi Qur'ani & Unggul"
                                    />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <label className="text-[11px] sm:text-xs font-bold text-slate-700">Hero Section Subtitle / Tagline</label>
                                    <input
                                        type="text"
                                        name="hero_subtitle"
                                        value={formData.hero_subtitle}
                                        onChange={handleInputChange}
                                        className="border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 bg-slate-50/50 hover:bg-slate-50 focus:bg-white transition-all placeholder-slate-400"
                                        placeholder="Tagline di bawah judul hero"
                                    />
                                </div>
                                
                                {/* Hero Image Upload */}
                                <div className="flex flex-col space-y-2 pt-2">
                                    <label className="text-[11px] sm:text-xs font-bold text-slate-700">Gambar Latar Belakang / Banner Hero</label>
                                    <div className="flex items-center gap-4">
                                        {formData.hero_image ? (
                                            <div className="w-24 h-16 rounded-xl overflow-hidden border border-slate-150 shrink-0 bg-slate-50">
                                                <img 
                                                    src={getImageUrl(formData.hero_image)} 
                                                    alt="Banner Preview" 
                                                    className="w-full h-full object-cover" 
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-24 h-16 rounded-xl border border-dashed border-slate-200 shrink-0 bg-slate-50 flex items-center justify-center text-slate-400">
                                                <Upload className="w-5 h-5" />
                                            </div>
                                        )}
                                        <div className="flex-grow">
                                            <label className="flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs cursor-pointer transition select-none bg-white shadow-xs">
                                                <Upload className="w-3.5 h-3.5" />
                                                <span>{uploadingImage ? 'Mengunggah...' : 'Pilih Gambar Banner'}</span>
                                                <input 
                                                    type="file" 
                                                    accept="image/*" 
                                                    onChange={(e) => handleUploadField(e, 'hero_image')} 
                                                    className="hidden" 
                                                    disabled={uploadingImage}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                    <div className="flex flex-col space-y-1.5">
                                        <label className="text-[11px] sm:text-xs font-bold text-slate-700">Teks Tombol CTA Utama</label>
                                        <input
                                            type="text"
                                            name="cta_utama_text"
                                            value={formData.cta_utama_text}
                                            onChange={handleInputChange}
                                            className="border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 bg-slate-50/50 hover:bg-slate-50 focus:bg-white transition-all placeholder-slate-400"
                                            placeholder="Contoh: Daftar PPDB Online"
                                        />
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <label className="text-[11px] sm:text-xs font-bold text-slate-700">Teks Tombol CTA Sekunder</label>
                                        <input
                                            type="text"
                                            name="cta_sekunder_text"
                                            value={formData.cta_sekunder_text}
                                            onChange={handleInputChange}
                                            className="border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 bg-slate-50/50 hover:bg-slate-50 focus:bg-white transition-all placeholder-slate-400"
                                            placeholder="Contoh: Pelajari Profil Kami"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 4: Sambutan & Profil Lembaga */}
                        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-8 relative">
                            <div className="absolute top-0 inset-x-0 h-1 bg-emerald-600 rounded-t-2xl" />
                            <div className="flex items-center space-x-2.5 mb-6">
                                <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 shadow-xs">
                                    <Megaphone className="w-4 h-4" />
                                </div>
                                <h3 className="font-serif font-bold text-sm text-slate-800">Sambutan & Profil Pesantren</h3>
                            </div>
                            <div className="space-y-5">
                                <div className="flex flex-col space-y-1.5">
                                    <label className="text-[11px] sm:text-xs font-bold text-slate-700">Sambutan Pimpinan</label>
                                    <textarea
                                        name="sambutan_pimpinan"
                                        rows="4"
                                        value={formData.sambutan_pimpinan}
                                        onChange={handleInputChange}
                                        className="border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 bg-slate-50/50 hover:bg-slate-50 focus:bg-white transition-all resize-none placeholder-slate-400 leading-relaxed"
                                        placeholder="Tuliskan kata sambutan pimpinan pesantren..."
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex flex-col space-y-1.5">
                                        <label className="text-[11px] sm:text-xs font-bold text-slate-700">Visi Lembaga</label>
                                        <textarea
                                            name="visi"
                                            rows="3"
                                            value={formData.visi}
                                            onChange={handleInputChange}
                                            className="border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 bg-slate-50/50 hover:bg-slate-50 focus:bg-white transition-all resize-none placeholder-slate-400 leading-relaxed"
                                            placeholder="Tuliskan visi pondok pesantren..."
                                        />
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <label className="text-[11px] sm:text-xs font-bold text-slate-700">Misi Lembaga</label>
                                        <textarea
                                            name="misi"
                                            rows="3"
                                            value={formData.misi}
                                            onChange={handleInputChange}
                                            className="border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 bg-slate-50/50 hover:bg-slate-50 focus:bg-white transition-all resize-none placeholder-slate-400 leading-relaxed"
                                            placeholder="Tuliskan misi pondok pesantren (tiap poin bisa pisah baris)..."
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <label className="text-[11px] sm:text-xs font-bold text-slate-700">Sejarah Singkat</label>
                                    <textarea
                                        name="sejarah_singkat"
                                        rows="4"
                                        value={formData.sejarah_singkat}
                                        onChange={handleInputChange}
                                        className="border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 bg-slate-50/50 hover:bg-slate-50 focus:bg-white transition-all resize-none placeholder-slate-400 leading-relaxed"
                                        placeholder="Ceritakan sejarah ringkas berdirinya pondok pesantren..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 5: Kontak */}
                        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-8 relative">
                            <div className="absolute top-0 inset-x-0 h-1 bg-emerald-600 rounded-t-2xl" />
                            <div className="flex items-center space-x-2.5 mb-6">
                                <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 shadow-xs">
                                    <PhoneCall className="w-4 h-4" />
                                </div>
                                <h3 className="font-serif font-bold text-sm text-slate-800">Informasi Kontak & Alamat</h3>
                            </div>
                            <div className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="flex flex-col space-y-1.5">
                                        <label className="text-[11px] sm:text-xs font-bold text-slate-700">No. Telepon / Kantor</label>
                                        <input
                                            type="text"
                                            name="no_telp"
                                            value={formData.no_telp}
                                            onChange={handleInputChange}
                                            className="border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 bg-slate-50/50 hover:bg-slate-50 focus:bg-white transition-all placeholder-slate-400"
                                            placeholder="Contoh: (0274) 123456"
                                        />
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <label className="text-[11px] sm:text-xs font-bold text-slate-700">WhatsApp Hotline</label>
                                        <input
                                            type="text"
                                            name="no_wa"
                                            value={formData.no_wa}
                                            onChange={handleInputChange}
                                            className="border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 bg-slate-50/50 hover:bg-slate-50 focus:bg-white transition-all placeholder-slate-400"
                                            placeholder="Contoh: +62 812-3456-7890"
                                        />
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <label className="text-[11px] sm:text-xs font-bold text-slate-700">Email Hubungi Kami</label>
                                        <input
                                            type="email"
                                            name="email_kontak"
                                            value={formData.email_kontak}
                                            onChange={handleInputChange}
                                            className="border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 bg-slate-50/50 hover:bg-slate-50 focus:bg-white transition-all placeholder-slate-400"
                                            placeholder="Contoh: info@pesantren.com"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <label className="text-[11px] sm:text-xs font-bold text-slate-700">Alamat Lengkap Pesantren</label>
                                    <textarea
                                        name="alamat"
                                        rows="3"
                                        value={formData.alamat}
                                        onChange={handleInputChange}
                                        className="border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 bg-slate-50/50 hover:bg-slate-50 focus:bg-white transition-all resize-none placeholder-slate-400 leading-relaxed"
                                        placeholder="Masukkan alamat fisik pondok pesantren lengkap"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 6: Sosial Media */}
                        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-8 relative">
                            <div className="absolute top-0 inset-x-0 h-1 bg-emerald-600 rounded-t-2xl" />
                            <div className="flex items-center space-x-2.5 mb-6">
                                <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 shadow-xs">
                                    <Share2 className="w-4 h-4" />
                                </div>
                                <h3 className="font-serif font-bold text-sm text-slate-800">Tautan Media Sosial</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="flex flex-col space-y-1.5">
                                    <label className="text-[11px] sm:text-xs font-bold text-slate-700">Facebook URL</label>
                                    <input
                                        type="url"
                                        name="link_facebook"
                                        value={formData.link_facebook}
                                        onChange={handleInputChange}
                                        className="border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 bg-slate-50/50 hover:bg-slate-50 focus:bg-white transition-all placeholder-slate-400"
                                        placeholder="https://facebook.com/pesantren"
                                    />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <label className="text-[11px] sm:text-xs font-bold text-slate-700">Instagram URL</label>
                                    <input
                                        type="url"
                                        name="link_instagram"
                                        value={formData.link_instagram}
                                        onChange={handleInputChange}
                                        className="border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 bg-slate-50/50 hover:bg-slate-50 focus:bg-white transition-all placeholder-slate-400"
                                        placeholder="https://instagram.com/pesantren"
                                    />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <label className="text-[11px] sm:text-xs font-bold text-slate-700">YouTube Channel URL</label>
                                    <input
                                        type="url"
                                        name="link_youtube"
                                        value={formData.link_youtube}
                                        onChange={handleInputChange}
                                        className="border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 bg-slate-50/50 hover:bg-slate-50 focus:bg-white transition-all placeholder-slate-400"
                                        placeholder="https://youtube.com/c/pesantren"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 7: Footer & Running Text */}
                        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-8 relative">
                            <div className="absolute top-0 inset-x-0 h-1 bg-emerald-600 rounded-t-2xl" />
                            <div className="flex items-center space-x-2.5 mb-6">
                                <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 shadow-xs">
                                    <FileText className="w-4 h-4" />
                                </div>
                                <h3 className="font-serif font-bold text-sm text-slate-800">Footer & Pengumuman Berjalan</h3>
                            </div>
                            <div className="space-y-5">
                                <div className="flex flex-col space-y-1.5">
                                    <label className="text-[11px] sm:text-xs font-bold text-slate-700">Deskripsi Footer Singkat</label>
                                    <textarea
                                        name="deskripsi_footer"
                                        rows="2"
                                        value={formData.deskripsi_footer}
                                        onChange={handleInputChange}
                                        className="border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 bg-slate-50/50 hover:bg-slate-50 focus:bg-white transition-all resize-none placeholder-slate-400 leading-relaxed"
                                        placeholder="Membentuk generasi penghafal Al-Qur'an..."
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex flex-col space-y-1.5">
                                        <label className="text-[11px] sm:text-xs font-bold text-slate-700">Copyright Text</label>
                                        <input
                                            type="text"
                                            name="copyright_text"
                                            value={formData.copyright_text}
                                            onChange={handleInputChange}
                                            className="border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 bg-slate-50/50 hover:bg-slate-50 focus:bg-white transition-all placeholder-slate-400"
                                            placeholder="Contoh: Pondok Pesantren Al-Qur'anul Karim. All rights reserved."
                                        />
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <label className="text-[11px] sm:text-xs font-bold text-slate-700">Running Text (Pengumuman Berjalan)</label>
                                        <input
                                            type="text"
                                            name="running_text"
                                            value={formData.running_text}
                                            onChange={handleInputChange}
                                            className="border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 bg-slate-50/50 hover:bg-slate-50 focus:bg-white transition-all placeholder-slate-400"
                                            placeholder="Pendaftaran santri baru gelombang 1 resmi dibuka!"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4 flex justify-end">
                            <button
                                type="submit"
                                disabled={submitting || uploadingImage}
                                className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-600 disabled:bg-emerald-950/60 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl shadow-md transition flex items-center justify-center space-x-2 cursor-pointer text-xs sm:text-sm"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Menyimpan...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        <span>Simpan Pengaturan</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </main>
        </>
    );
}
