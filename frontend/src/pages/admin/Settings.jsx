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
    Upload,
    CheckCircle2,
    AlertCircle,
    ChevronDown,
    BookOpen,
    Megaphone as RunningIcon,
    Target,
    MessageSquare,
    MapPin,
} from 'lucide-react';
import PageHeader from '../../components/admin/PageHeader';
import LoadingState from '../../components/admin/LoadingState';
import { useImageUpload } from '../../hooks/useImageUpload';

/* ─── Shared input style ──────────────────────────────────────────────────── */
const inputCls = "w-full border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 bg-slate-50/50 hover:bg-slate-50 focus:bg-white transition-all placeholder-slate-400";
const labelCls = "text-[11px] sm:text-xs font-bold text-slate-700 flex items-center gap-2";

/* Badge to show where a setting appears */
function Badge({ label }) {
    return (
        <span className="inline-block text-[9px] font-bold uppercase tracking-wide bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-md px-1.5 py-0.5">
            {label}
        </span>
    );
}

function Field({ label, badge, required, children }) {
    return (
        <div className="flex flex-col space-y-1.5">
            <label className={labelCls}>
                {label} {required && <span className="text-rose-500">*</span>}
                {badge && <Badge label={badge} />}
            </label>
            {children}
        </div>
    );
}

/* ─── Per-section toast ─────────────────────────────────────────────────── */
function SectionToast({ state }) {
    if (!state) return null;
    if (state === 'saving') return (
        <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-medium animate-pulse">
            <Loader2 size={13} className="animate-spin" /> Menyimpan...
        </span>
    );
    if (state === 'ok') return (
        <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
            <CheckCircle2 size={13} /> Tersimpan
        </span>
    );
    return (
        <span className="inline-flex items-center gap-1.5 text-xs text-rose-500 font-semibold">
            <AlertCircle size={13} /> Gagal disimpan
        </span>
    );
}

