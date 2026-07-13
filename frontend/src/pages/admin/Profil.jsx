import { useEffect, useState } from "react";
import api from "../../api/axios";
import {
    Save, Loader2, Target, CheckCircle2, AlertCircle, ChevronDown, Upload, ScrollText, Users, Landmark, Eye, ListChecks, Plus, Trash2, Shield, Award, BarChart3, ArrowUp, ArrowDown
} from "lucide-react";
import PageHeader from "../../components/admin/PageHeader";
import LoadingState from "../../components/admin/LoadingState";
import { useImageUpload } from "../../hooks/useImageUpload";

const inputCls = "w-full border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 bg-slate-50/50 hover:bg-slate-50 focus:bg-white transition-all placeholder-slate-400";
const labelCls = "text-[11px] sm:text-xs font-bold text-slate-700 flex items-center gap-2";

const defaultTimeline = [
    {
        year: 'Tahun 2012',
        title: 'Awal Mula Perjalanan',
        desc: "Didirikan oleh K.H. Ahmad Dahlan, bermula dari sebuah mushola kecil dengan beberapa santri yang memiliki tekad kuat mendalami Al-Qur'an secara intensif.",
        details: [
            "Dimulai dengan 5 santri mukim di pondokan bambu sederhana.",
            "K.H. Ahmad Dahlan bertindak langsung sebagai pengajar utama tahfidz.",
            "Fokus pembelajaran awal pada pemantapan makhraj and tajwid hafalan."
        ]
    },
    {
        year: 'Pertumbuhan & Kemitraan',
        title: 'Membangun Kepercayaan & Kredibilitas',
        desc: "Dedikasi dalam memberikan pendidikan berkualitas melahirkan reputasi positif di mata wali santri. Melalui kerja sama erat pengurus dan donatur, fasilitas asrama pertama berhasil dibangun demi kenyamanan santri.",
        details: [
            "Mendapatkan izin operasional resmi Madrasah Tsanawiyah (MTs).",
            "Penerimaan wakaf tanah seluas 1 hektar untuk pembangunan asrama terpadu.",
            "Mengembangkan program kemitraan pengajar dengan alumni Universitas Timur Tengah."
        ]
    },
    {
        year: 'Kondisi Saat Ini',
        title: 'Lembaga Pendidikan Formal & Pesantren Terpadu',
        desc: "Kini menaungi jenjang Madrasah Ibtidaiyah (MI), Madrasah Tsanawiyah (MTs), dan Madrasah Aliyah (MA) terakreditasi unggul. Dilengkapi kompleks asrama representatif serta laboratorium terintegrasi guna mendukung program Tahfidz dan Sains.",
        details: [
            "Telah meluluskan lebih dari 250 santri penghafal Al-Qur'an 30 juz mutqin.",
            "Meraih predikat Akreditasi A (Unggul) secara nasional pada semua jenjang formal.",
            "Menyediakan beasiswa studi lanjut ke universitas terkemuka di Mesir, Madinah, dan PTN."
        ]
    }
];

function Badge({ label }) {
    return (
        <span className="inline-block text-[9px] font-bold uppercase tracking-wide bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-md px-1.5 py-0.5">
            {label}
        </span>
    );
}

function Field({ label, badge, hint, required, children }) {
    return (
        <div className="flex flex-col space-y-1.5">
            <label className={labelCls}>
                {label} {required && <span className="text-rose-500">*</span>}
                {badge && <Badge label={badge} />}
            </label>
            {children}
            {hint && <p className="text-[10px] text-slate-400 leading-snug">{hint}</p>}
        </div>
    );
}

