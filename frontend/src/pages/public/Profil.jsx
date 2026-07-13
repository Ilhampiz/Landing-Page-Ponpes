import { useState, useEffect } from 'react';
import { Compass, BookOpen, CheckCircle2, Award, Users, Shield, Calendar, GraduationCap } from 'lucide-react';
import ScrollReveal from "../../components/ScrollReveal";
import api from '../../api/axios';

export default function Profil() {
    const [activeEra, setActiveEra] = useState(null);
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState({
        sejarah_singkat: '',
        visi: '',
        misi: '',
        nama_pesantren: '',
        stats_tahun: '',
        stats_santri: '',
        stats_alumni: '',
        stats_asatidzah: '',
        nilai_1_title: '',
        nilai_1_desc: '',
        nilai_2_title: '',
        nilai_2_desc: '',
        nilai_3_title: '',
        nilai_3_desc: '',
        timeline_json: '',
    });

    useEffect(() => {
        const fetchSettings = async () => {
            setLoading(true);
            try {
                const res = await api.get('/settings');
                if (res.data) {
                    setSettings({
                        sejarah_singkat: res.data.sejarah_singkat || '',
                        visi: res.data.visi || '',
                        misi: res.data.misi || '',
                        nama_pesantren: res.data.nama_pesantren || '',
                        stats_tahun: res.data.stats_tahun || '',
                        stats_santri: res.data.stats_santri || '',
                        stats_alumni: res.data.stats_alumni || '',
                        stats_asatidzah: res.data.stats_asatidzah || '',
                        nilai_1_title: res.data.nilai_1_title || '',
                        nilai_1_desc: res.data.nilai_1_desc || '',
                        nilai_2_title: res.data.nilai_2_title || '',
                        nilai_2_desc: res.data.nilai_2_desc || '',
                        nilai_3_title: res.data.nilai_3_title || '',
                        nilai_3_desc: res.data.nilai_3_desc || '',
                        timeline_json: res.data.timeline_json || '',
                    });
                }
            } catch (err) {
                console.error('Error loading settings on profile:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    let timeline = [];
    if (settings.timeline_json) {
        try {
            timeline = JSON.parse(settings.timeline_json);
        } catch (e) {
            console.error('Failed to parse timeline JSON.', e);
        }
    }

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col items-center justify-center min-h-[450px]">
                <div className="w-10 h-10 border-4 border-slate-200 border-t-brand-green-main rounded-full animate-spin" />
                <p className="mt-4 text-text-body text-sm font-medium">Memuat profil pesantren...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
            {/* Sejarah Section */}
            <div className="text-center mb-16">
                <span className="text-brand-green-main font-sans font-bold uppercase tracking-widest text-xs block mb-2">Sejarah</span>
                <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-text-title">
                    Profil & Sejarah Singkat
                </h2>
                <div className="w-12 h-[3px] bg-brand-gold-main mx-auto mt-4 rounded-full" />
            </div>

            {settings.sejarah_singkat ? (
                <div className="max-w-4xl mx-auto mb-16 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm leading-relaxed text-sm sm:text-base text-text-body font-sans whitespace-pre-line">
                    {settings.sejarah_singkat}
                </div>
            ) : (
                <div className="max-w-4xl mx-auto mb-16 bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm text-center text-sm sm:text-base text-slate-400 font-sans italic">
                    Informasi sejarah singkat belum ditambahkan oleh admin.
                </div>
            )}

            {/* Timeline Accordion */}
            <div className="mb-20 max-w-4xl mx-auto">
                {timeline.length === 0 ? (
                    <div className="p-12 text-center bg-slate-50 rounded-3xl border border-slate-100 text-slate-400 text-sm italic">
                        Riwayat perjalanan pesantren belum tersedia.
                    </div>
                ) : (
                    <div className="relative border-l border-brand-green-main/30 ml-4 md:ml-8 space-y-12 py-4">
                        {timeline.map((node, index) => (
                        <div key={index} className="relative pl-8 md:pl-12 group">
                            <ScrollReveal>
                                {/* Timeline Bullet */}
                                <div className="absolute top-1.5 left-[-9px] w-[18px] h-[18px] rounded-full bg-white border-4 border-brand-green-main transition-all duration-300 group-hover:bg-brand-gold-main group-hover:scale-110 shadow-sm" />
                                <div className="flex flex-col items-start bg-white p-6 rounded-2xl border border-slate-100/50 shadow-sm hover:shadow-premium transition-shadow duration-300 w-full">
                                    <span className="font-sans text-[10px] md:text-xs font-bold uppercase tracking-wider text-brand-gold-main bg-brand-gold-light px-3.5 py-1 rounded-full shadow-sm w-fit">
                                        {node.year}
                                    </span>
                                    <h3 className="font-serif text-lg md:text-xl font-bold text-text-title mt-4 mb-2">
                                        {node.title}
                                    </h3>
                                    <p className="font-sans text-sm md:text-base text-text-body leading-relaxed mb-3">
                                        {node.desc}
                                    </p>

                                    {/* Timeline Accordion Toggle */}
                                    <button
                                        onClick={() => setActiveEra(activeEra === index ? null : index)}
                                        className="font-sans text-xs font-bold text-brand-green-main hover:text-brand-green-dark hover:underline flex items-center gap-1 focus:outline-none cursor-pointer bg-transparent border-none p-0 mt-1"
                                    >
                                        <span>{activeEra === index ? 'Tutup Detail' : 'Lihat Detail Sejarah'}</span>
                                        <span className="text-[10px]">{activeEra === index ? '▲' : '▼'}</span>
                                    </button>

                                    {/* Accordion Content */}
                                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${activeEra === index ? 'max-h-48 opacity-100 mt-3' : 'max-h-0 opacity-0 pointer-events-none'
                                        }`}>
                                        <ul className="list-none p-0 m-0 space-y-2.5 border-l-2 border-brand-gold-main/40 pl-4 py-1">
                                            {Array.isArray(node.details) && node.details.map((detail, dIdx) => (
                                                <li key={dIdx} className="font-sans text-xs md:text-sm text-text-body flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-brand-gold-main shrink-0" />
                                                    {detail}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </ScrollReveal>
                        </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 mb-20 max-w-4xl mx-auto">
                <ScrollReveal delay={0}>
                    <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200/60 shadow-lg flex flex-col items-center text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full">
                        <div className="p-2.5 rounded-xl shrink-0 text-brand-green-main bg-brand-green-light shadow-sm transition-transform duration-300 hover:scale-105 mb-3">
                            <GraduationCap className="w-5.5 h-5.5" />
                        </div>
                        <span className="font-sans text-2xl md:text-3xl font-extrabold text-brand-green-dark tracking-tight leading-none block">
                            {settings.stats_santri || '500+'}
                        </span>
                        <span className="font-sans text-[10px] md:text-xs font-semibold text-slate-500 mt-2 uppercase tracking-wider block">
                            Santri Aktif
                        </span>
                    </div>
                </ScrollReveal>
                <ScrollReveal delay={100}>
                    <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200/60 shadow-lg flex flex-col items-center text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full">
                        <div className="p-2.5 rounded-xl shrink-0 text-brand-gold-main bg-brand-gold-light shadow-sm transition-transform duration-300 hover:scale-105 mb-3">
                            <Users className="w-5.5 h-5.5" />
                        </div>
                        <span className="font-sans text-2xl md:text-3xl font-extrabold text-brand-green-dark tracking-tight leading-none block">
                            {settings.stats_asatidzah || '40+'}
                        </span>
                        <span className="font-sans text-[10px] md:text-xs font-semibold text-slate-500 mt-2 uppercase tracking-wider block">
                            Ustadz & Ustadzah
                        </span>
                    </div>
                </ScrollReveal>
                <ScrollReveal delay={200}>
                    <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200/60 shadow-lg flex flex-col items-center text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full">
                        <div className="p-2.5 rounded-xl shrink-0 text-brand-green-main bg-brand-green-light shadow-sm transition-transform duration-300 hover:scale-105 mb-3">
                            <BookOpen className="w-5.5 h-5.5" />
                        </div>
                        <span className="font-sans text-2xl md:text-3xl font-extrabold text-brand-green-dark tracking-tight leading-none block">
                            {settings.stats_alumni || '250+'}
                        </span>
                        <span className="font-sans text-[10px] md:text-xs font-semibold text-slate-500 mt-2 uppercase tracking-wider block">
                            Alumni Tahfidz
                        </span>
                    </div>
                </ScrollReveal>
                <ScrollReveal delay={300}>
                    <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200/60 shadow-lg flex flex-col items-center text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full">
                        <div className="p-2.5 rounded-xl shrink-0 text-brand-gold-main bg-brand-gold-light shadow-sm transition-transform duration-300 hover:scale-105 mb-3">
                            <Calendar className="w-5.5 h-5.5" />
                        </div>
                        <span className="font-sans text-2xl md:text-3xl font-extrabold text-brand-green-dark tracking-tight leading-none block">
                            {settings.stats_tahun || '10+'}
                        </span>
                        <span className="font-sans text-[10px] md:text-xs font-semibold text-slate-500 mt-2 uppercase tracking-wider block">
                            Tahun Mengabdi
                        </span>
                    </div>
                </ScrollReveal>
            </div>

            {/* Visi & Misi Section */}
            <div className="border-t border-slate-100 bg-slate-50/50 p-6 sm:p-8 md:p-12 rounded-3xl mb-20 shadow-inner max-w-5xl mx-auto">
                <ScrollReveal>
                    <div className="text-center mb-12">
                        <span className="text-brand-green-main font-sans font-bold uppercase tracking-widest text-xs block mb-2">Komitmen</span>
                        <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-text-title">
                            Visi & Misi Lembaga
                        </h2>
                        <div className="w-12 h-[2.5px] bg-brand-gold-main mx-auto mt-3 rounded-full" />
                    </div>
                </ScrollReveal>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Card Visi */}
                    <ScrollReveal>
                        <div className="group relative bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-premium hover:-translate-y-1 transition-all duration-300 overflow-hidden h-full">
                            <div className="absolute top-0 left-0 right-0 h-[3px] bg-brand-gold-main scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

                            <div className="flex items-center gap-3.5 mb-6">
                                <div className="p-3 bg-brand-green-light text-brand-green-main rounded-xl shadow-sm">
                                    <Compass size={24} />
                                </div>
                                <h3 className="font-serif text-xl font-bold text-text-title">Visi Pesantren</h3>
                            </div>
                            <div>
                                {settings.visi ? (
                                    <p className="font-serif text-base italic text-brand-green-dark border-l-2 border-slate-200 pl-4 py-1 leading-relaxed">
                                        "{settings.visi}"
                                    </p>
                                ) : (
                                    <p className="font-sans text-sm text-slate-400 italic">
                                        Visi pesantren belum ditambahkan oleh admin.
                                    </p>
                                )}
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* Card Misi */}
                    <ScrollReveal delay={150}>
                        <div className="group relative bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-premium hover:-translate-y-1 transition-all duration-300 overflow-hidden h-full">
                            <div className="absolute top-0 left-0 right-0 h-[3px] bg-brand-gold-main scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

                            <div className="flex items-center gap-3.5 mb-6">
                                <div className="p-3 bg-brand-green-light text-brand-green-main rounded-xl shadow-sm">
                                    <BookOpen size={24} />
                                </div>
                                <h3 className="font-serif text-xl font-bold text-text-title">Misi Pesantren</h3>
                            </div>
                            {settings.misi ? (
                                <ul className="list-none p-0 m-0 space-y-4">
                                    {settings.misi.split('\n').filter(Boolean).map((line, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-sm text-text-body leading-relaxed">
                                            <CheckCircle2 size={16} className="text-brand-green-main shrink-0 mt-0.5" />
                                            <span>{line}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="font-sans text-sm text-slate-400 italic">
                                    Misi pesantren belum ditambahkan oleh admin.
                                </p>
                            )}
                        </div>
                    </ScrollReveal>
                </div>
            </div>

            {/* Nilai-Nilai Pesantren */}
            <div className="max-w-5xl mx-auto">
                <ScrollReveal>
                    <div className="text-center mb-12">
                        <span className="text-brand-green-main font-sans font-bold uppercase tracking-widest text-xs block mb-2">Nilai Utama</span>
                        <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-text-title">
                            Nilai-Nilai Karakter Mulia
                        </h2>
                        <div className="w-12 h-[2.5px] bg-brand-gold-main mx-auto mt-3 rounded-full" />
                    </div>
                </ScrollReveal>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <ScrollReveal delay={0}>
                        <div className="bg-white border border-slate-100 p-8 rounded-3xl text-center shadow-sm hover:shadow-premium hover:-translate-y-0.5 transition-all duration-300 h-full">
                            <div className="p-3 bg-brand-green-light text-brand-green-main rounded-2xl w-fit mx-auto mb-5 shadow-sm">
                                <Award size={28} />
                            </div>
                            <h4 className="font-serif text-lg font-bold text-text-title mb-2.5">
                                {settings.nilai_1_title || 'Integritas (Amanah)'}
                            </h4>
                            <p className="font-sans text-sm text-text-body leading-relaxed m-0">
                                {settings.nilai_1_desc || 'Menjunjung tinggi kejujuran, keadilan, dan keselarasan ucapan dengan perbuatan dalam setiap aspek kehidupan.'}
                            </p>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal delay={150}>
                        <div className="bg-white border border-slate-100 p-8 rounded-3xl text-center shadow-sm hover:shadow-premium hover:-translate-y-0.5 transition-all duration-300 h-full">
                            <div className="p-3 bg-brand-green-light text-brand-green-main rounded-2xl w-fit mx-auto mb-5 shadow-sm">
                                <Users size={28} />
                            </div>
                            <h4 className="font-serif text-lg font-bold text-text-title mb-2.5">
                                {settings.nilai_2_title || 'Ukhuwah (Kebersamaan)'}
                            </h4>
                            <p className="font-sans text-sm text-text-body leading-relaxed m-0">
                                {settings.nilai_2_desc || 'Membina persaudaraan yang erat di antara santri, asatidzah, orang tua, dan masyarakat luas dalam bingkai toleransi.'}
                            </p>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal delay={300}>
                        <div className="bg-white border border-slate-100 p-8 rounded-3xl text-center shadow-sm hover:shadow-premium hover:-translate-y-0.5 transition-all duration-300 h-full">
                            <div className="p-3 bg-brand-green-light text-brand-green-main rounded-2xl w-fit mx-auto mb-5 shadow-sm">
                                <Shield size={28} />
                            </div>
                            <h4 className="font-serif text-lg font-bold text-text-title mb-2.5">
                                {settings.nilai_3_title || 'Disiplin & Mandiri'}
                            </h4>
                            <p className="font-sans text-sm text-text-body leading-relaxed m-0">
                                {settings.nilai_3_desc || 'Membiasakan hidup teratur, bertanggung jawab atas perbuatan pribadi, dan tangguh mengarungi tantangan harian.'}
                            </p>
                        </div>
                    </ScrollReveal>
                </div>
            </div>
        </div>
    );
}