/* ─── Accordion SectionCard ─────────────────────────────────────────────── */
function SectionCard({ icon: Icon, title, subtitle, accent = 'bg-emerald-600', children, onSave, saving, defaultOpen = false }) {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const [toast, setToast] = useState(null);

    const handleSave = async () => {
        setToast('saving');
        const ok = await onSave();
        setToast(ok ? 'ok' : 'error');
        setTimeout(() => setToast(null), 3500);
    };

    return (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            {/* Accent bar */}
            <div className={`h-1 ${accent} w-full`} />

            {/* Header — clickable to toggle */}
            <button
                type="button"
                onClick={() => setIsOpen(o => !o)}
                className="w-full flex items-center justify-between px-5 sm:px-8 py-4 cursor-pointer bg-transparent border-none text-left hover:bg-slate-50/70 transition-colors group"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 shadow-xs shrink-0">
                        <Icon className="w-4 h-4" />
                    </div>
                    <div>
                        <h3 className="font-serif font-bold text-sm text-slate-800 leading-tight">{title}</h3>
                        {subtitle && <p className="text-[11px] text-slate-400 font-normal mt-0.5 leading-snug">{subtitle}</p>}
                    </div>
                </div>
                <ChevronDown
                    size={18}
                    className={`text-slate-400 group-hover:text-slate-600 transition-transform duration-300 shrink-0 ml-4 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
                />
            </button>

            {/* Collapsible body */}
            <div
                className="overflow-hidden transition-all duration-400 ease-in-out"
                style={{ maxHeight: isOpen ? '3000px' : '0px', opacity: isOpen ? 1 : 0 }}
            >
                <div className="px-5 sm:px-8 pb-7 border-t border-slate-100">
                    {/* Inner save bar */}
                    <div className="flex items-center justify-end gap-3 py-4 border-b border-slate-50 mb-5">
                        <SectionToast state={toast} />
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={saving}
                            className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold px-4 py-2 rounded-xl text-xs transition cursor-pointer shadow-sm"
                        >
                            <Save size={13} />
                            Simpan Section Ini
                        </button>
                    </div>
                    <div className="space-y-5">{children}</div>
                </div>
            </div>
        </div>
    );
}

/* ══════════════════════════════════════════════════════════════════════════ */

export default function Settings() {
    const [formData, setFormData] = useState({
        nama_pesantren: '', tagline: '', deskripsi_singkat: '',
        logo: '', favicon: '',
        running_text: '',
        hero_title: '', hero_subtitle: '', hero_image: '',
        link_facebook: '', link_instagram: '', link_youtube: '',
        sambutan_pimpinan: '', sambutan_image: '', nama_pimpinan: '', jabatan_pimpinan: '',
        tagline_visi: '', visi: '', misi: '', sejarah_singkat: '',
        cta_utama_text: '', cta_sekunder_text: '',
        alamat: '', no_telp: '', no_wa: '', email_kontak: '',
        deskripsi_footer: '', copyright_text: '',
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [globalError, setGlobalError] = useState('');
    const { uploadImage, uploading: uploadingImage } = useImageUpload();

    const getImageUrl = (path) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        return `http://pesantren-api.test${path}`;
    };

    const handleUploadField = async (e, fieldName) => {
        const file = e.target.files[0];
        if (!file) return;
        const path = await uploadImage(file);
        if (path) setFormData(prev => ({ ...prev, [fieldName]: path }));
    };

    useEffect(() => {
        const fetchSettings = async () => {
            setLoading(true);
            try {
                const res = await api.get('/admin/settings');
                const d = res.data || {};
                setFormData({
                    nama_pesantren:    d.nama_pesantren    || '',
                    tagline:           d.tagline           || '',
                    deskripsi_singkat: d.deskripsi_singkat || '',
                    logo:              d.logo              || '',
                    favicon:           d.favicon           || '',
                    running_text:      d.running_text      || '',
                    hero_title:        d.hero_title        || '',
                    hero_subtitle:     d.hero_subtitle     || '',
                    hero_image:        d.hero_image        || '',
                    link_facebook:     d.link_facebook || d.link_fb   || '',
                    link_instagram:    d.link_instagram || d.link_ig  || '',
                    link_youtube:      d.link_youtube      || '',
                    sambutan_pimpinan: d.sambutan_pimpinan || '',
                    sambutan_image:    d.sambutan_image    || '',
                    nama_pimpinan:     d.nama_pimpinan     || '',
                    jabatan_pimpinan:  d.jabatan_pimpinan  || '',
                    visi:              d.visi              || '',
                    misi:              d.misi              || '',
                    sejarah_singkat:   d.sejarah_singkat   || '',
                    cta_utama_text:    d.cta_utama_text    || '',
                    cta_sekunder_text: d.cta_sekunder_text || '',
                    alamat:            d.alamat            || '',
                    no_telp:           d.no_telp           || '',
                    no_wa:             d.no_wa             || '',
                    email_kontak:      d.email_kontak      || '',
                    deskripsi_footer:  d.deskripsi_footer  || '',
                    copyright_text:    d.copyright_text    || '',
                });
            } catch (err) {
                console.error(err);
                setGlobalError('Gagal memuat pengaturan.');
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    /* Save only the specified keys to the API */
    const saveSection = async (keys) => {
        setSaving(true);
        try {
            const payload = {};
            keys.forEach(k => {
                if (formData[k] !== undefined) payload[k] = formData[k];
            });
            // Backward-compat aliases
            if (keys.includes('link_facebook'))  payload.link_fb = formData.link_facebook;
            if (keys.includes('link_instagram')) payload.link_ig = formData.link_instagram;
            await api.put('/admin/settings', payload);
            return true;
        } catch (err) {
            const msg = err.response?.data?.message
                || JSON.stringify(err.response?.data?.errors || {})
                || err.message
                || 'Gagal menyimpan';
            console.error('Save error:', msg, err.response?.data);
            return false;
        } finally {
            setSaving(false);
        }
    };

    /* Reusable image upload UI */
    const ImageUploadField = ({ label, badge, fieldName, previewClass = 'w-24 h-16' }) => (
        <Field label={label} badge={badge}>
            <div className="flex items-center gap-4">
                {formData[fieldName] ? (
                    <div className={`${previewClass} rounded-xl overflow-hidden border border-slate-200 shrink-0 bg-slate-50 flex items-center justify-center p-1`}>
                        <img src={getImageUrl(formData[fieldName])} alt={label} className="max-w-full max-h-full object-contain" />
                    </div>
                ) : (
                    <div className={`${previewClass} rounded-xl border border-dashed border-slate-200 shrink-0 bg-slate-50 flex items-center justify-center text-slate-400`}>
                        <Upload className="w-5 h-5" />
                    </div>
                )}
                <label className="flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs cursor-pointer transition select-none bg-white shadow-xs">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingImage ? 'Mengunggah...' : 'Pilih Gambar'}</span>
                    <input type="file" accept="image/*" onChange={e => handleUploadField(e, fieldName)} className="hidden" disabled={uploadingImage} />
                </label>
            </div>
        </Field>
    );

    return (
        <>
            <PageHeader title="Pengaturan Beranda" />

            <main className="flex-grow p-6 md:p-8 overflow-y-auto max-w-4xl w-full mx-auto space-y-4">

                {globalError && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl text-xs font-semibold flex items-center gap-2">
                        <AlertCircle size={14} /> {globalError}
                    </div>
                )}

                {/* Guide banner */}
                <div className="bg-blue-50 border border-blue-200 rounded-2xl px-5 py-3.5 flex items-start gap-3 text-xs text-blue-700">
                    <BookOpen size={15} className="shrink-0 mt-0.5" />
                    <p>
                        Setiap kartu di bawah sesuai dengan <strong>satu section di Beranda</strong>.
                        Klik kartu untuk membuka, edit field, lalu klik <strong>"Simpan Section Ini"</strong>.
                        Perubahan akan langsung terlihat di website setelah disimpan.
                    </p>
                </div>

                {loading ? (
                    <LoadingState message="Memuat pengaturan beranda..." />
                ) : (
                    <>

                    {/* ══════════════════════════════════════════════════════════
                        0. NAVBAR & IDENTITAS
                        (Ditampilkan: Logo, nama pesantren & tagline di navbar atas)
                    ══════════════════════════════════════════════════════════ */}
                    <SectionCard
                        icon={Building2}
                        title="Navbar & Identitas Lembaga"
                        subtitle="Nama, logo, favicon, dan tagline yang tampil di navbar seluruh halaman"
                        saving={saving}
                        onSave={() => saveSection(['nama_pesantren', 'tagline', 'deskripsi_singkat', 'logo', 'favicon'])}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <ImageUploadField label="Logo Website" badge="Navbar" fieldName="logo" previewClass="w-16 h-16" />
                            <ImageUploadField label="Favicon (Icon Tab Browser)" badge="Browser" fieldName="favicon" previewClass="w-16 h-16" />
                        </div>
                        <Field label="Nama Pesantren" badge="Navbar" required>
                            <input type="text" name="nama_pesantren" value={formData.nama_pesantren}
                                onChange={handleChange} className={inputCls}
                                placeholder="Contoh: Pondok Pesantren Al-Hikmatul Furqon" required />
                        </Field>
                        <Field label="Tagline" badge="Navbar & Beranda">
                            <input type="text" name="tagline" value={formData.tagline}
                                onChange={handleChange} className={inputCls}
                                placeholder="Contoh: Mendidik Generasi Qur'ani & Unggul" />
                            <p className="text-[10px] text-slate-400">Tampil di bawah nama pesantren pada navbar, dan sebagai judul section Visi di beranda.</p>
                        </Field>
                        <Field label="Deskripsi Singkat" badge="Meta / Profil">
                            <textarea name="deskripsi_singkat" rows="2" value={formData.deskripsi_singkat}
                                onChange={handleChange} className={inputCls}
                                placeholder="Deskripsi ringkas untuk keperluan SEO dan halaman profil..." />
                        </Field>
                    </SectionCard>

                    {/* ══════════════════════════════════════════════════════════
                        1. RUNNING TEXT — Bar berjalan di atas hero
                    ══════════════════════════════════════════════════════════ */}
                    <SectionCard
                        icon={Megaphone}
                        title="Teks Berjalan (Running Text)"
                        subtitle="Pengumuman berjalan di bar hijau gelap paling atas, tampil di semua halaman"
                        accent="bg-green-700"
                        saving={saving}
                        onSave={() => saveSection(['running_text'])}
                    >
                        <Field label="Teks Pengumuman" badge="Bar atas">
                            <input type="text" name="running_text" value={formData.running_text}
                                onChange={handleChange} className={inputCls}
                                placeholder="Contoh: Pendaftaran Santri Baru 2026/2027 telah dibuka!" />
                        </Field>
                    </SectionCard>

                    {/* ══════════════════════════════════════════════════════════
                        2. HERO / BANNER UTAMA
                        (Section pertama beranda — judul besar + background image + sosmed sidebar)
                    ══════════════════════════════════════════════════════════ */}
                    <SectionCard
                        icon={LayoutTemplate}
                        title="Hero / Banner Utama"
                        subtitle="Judul besar, deskripsi, gambar latar, dan ikon sosmed yang tampil di banner beranda"
                        accent="bg-blue-600"
                        saving={saving}
                        defaultOpen
                        onSave={() => saveSection(['hero_title', 'hero_subtitle', 'hero_image', 'link_facebook', 'link_instagram', 'link_youtube'])}
                    >
                        <Field label="Judul Hero" badge="Hero">
                            <input type="text" name="hero_title" value={formData.hero_title}
                                onChange={handleChange} className={inputCls}
                                placeholder="Contoh: Pondok Pesantren Al-Hikmatul Furqon" />
                        </Field>
                        <Field label="Deskripsi / Subtitle Hero" badge="Hero">
                            <input type="text" name="hero_subtitle" value={formData.hero_subtitle}
                                onChange={handleChange} className={inputCls}
                                placeholder="Contoh: Mendidik generasi penghafal Al-Qur'an yang cerdas dan berakhlak mulia..." />
                        </Field>
                        <ImageUploadField label="Gambar Latar Belakang Hero" badge="Hero" fieldName="hero_image" previewClass="w-28 h-18" />

                        {/* Social media - also displayed as sidebar icons on hero */}
                        <div className="pt-3 border-t border-slate-100">
                            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">
                                Ikon Media Sosial <span className="font-normal normal-case text-slate-400">(tampil sebagai ikon sidebar di hero)</span>
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Field label="Facebook URL" badge="Hero sidebar">
                                    <input type="url" name="link_facebook" value={formData.link_facebook}
                                        onChange={handleChange} className={inputCls}
                                        placeholder="https://facebook.com/..." />
                                </Field>
                                <Field label="Instagram URL" badge="Hero sidebar">
                                    <input type="url" name="link_instagram" value={formData.link_instagram}
                                        onChange={handleChange} className={inputCls}
                                        placeholder="https://instagram.com/..." />
                                </Field>
                                <Field label="YouTube URL" badge="Hero sidebar">
                                    <input type="url" name="link_youtube" value={formData.link_youtube}
                                        onChange={handleChange} className={inputCls}
                                        placeholder="https://youtube.com/..." />
                                </Field>
                            </div>
                        </div>
                    </SectionCard>

                    {/* ══════════════════════════════════════════════════════════
                        3. SAMBUTAN PIMPINAN — Section 1 beranda
                    ══════════════════════════════════════════════════════════ */}
                    <SectionCard
                        icon={MessageSquare}
                        title="Sambutan Pimpinan"
                        subtitle="Foto, nama, jabatan, dan kutipan sambutan yang tampil di section pertama setelah hero (Section 1)"
                        accent="bg-amber-500"
                        saving={saving}
                        onSave={() => saveSection(['sambutan_pimpinan', 'sambutan_image', 'nama_pimpinan', 'jabatan_pimpinan'])}
                    >
                        <ImageUploadField
                            label="Foto Pimpinan"
                            badge="Section 1 Beranda"
                            fieldName="sambutan_image"
                            previewClass="w-20 h-24"
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <Field label="Nama Pimpinan" badge="Section 1 Beranda">
                                <input type="text" name="nama_pimpinan" value={formData.nama_pimpinan}
                                    onChange={handleChange} className={inputCls}
                                    placeholder="Contoh: KH. Ahmad Dahlan, Lc., M.A." />
                            </Field>
                            <Field label="Jabatan / Gelar" badge="Section 1 Beranda">
                                <input type="text" name="jabatan_pimpinan" value={formData.jabatan_pimpinan}
                                    onChange={handleChange} className={inputCls}
                                    placeholder="Contoh: Pimpinan Pondok Pesantren" />
                            </Field>
                        </div>
                        <Field label="Teks Sambutan" badge="Section 1 Beranda">
                            <textarea name="sambutan_pimpinan" rows="5" value={formData.sambutan_pimpinan}
                                onChange={handleChange} className={inputCls}
                                placeholder="Assalamu'alaikum Warahmatullahi Wabarakatuh. Selamat datang di laman resmi..." />
                            <p className="text-[10px] text-slate-400">Teks ini ditampilkan sebagai kutipan (dalam tanda petik) di card sambutan pimpinan.</p>
                        </Field>
                    </SectionCard>

                    {/* ══════════════════════════════════════════════════════════
                        4. VISI & PILAR — Section 2 beranda
                    ══════════════════════════════════════════════════════════ */}
                    <SectionCard
                        icon={Target}
                        title="Visi & Pilar Utama"
                        subtitle="Judul tagline besar dan visi lembaga yang tampil di section Visi beranda (Section 2)"
                        accent="bg-teal-600"
                        saving={saving}
                        onSave={() => saveSection(['tagline', 'visi', 'misi', 'sejarah_singkat'])}
                    >
                        <Field label="Tagline (Judul section Visi)" badge="Section 2 Beranda">
                            <input type="text" name="tagline" value={formData.tagline}
                                onChange={handleChange} className={inputCls}
                                placeholder="Contoh: Mendidik Generasi Qur'ani & Unggul" />
                            <p className="text-[10px] text-slate-400">Field ini sama dengan Tagline di Navbar — mengubah di sini juga akan mengubah tampilan navbar.</p>
                        </Field>
                        <Field label="Visi Lembaga" badge="Section 2 Beranda & Profil">
                            <textarea name="visi" rows="3" value={formData.visi}
                                onChange={handleChange} className={inputCls}
                                placeholder="Terwujudnya lembaga pendidikan Islam unggulan yang mencetak hafizh/hafizhah mutqin..." />
                        </Field>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <Field label="Misi Lembaga" badge="Profil">
                                <textarea name="misi" rows="4" value={formData.misi}
                                    onChange={handleChange} className={inputCls}
                                    placeholder="Tiap poin misi pisahkan dengan baris baru..." />
                            </Field>
                            <Field label="Sejarah Singkat" badge="Profil">
                                <textarea name="sejarah_singkat" rows="4" value={formData.sejarah_singkat}
                                    onChange={handleChange} className={inputCls}
                                    placeholder="Ceritakan sejarah ringkas berdirinya pondok pesantren..." />
                            </Field>
                        </div>
                    </SectionCard>


                    {/* ══════════════════════════════════════════════════════════
                        6. HUBUNGI KAMI — Section 7 beranda
                    ══════════════════════════════════════════════════════════ */}
                    <SectionCard
                        icon={PhoneCall}
                        title="Hubungi Kami & Kontak"
                        subtitle="Alamat dan WhatsApp Hotline yang tampil di section Hubungi Kami beranda (Section 7) dan halaman Kontak"
                        accent="bg-cyan-600"
                        saving={saving}
                        onSave={() => saveSection(['alamat', 'no_telp', 'no_wa', 'email_kontak'])}
                    >
                        <Field label="Alamat Lengkap Pesantren" badge="Section 7 Beranda & Kontak">
                            <textarea name="alamat" rows="3" value={formData.alamat}
                                onChange={handleChange} className={inputCls}
                                placeholder="Jl. Contoh No. 1, Kecamatan, Kabupaten, Provinsi" />
                        </Field>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <Field label="No. Telepon" badge="Kontak">
                                <input type="text" name="no_telp" value={formData.no_telp}
                                    onChange={handleChange} className={inputCls}
                                    placeholder="(0274) 123456" />
                            </Field>
                            <Field label="WhatsApp Hotline" badge="Section 7 Beranda">
                                <input type="text" name="no_wa" value={formData.no_wa}
                                    onChange={handleChange} className={inputCls}
                                    placeholder="+62 812-3456-7890" />
                            </Field>
                            <Field label="Email Kontak" badge="Kontak">
                                <input type="email" name="email_kontak" value={formData.email_kontak}
                                    onChange={handleChange} className={inputCls}
                                    placeholder="info@pesantren.com" />
                            </Field>
                        </div>
                    </SectionCard>

                    {/* ══════════════════════════════════════════════════════════
                        7. FOOTER — Bagian bawah seluruh halaman
                    ══════════════════════════════════════════════════════════ */}
                    <SectionCard
                        icon={FileText}
                        title="Footer"
                        subtitle="Deskripsi dan hak cipta di bagian bawah seluruh halaman website"
                        accent="bg-slate-600"
                        saving={saving}
                        onSave={() => saveSection(['deskripsi_footer', 'copyright_text'])}
                    >
                        <Field label="Deskripsi Footer" badge="Footer">
                            <textarea name="deskripsi_footer" rows="2" value={formData.deskripsi_footer}
                                onChange={handleChange} className={inputCls}
                                placeholder="Membentuk generasi penghafal Al-Qur'an yang cerdas dan berakhlak mulia..." />
                            <p className="text-[10px] text-slate-400">Jika dikosongkan, akan menggunakan Deskripsi Singkat dari section Navbar.</p>
                        </Field>
                        <Field label="Teks Hak Cipta (Copyright)" badge="Footer">
                            <input type="text" name="copyright_text" value={formData.copyright_text}
                                onChange={handleChange} className={inputCls}
                                placeholder="Contoh: © 2026 Pondok Pesantren Al-Hikmatul Furqon. All rights reserved." />
                            <p className="text-[10px] text-slate-400">Jika sudah mengandung simbol ©, sistem tidak akan menambahkan duplikasi.</p>
                        </Field>
                    </SectionCard>

                    </>
                )}
            </main>
        </>
    );
}