function SectionToast({ state }) {
    if (!state) return null;
    if (state === "saving") return (
        <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-medium animate-pulse">
            <Loader2 size={13} className="animate-spin" /> Menyimpan...
        </span>
    );
    if (state === "ok") return (
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

function SectionCard({ icon: Icon, title, subtitle, accent = "bg-emerald-600", children, onSave, saving, defaultOpen = false }) {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const [toast, setToast] = useState(null);

    const handleSave = async () => {
        setToast("saving");
        const ok = await onSave();
        setToast(ok ? "ok" : "error");
        setTimeout(() => setToast(null), 3500);
    };

    return (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className={`h-1 ${accent} w-full`} />
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
                    className={`text-slate-400 group-hover:text-slate-600 transition-transform duration-300 shrink-0 ml-4 ${isOpen ? "rotate-180" : "rotate-0"}`}
                />
            </button>
            <div
                className="overflow-hidden transition-all duration-400 ease-in-out"
                style={{ maxHeight: isOpen ? "4000px" : "0px", opacity: isOpen ? 1 : 0 }}
            >
                <div className="px-5 sm:px-8 pb-7 border-t border-slate-100">
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

export default function AdminProfil() {
    const [formData, setFormData] = useState({
        nama_pesantren: "",
        sejarah_singkat: "",
        visi: "",
        misi: "",
        sambutan_pimpinan: "",
        sambutan_image: "",
        nama_pimpinan: "",
        jabatan_pimpinan: "",
        stats_tahun: "",
        stats_santri: "",
        stats_alumni: "",
        stats_asatidzah: "",
        nilai_1_title: "",
        nilai_1_desc: "",
        nilai_2_title: "",
        nilai_2_desc: "",
        nilai_3_title: "",
        nilai_3_desc: "",
        timeline_json: "",
    });

    const [timelineList, setTimelineList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [globalError, setGlobalError] = useState("");
    const { uploadImage, uploading: uploadingImage } = useImageUpload();

    const getImageUrl = (path) => {
        if (!path) return "";
        if (path.startsWith("http")) return path;
        return `http://pesantren-api.test${path}`;
    };

    const handleUpload = async (e, fieldName) => {
        const file = e.target.files[0];
        if (!file) return;
        const path = await uploadImage(file);
        if (path) setFormData(prev => ({ ...prev, [fieldName]: path }));
    };

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            try {
                const res = await api.get("/admin/settings");
                const d = res.data || {};
                setFormData({
                    nama_pesantren:    d.nama_pesantren    || "",
                    sejarah_singkat:   d.sejarah_singkat   || "",
                    visi:              d.visi              || "",
                    misi:              d.misi              || "",
                    sambutan_pimpinan: d.sambutan_pimpinan || "",
                    sambutan_image:    d.sambutan_image    || "",
                    nama_pimpinan:     d.nama_pimpinan     || "",
                    jabatan_pimpinan:  d.jabatan_pimpinan  || "",
                    stats_tahun:       d.stats_tahun       || "",
                    stats_santri:      d.stats_santri      || "",
                    stats_alumni:      d.stats_alumni      || "",
                    stats_asatidzah:   d.stats_asatidzah   || "",
                    nilai_1_title:     d.nilai_1_title     || "",
                    nilai_1_desc:      d.nilai_1_desc      || "",
                    nilai_2_title:     d.nilai_2_title     || "",
                    nilai_2_desc:      d.nilai_2_desc      || "",
                    nilai_3_title:     d.nilai_3_title     || "",
                    nilai_3_desc:      d.nilai_3_desc      || "",
                    timeline_json:     d.timeline_json     || "",
                });

                if (d.timeline_json) {
                    try {
                        setTimelineList(JSON.parse(d.timeline_json));
                    } catch (e) {
                        setTimelineList(defaultTimeline);
                    }
                } else {
                    setTimelineList(defaultTimeline);
                }
            } catch (err) {
                console.error(err);
                setGlobalError("Gagal memuat data profil.");
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const saveSection = async (keys) => {
        setSaving(true);
        try {
            const payload = {};
            keys.forEach(k => { if (formData[k] !== undefined) payload[k] = formData[k]; });
            
            if (keys.includes("timeline_json")) {
                payload["timeline_json"] = JSON.stringify(timelineList);
            }

            await api.put("/admin/settings", payload);
            return true;
        } catch (err) {
            console.error("Save error:", err.response?.data);
            return false;
        } finally {
            setSaving(false);
        }
    };

    const updateTimelineField = (index, fieldName, value) => {
        setTimelineList(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [fieldName]: value };
            return updated;
        });
    };

    const addTimelineDetail = (nodeIndex) => {
        setTimelineList(prev => {
            const updated = [...prev];
            const node = { ...updated[nodeIndex] };
            node.details = [...(node.details || []), ""];
            updated[nodeIndex] = node;
            return updated;
        });
    };

    const updateTimelineDetail = (nodeIndex, detailIndex, value) => {
        setTimelineList(prev => {
            const updated = [...prev];
            const node = { ...updated[nodeIndex] };
            const details = [...(node.details || [])];
            details[detailIndex] = value;
            node.details = details;
            updated[nodeIndex] = node;
            return updated;
        });
    };

    const removeTimelineDetail = (nodeIndex, detailIndex) => {
        setTimelineList(prev => {
            const updated = [...prev];
            const node = { ...updated[nodeIndex] };
            const details = [...(node.details || [])];
            details.splice(detailIndex, 1);
            node.details = details;
            updated[nodeIndex] = node;
            return updated;
        });
    };

    const removeTimelineNode = (index) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus milestone ini?")) {
            setTimelineList(prev => prev.filter((_, i) => i !== index));
        }
    };

    const addTimelineNode = () => {
        setTimelineList(prev => [
            ...prev,
            {
                year: "Tahun Baru",
                title: "Judul Milestone Baru",
                desc: "Deskripsi singkat tentang pencapaian di tahun ini...",
                details: ["Poin detail 1"]
            }
        ]);
    };

    const moveTimelineNode = (index, direction) => {
        setTimelineList(prev => {
            const list = [...prev];
            const targetIndex = index + direction;
            if (targetIndex < 0 || targetIndex >= list.length) return prev;
            const temp = list[index];
            list[index] = list[targetIndex];
            list[targetIndex] = temp;
            return list;
        });
    };

    const ImageUploadField = ({ label, badge, fieldName, hint }) => (
        <Field label={label} badge={badge} hint={hint}>
            <div className="flex items-center gap-4">
                {formData[fieldName] ? (
                    <div className="w-20 h-24 rounded-xl overflow-hidden border border-slate-200 shrink-0 bg-slate-50 flex items-center justify-center relative group">
                        <img src={getImageUrl(formData[fieldName])} alt={label} className="w-full h-full object-cover" />
                        <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, [fieldName]: '' }))}
                            className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Hapus gambar"
                        >
                            <div className="p-2 bg-rose-500 rounded-full text-white">
                                <Trash2 size={14} />
                            </div>
                        </button>
                    </div>
                ) : (
                    <div className="w-20 h-24 rounded-xl border border-dashed border-slate-200 shrink-0 bg-slate-50 flex flex-col items-center justify-center text-slate-400 gap-1.5">
                        <Upload className="w-5 h-5" />
                        <span className="text-[9px] font-medium">Belum ada foto</span>
                    </div>
                )}
                <label className="flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs cursor-pointer transition select-none bg-white shadow-xs">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingImage ? "Mengunggah..." : "Pilih Foto"}</span>
                    <input type="file" accept="image/*" onChange={e => handleUpload(e, fieldName)} className="hidden" disabled={uploadingImage} />
                </label>
            </div>
        </Field>
    );

    return (
        <>
            <PageHeader title="Kelola Halaman Profil" />
            <main className="flex-grow p-4 sm:p-6 md:p-8 overflow-y-auto max-w-4xl w-full mx-auto space-y-4">
                {globalError && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl text-xs font-semibold flex items-center gap-2">
                        <AlertCircle size={14} /> {globalError}
                    </div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-2xl px-5 py-3.5 flex items-start gap-3 text-xs text-blue-700">
                    <Eye size={15} className="shrink-0 mt-0.5" />
                    <p>
                        Perubahan di halaman ini akan langsung tampil di{" "}
                        <a href="/profil" target="_blank" rel="noopener noreferrer" className="font-bold underline hover:text-blue-900">
                            Halaman Profil Publik ↗
                        </a>
                        . Klik kartu untuk membuka, edit isi, lalu klik <strong>"Simpan Section Ini"</strong>.
                    </p>
                </div>

                {loading ? (
                    <LoadingState message="Memuat data profil..." />
                ) : (
                    <>
                        {/* 1. SEJARAH SINGKAT */}
                        <SectionCard
                            icon={ScrollText}
                            title="Sejarah Singkat"
                            subtitle="Narasi singkat sejarah berdirinya pesantren yang tampil di bagian atas halaman Profil"
                            accent="bg-amber-600"
                            saving={saving}
                            onSave={() => saveSection(["sejarah_singkat"])}
                        >
                            <Field label="Teks Sejarah Singkat" badge="Halaman Profil" hint="Ceritakan sejarah ringkas pendirian pesantren. Teks ini tampil langsung di bawah judul 'Profil & Sejarah Singkat'.">
                                <textarea name="sejarah_singkat" rows="7" value={formData.sejarah_singkat} onChange={handleChange} className={inputCls + " resize-y leading-relaxed"} placeholder="Contoh: Pondok Pesantren Al-Qur'anul Karim berdiri pada tahun 2012, diprakarsai oleh KH. Ahmad Dahlan..." />
                            </Field>
                            <p className="text-[10px] text-slate-400 text-right">{formData.sejarah_singkat.length} karakter</p>
                        </SectionCard>

                        {/* 3. HISTORI & MILESTONE TIMELINE */}
                        <SectionCard
                            icon={ScrollText}
                            title="Timeline Sejarah Pesantren"
                            subtitle="Garis waktu sejarah perkembangan dan pencapaian pesantren dari tahun ke tahun"
                            accent="bg-orange-600"
                            saving={saving}
                            onSave={() => saveSection(["timeline_json"])}
                        >
                            <div className="space-y-6">
                                {timelineList.map((node, index) => (
                                    <div key={index} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 relative group">
                                        <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-2">
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Milestone #{index + 1}</span>
                                            <div className="flex items-center gap-2">
                                                <button type="button" onClick={() => moveTimelineNode(index, -1)} disabled={index === 0} className="p-1.5 bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-40 rounded-lg text-slate-600 cursor-pointer">
                                                    <ArrowUp className="w-3.5 h-3.5" />
                                                </button>
                                                <button type="button" onClick={() => moveTimelineNode(index, 1)} disabled={index === timelineList.length - 1} className="p-1.5 bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-40 rounded-lg text-slate-600 cursor-pointer">
                                                    <ArrowDown className="w-3.5 h-3.5" />
                                                </button>
                                                <button type="button" onClick={() => removeTimelineNode(index)} className="p-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg text-rose-600 cursor-pointer">
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="md:col-span-1">
                                                <label className="text-[10px] font-bold text-slate-500 uppercase">Tahun / Periode</label>
                                                <input type="text" value={node.year} onChange={(e) => updateTimelineField(index, "year", e.target.value)} className={inputCls + " py-2 px-3 mt-1"} placeholder="Contoh: Tahun 2012" />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="text-[10px] font-bold text-slate-500 uppercase">Judul Milestone</label>
                                                <input type="text" value={node.title} onChange={(e) => updateTimelineField(index, "title", e.target.value)} className={inputCls + " py-2 px-3 mt-1"} placeholder="Contoh: Awal Mula Perjalanan" />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-[10px] font-bold text-slate-500 uppercase">Deskripsi Narasi</label>
                                            <textarea rows="3" value={node.desc} onChange={(e) => updateTimelineField(index, "desc", e.target.value)} className={inputCls + " py-2.5 px-3 mt-1 resize-y"} placeholder="Jelaskan secara ringkas pencapaian di era/tahun ini..." />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-slate-500 uppercase block">Poin Detail Milestones</label>
                                            <div className="space-y-1.5">
                                                {node.details && node.details.map((detail, dIdx) => (
                                                    <div key={dIdx} className="flex items-center gap-2">
                                                        <span className="w-1.5 h-1.5 bg-brand-gold-main rounded-full shrink-0" />
                                                        <input type="text" value={detail} onChange={(e) => updateTimelineDetail(index, dIdx, e.target.value)} className={inputCls + " py-1.5 px-3"} placeholder="Masukkan satu poin detail sejarah..." />
                                                        <button type="button" onClick={() => removeTimelineDetail(index, dIdx)} className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer bg-transparent border-none">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                            <button type="button" onClick={() => addTimelineDetail(index)} className="mt-2 text-[10px] font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1 cursor-pointer bg-transparent border-none p-0">
                                                <Plus className="w-3.5 h-3.5" /> Tambah Poin Detail
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                <button type="button" onClick={addTimelineNode} className="w-full py-3 bg-white border border-dashed border-slate-300 hover:border-emerald-500 hover:bg-slate-50 text-slate-500 hover:text-emerald-700 text-xs font-bold rounded-2xl flex items-center justify-center gap-1.5 transition cursor-pointer">
                                    <Plus className="w-4 h-4" /> Tambah Milestone Sejarah Baru
                                </button>
                            </div>
                        </SectionCard>

                        {/* 4. STATISTIK ANGKA */}
                        <SectionCard
                            icon={BarChart3}
                            title="Statistik Profil Pesantren"
                            subtitle="Jumlah statistik penting (Tahun, Santri, Alumni, Asatidzah) yang tampil di halaman Profil"
                            accent="bg-blue-600"
                            saving={saving}
                            onSave={() => saveSection(["stats_tahun", "stats_santri", "stats_alumni", "stats_asatidzah"])}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <Field label="Santri Aktif" required hint="Contoh: 500+">
                                    <input type="text" name="stats_santri" value={formData.stats_santri} onChange={handleChange} className={inputCls} placeholder="500+" />
                                </Field>
                                <Field label="Ustadz & Ustadzah" required hint="Contoh: 40+">
                                    <input type="text" name="stats_asatidzah" value={formData.stats_asatidzah} onChange={handleChange} className={inputCls} placeholder="40+" />
                                </Field>
                                <Field label="Alumni Tahfidz" required hint="Contoh: 250+">
                                    <input type="text" name="stats_alumni" value={formData.stats_alumni} onChange={handleChange} className={inputCls} placeholder="250+" />
                                </Field>
                                <Field label="Tahun Mengabdi" required hint="Contoh: 10+">
                                    <input type="text" name="stats_tahun" value={formData.stats_tahun} onChange={handleChange} className={inputCls} placeholder="10+" />
                                </Field>
                            </div>
                        </SectionCard>

                        {/* 5. VISI LEMBAGA */}
                        <SectionCard
                            icon={Target}
                            title="Visi Lembaga"
                            subtitle='Pernyataan visi yang tampil di card "Visi Pesantren" pada halaman Profil'
                            accent="bg-teal-600"
                            saving={saving}
                            onSave={() => saveSection(["visi"])}
                        >
                            <Field label="Pernyataan Visi" badge="Profil & Beranda" hint='Teks ini akan ditampilkan dalam tanda kutip ("...") pada card Visi.'>
                                <textarea name="visi" rows="4" value={formData.visi} onChange={handleChange} className={inputCls + " resize-y leading-relaxed"} placeholder="Contoh: Terwujudnya lembaga pendidikan Islam unggulan yang mencetak hafizh/hafizhah mutqin..." />
                            </Field>
                            {formData.visi && (
                                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Preview di halaman publik:</p>
                                    <p className="font-serif text-sm italic text-emerald-800 border-l-2 border-slate-300 pl-3 leading-relaxed">"{formData.visi}"</p>
                                </div>
                            )}
                        </SectionCard>

                        {/* 6. MISI LEMBAGA */}
                        <SectionCard
                            icon={ListChecks}
                            title="Misi Lembaga"
                            subtitle="Poin-poin misi yang tampil sebagai daftar di card Misi pada halaman Profil"
                            accent="bg-indigo-600"
                            saving={saving}
                            onSave={() => saveSection(["misi"])}
                        >
                            <Field label="Poin-Poin Misi" badge="Halaman Profil" hint="Tulis setiap poin misi pada baris baru (tekan Enter untuk pindah baris). Setiap baris akan menjadi satu poin dengan ikon centang.">
                                <textarea name="misi" rows="8" value={formData.misi} onChange={handleChange} className={inputCls + " resize-y leading-relaxed"} placeholder={"Menyelenggarakan program Tahfidzul Qur'an yang terstruktur.\nMembekali santri dengan pemahaman kitab kuning klasik.\nMenanamkan nilai-nilai akhlakul karimah dalam asrama.\nMengintegrasikan ilmu agama dengan sains dan teknologi."} />
                            </Field>
                            {formData.misi && (
                                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Preview di halaman publik:</p>
                                    {formData.misi.split("\n").filter(Boolean).map((line, idx) => (
                                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                                            <CheckCircle2 size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                                            <span>{line}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </SectionCard>

                        {/* 7. NILAI-NILAI KARAKTER UTAMA */}
                        <SectionCard
                            icon={Award}
                            title="Nilai-Nilai Karakter Utama"
                            subtitle="Mengedit judul dan konten penjelasan untuk 3 kartu Nilai Karakter di bagian bawah halaman Profil"
                            accent="bg-violet-600"
                            saving={saving}
                            onSave={() => saveSection([
                                "nilai_1_title", "nilai_1_desc",
                                "nilai_2_title", "nilai_2_desc",
                                "nilai_3_title", "nilai_3_desc"
                            ])}
                        >
                            <div className="space-y-5">
                                <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-3">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Kartu Nilai 1</span>
                                    <Field label="Judul Nilai 1">
                                        <input type="text" name="nilai_1_title" value={formData.nilai_1_title} onChange={handleChange} className={inputCls + " py-2 px-3"} placeholder="Integritas (Amanah)" />
                                    </Field>
                                    <Field label="Deskripsi Nilai 1">
                                        <textarea rows="2" name="nilai_1_desc" value={formData.nilai_1_desc} onChange={handleChange} className={inputCls + " py-2 px-3 resize-y"} placeholder="Menjunjung tinggi kejujuran, keadilan, dan keselarasan ucapan dengan perbuatan..." />
                                    </Field>
                                </div>

                                <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-3">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Kartu Nilai 2</span>
                                    <Field label="Judul Nilai 2">
                                        <input type="text" name="nilai_2_title" value={formData.nilai_2_title} onChange={handleChange} className={inputCls + " py-2 px-3"} placeholder="Ukhuwah (Kebersamaan)" />
                                    </Field>
                                    <Field label="Deskripsi Nilai 2">
                                        <textarea rows="2" name="nilai_2_desc" value={formData.nilai_2_desc} onChange={handleChange} className={inputCls + " py-2 px-3 resize-y"} placeholder="Membina persaudaraan yang erat di antara santri, asatidzah, orang tua, dan masyarakat..." />
                                    </Field>
                                </div>

                                <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-3">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Kartu Nilai 3</span>
                                    <Field label="Judul Nilai 3">
                                        <input type="text" name="nilai_3_title" value={formData.nilai_3_title} onChange={handleChange} className={inputCls + " py-2 px-3"} placeholder="Disiplin & Mandiri" />
                                    </Field>
                                    <Field label="Deskripsi Nilai 3">
                                        <textarea rows="2" name="nilai_3_desc" value={formData.nilai_3_desc} onChange={handleChange} className={inputCls + " py-2 px-3 resize-y"} placeholder="Membiasakan hidup teratur, bertanggung jawab atas perbuatan pribadi..." />
                                    </Field>
                                </div>
                            </div>
                        </SectionCard>
                    </>
                )}
            </main>
        </>
    );
}
