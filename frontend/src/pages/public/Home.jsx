import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import RunningText from "../../components/RunningText";
import { useSettings } from '../../context/SettingsContext';
import HeroSection from "./HeroSection";
import QuickStats from "../../components/QuickStats";
import ProgramCard from "../../components/ProgramCard";
import ScrollReveal from "../../components/ScrollReveal";
import { 
    BookOpen, 
    ArrowRight, 
    Newspaper, 
    Camera, 
    Phone, 
    MapPin, 
    Calendar,
    CheckCircle2,
    Quote
} from 'lucide-react';

const QuranIcon = ({ size = 24 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21c-1.2-2.2-4.5-3-7-3h-2v-13h2c2.5 0 5.8.8 7 3 1.2-2.2 4.5-3 7-3h2v13h-2c-2.5 0-5.8.8-7 3z" />
        <path d="M12 6v15" />
    </svg>
);

const MosqueIcon = ({ size = 24 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18" />
        <path d="M5 21V10l7-5 7 5v11" />
        <path d="M9 21v-4a3 3 0 0 1 6 0v4" />
        <path d="M12 5V2" />
    </svg>
);

const ShieldIcon = ({ size = 24 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
);

const pillars = [
    {
        icon: QuranIcon,
        title: "Tahfidzul Qur'an",
        desc: "Program hafalan Al-Qur'an intensif dengan target hafalan mutqin serta pemahaman maknanya yang dibimbing oleh para ustadz/ustadzah hafidz.",
        bg: 'bg-brand-green-light/40',
        iconColor: 'text-brand-green-main',
    },
    {
        icon: MosqueIcon,
        title: "Tafaqquh Fiddin",
        desc: "Pendalaman kajian keislaman melalui kitab-kitab klasik (kitab kuning) untuk melahirkan pemahaman agama yang mendalam dan moderat.",
        bg: 'bg-brand-gold-light/40',
        iconColor: 'text-brand-gold-main',
    },
    {
        icon: ShieldIcon,
        title: "Akhlakul Karimah",
        desc: "Pembiasaan nilai adab Islami dan kemandirian dalam aktivitas harian pondok guna membentuk kepribadian yang luhur.",
        bg: 'bg-brand-green-light/40',
        iconColor: 'text-brand-green-main',
    },
];

export default function Home() {
    const [programs, setPrograms] = useState([]);
    const [showFullSambutan, setShowFullSambutan] = useState(false);
    const [news, setNews] = useState([]);
    const [gallery, setGallery] = useState([]);
    const { settings: globalSettings } = useSettings();
    const settings = globalSettings || {
        alamat: '',
        no_telp: '',
        no_wa: '',
        tagline: '',
        cta_utama_text: '',
        visi: '',
        sambutan_pimpinan: '',
    };
    const [loadingPrograms, setLoadingPrograms] = useState(true);
    const [loadingNews, setLoadingNews] = useState(true);
    const [loadingGallery, setLoadingGallery] = useState(true);

    const getImageUrl = (path) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        return `http://pesantren-api.test${path}`;
    };

    useEffect(() => {
        const fetchPrograms = async () => {
            setLoadingPrograms(true);
            try {
                const res = await api.get('/programs');
                const list = Array.isArray(res.data) ? res.data : (res.data?.data || []);
                const sorted = list.sort((a, b) => (a.order || 0) - (b.order || 0));
                setPrograms(sorted);
            } catch (err) {
                console.error('Error fetching programs:', err);
            } finally {
                setLoadingPrograms(false);
            }
        };

        const fetchNews = async () => {
            setLoadingNews(true);
            try {
                const res = await api.get('/news');
                const list = Array.isArray(res.data) ? res.data : (res.data?.data || []);
                setNews(list);
            } catch (err) {
                console.error('Error fetching news:', err);
            } finally {
                setLoadingNews(false);
            }
        };

        const fetchGallery = async () => {
            setLoadingGallery(true);
            try {
                const res = await api.get('/gallery');
                const list = Array.isArray(res.data) ? res.data : (res.data?.data || []);
                setGallery(list);
            } catch (err) {
                console.error('Error fetching gallery:', err);
            } finally {
                setLoadingGallery(false);
            }
        };

        fetchPrograms();
        fetchNews();
        fetchGallery();
    }, []);

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
        } catch (e) {
            return dateStr;
        }
    };

    const getExcerpt = (htmlContent) => {
        if (!htmlContent) return '';
        const plainText = htmlContent.replace(/<[^>]*>/g, '');
        if (plainText.length <= 110) return plainText;
        return plainText.substring(0, 110) + '...';
    };

    return (
        <div className="flex flex-col">
            {/* Running text & Hero */}
            <RunningText />
            <HeroSection />
            <QuickStats />

            {/* ─── Section 1: Sambutan Singkat ───────────────────────────────── */}
            <div id="sambutan" className="bg-white border-b border-slate-100 overflow-hidden">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 flex flex-col gap-10">

                    {/* Header */}
                    <ScrollReveal direction="up">
                        <div className="flex flex-col items-start text-left">
                            <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-green-dark mt-2 tracking-tight">
                                Sambutan Pimpinan Pesantren
                            </h2>
                            <p className="font-sans text-sm md:text-base text-slate-500 mt-2 max-w-xl">
                                Selamat datang di portal resmi Pondok Pesantren kami. Simak pesan hangat dari pimpinan yayasan.
                            </p>
                        </div>
                    </ScrollReveal>

                    {/* Card */}
                    <div className="bg-slate-50 border border-slate-200/70 rounded-3xl p-6 md:p-10 shadow-md flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-stretch hover:shadow-premium transition-shadow duration-500">

                        {/* Image — slide from left */}
                        <ScrollReveal direction="left" className="w-full md:w-72 shrink-0">
                            <div className="rounded-2xl overflow-hidden shadow-md relative group min-h-[300px] h-full">
                                <img
                                    src={settings.sambutan_image
                                        ? getImageUrl(settings.sambutan_image)
                                        : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&h=600&fit=crop'
                                    }
                                    alt={settings.nama_pimpinan || 'Pimpinan Pesantren'}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                {/* Golden shimmer on hover */}
                                <div className="absolute inset-0 bg-gradient-to-t from-brand-gold-main/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </div>
                        </ScrollReveal>

                        {/* Content — slide from right */}
                        <ScrollReveal direction="right" delay={120} className="flex-1">
                            <div className="flex flex-col justify-between items-start text-left h-full">
                                <div className="w-full">
                                    <div className="text-brand-green-main/10 mb-4">
                                        <Quote size={48} className="fill-current" />
                                    </div>
                                    <p className="font-sans text-base md:text-lg text-slate-700 leading-relaxed italic mb-6">
                                        &ldquo;{settings.sambutan_pimpinan || "Assalamu'alaikum Warahmatullahi Wabarakatuh. Selamat datang di laman resmi Pondok Pesantren kami. Kami berkomitmen untuk mendidik generasi Qurani yang berakhlak mulia, unggul dalam sains, cerdas, dan mandiri. Semoga media informasi ini bermanfaat bagi wali santri dan masyarakat luas..."}&rdquo;
                                    </p>
                                </div>
                                <div className="border-t border-slate-200/80 pt-6 w-full mt-auto">
                                    <h3 className="font-serif text-lg md:text-xl font-bold text-brand-green-dark leading-none">
                                        {settings.nama_pimpinan || 'Pimpinan Pesantren'}
                                    </h3>
                                    <p className="font-sans text-xs md:text-sm font-medium text-brand-gold-main mt-2 uppercase tracking-wider">
                                        {settings.jabatan_pimpinan || 'Pimpinan Pondok Pesantren'}
                                    </p>
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </div>

            {/* ─── Section 2: Visi & Pilar Utama ────────────────────────────── */}
            <div className="bg-slate-100/40 py-8 border-t border-b border-slate-100/80">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                    <div className="bg-white border border-slate-200/60 shadow-lg p-8 md:p-12 rounded-[2rem] max-w-6xl mx-auto relative overflow-hidden flex flex-col gap-10 hover:shadow-xl transition-shadow duration-500">

                        {/* Upper row */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                            <ScrollReveal direction="left" className="md:col-span-7 text-left flex flex-col items-start">
                                <span className="font-sans text-xs font-bold uppercase tracking-wider text-brand-gold-main mb-2">
                                    Visi & Pilar Utama
                                </span>
                                <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-brand-green-dark leading-tight tracking-tight">
                                    {settings.tagline || 'Membentuk Generasi Rabbani yang Unggul & Berkarakter Mulia'}
                                </h2>
                            </ScrollReveal>

                            <ScrollReveal direction="right" delay={120} className="md:col-span-5 text-left md:pl-8 border-l border-transparent md:border-slate-100">
                                <p className="font-sans text-sm md:text-base text-slate-500 leading-relaxed italic">
                                    &ldquo;{settings.visi || 'Terwujudnya lembaga pendidikan Islam unggulan yang mencetak hafizh/hafizhah mutqin, berilmu amaliyah, beramal ilmiah, dan berakhlak mulia.'}&rdquo;
                                </p>
                                <div className="mt-4">
                                    <Link
                                        to="/profil"
                                        className="inline-flex items-center gap-1.5 text-brand-green-main font-sans font-bold hover:text-brand-green-dark hover:gap-2.5 transition-all no-underline text-xs uppercase tracking-wider group"
                                    >
                                        <span>Pelajari Profil & Sejarah Kami</span>
                                        <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                                    </Link>
                                </div>
                            </ScrollReveal>
                        </div>

                        {/* Three pillars — stagger */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 mt-2 pt-8 border-t border-slate-100">
                            {pillars.map((p, idx) => (
                                <ScrollReveal key={idx} direction="up" delay={idx * 120}>
                                    <div className="flex flex-col items-start text-left group cursor-default">
                                        <div className={`p-3 ${p.bg} ${p.iconColor} rounded-2xl mb-4 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-md`}>
                                            <p.icon size={24} />
                                        </div>
                                        <h3 className="font-serif text-lg font-bold text-brand-green-dark tracking-tight group-hover:text-brand-green-main transition-colors duration-300">
                                            {p.title}
                                        </h3>
                                        <p className="font-sans text-xs md:text-sm text-slate-500 mt-2 leading-relaxed">
                                            {p.desc}
                                        </p>
                                    </div>
                                </ScrollReveal>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── Section 3: Program Unggulan ───────────────────────────────── */}
            <div className="bg-slate-50 border-t border-b border-slate-100">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
                    <ScrollReveal direction="up">
                        <div className="text-center mb-12">
                            <span className="text-brand-green-main font-sans font-bold uppercase tracking-widest text-xs block mb-2">Program</span>
                            <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-text-title">
                                Program Pendidikan Unggulan
                            </h2>
                            <div className="w-12 h-[3px] bg-brand-gold-main mx-auto mt-4 rounded-full" />
                            <p className="font-sans text-sm text-text-body max-w-md mx-auto mt-4">
                                Kurikulum terpadu memadukan hafalan Al-Qur'an, studi agama, dan ilmu umum.
                            </p>
                        </div>
                    </ScrollReveal>

                    {loadingPrograms ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="w-8 h-8 border-4 border-slate-200 border-t-brand-green-main rounded-full animate-spin" />
                        </div>
                    ) : programs.length === 0 ? (
                        <div className="text-center text-text-body text-sm py-12">Program belum tersedia.</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {programs.slice(0, 3).map((item, idx) => (
                                <ScrollReveal key={item.id || idx} direction="up" delay={idx * 110}>
                                    <ProgramCard
                                        title={item.title}
                                        description={item.description}
                                        category={item.category || "Unggulan"}
                                    />
                                </ScrollReveal>
                            ))}
                        </div>
                    )}

                    <ScrollReveal delay={180}>
                        <div className="text-center">
                            <Link
                                to="/program"
                                className="inline-flex items-center gap-2 bg-brand-green-main hover:bg-brand-green-dark text-white font-sans font-bold px-6 py-3.5 rounded-xl shadow-premium transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 no-underline text-sm group"
                            >
                                <span>Lihat Semua Program</span>
                                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </ScrollReveal>
                </div>
            </div>

            {/* ─── Section 4: Berita & Pengumuman ────────────────────────────── */}
            <div className="bg-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
                    <ScrollReveal direction="up">
                        <div className="text-center mb-12">
                            <span className="text-brand-green-main font-sans font-bold uppercase tracking-widest text-xs block mb-2">Informasi</span>
                            <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-text-title">
                                Berita & Pengumuman Terbaru
                            </h2>
                            <div className="w-12 h-[3px] bg-brand-gold-main mx-auto mt-4 rounded-full" />
                            <p className="font-sans text-sm text-text-body max-w-md mx-auto mt-4">
                                Ikuti kabar terbaru dan pengumuman resmi mengenai kegiatan pesantren.
                            </p>
                        </div>
                    </ScrollReveal>

                    {loadingNews ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="w-8 h-8 border-4 border-slate-200 border-t-brand-green-main rounded-full animate-spin" />
                        </div>
                    ) : news.length === 0 ? (
                        <div className="text-center text-text-body text-sm py-12">Berita belum tersedia.</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            {news.slice(0, 3).map((item, idx) => (
                                <ScrollReveal key={item.id || idx} direction="up" delay={idx * 110}>
                                    <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-premium hover:-translate-y-1.5 transition-all duration-400 flex flex-col h-full group">
                                        <div className="h-48 overflow-hidden bg-slate-50 border-b border-slate-100 relative">
                                            {item.thumbnail ? (
                                                <img
                                                    src={getImageUrl(item.thumbnail)}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-brand-green-light/50 text-brand-green-main">
                                                    <Newspaper size={36} />
                                                </div>
                                            )}
                                            {/* Category badge overlay */}
                                            <div className="absolute top-3 left-3">
                                                <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-green-dark/80 text-white px-2 py-1 rounded-lg backdrop-blur-sm">
                                                    Berita
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-6 flex flex-col justify-between flex-1 gap-4">
                                            <div>
                                                <span className="font-sans text-[10px] font-bold text-brand-gold-main uppercase tracking-wider flex items-center gap-1">
                                                    <Calendar size={12} />
                                                    {formatDate(item.published_at)}
                                                </span>
                                                <h4 className="font-serif text-base font-bold text-text-title mt-2 line-clamp-2 group-hover:text-brand-green-main transition-colors duration-300">
                                                    {item.title}
                                                </h4>
                                                <p className="font-sans text-xs text-text-body mt-2 line-clamp-3 leading-relaxed">
                                                    {getExcerpt(item.content)}
                                                </p>
                                            </div>
                                            <Link
                                                to="/berita"
                                                className="font-sans text-xs font-bold text-brand-green-main hover:text-brand-green-dark inline-flex items-center gap-1 hover:gap-2 transition-all no-underline mt-2 group/link"
                                            >
                                                <span>Baca Selengkapnya</span>
                                                <ArrowRight size={12} className="transition-transform group-hover/link:translate-x-1" />
                                            </Link>
                                        </div>
                                    </div>
                                </ScrollReveal>
                            ))}
                        </div>
                    )}

                    <ScrollReveal delay={180}>
                        <div className="text-center">
                            <Link
                                to="/berita"
                                className="inline-flex items-center gap-2 bg-brand-green-main hover:bg-brand-green-dark text-white font-sans font-bold px-6 py-3.5 rounded-xl shadow-premium transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 no-underline text-sm group"
                            >
                                <span>Lihat Semua Berita</span>
                                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </ScrollReveal>
                </div>
            </div>

            {/* ─── Section 5: Galeri ─────────────────────────────────────────── */}
            <div className="bg-slate-50 border-t border-b border-slate-100">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
                    <ScrollReveal direction="up">
                        <div className="text-center mb-12">
                            <span className="text-brand-green-main font-sans font-bold uppercase tracking-widest text-xs block mb-2">Dokumentasi</span>
                            <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-text-title">
                                Galeri Kegiatan & Fasilitas
                            </h2>
                            <div className="w-12 h-[3px] bg-brand-gold-main mx-auto mt-4 rounded-full" />
                            <p className="font-sans text-sm text-text-body max-w-md mx-auto mt-4">
                                Galeri dokumentasi visual aktivitas santri dan sarana prasarana pesantren.
                            </p>
                        </div>
                    </ScrollReveal>

                    {loadingGallery ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="w-8 h-8 border-4 border-slate-200 border-t-brand-green-main rounded-full animate-spin" />
                        </div>
                    ) : gallery.length === 0 ? (
                        <div className="text-center text-text-body text-sm py-12">Foto belum tersedia.</div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                            {gallery.slice(0, 6).map((item, idx) => (
                                <ScrollReveal key={item.id || idx} direction="zoom" delay={idx * 60}>
                                    <div className="group relative rounded-2xl overflow-hidden aspect-video bg-slate-100 border border-slate-200/50 shadow-sm cursor-pointer hover:shadow-lg transition-shadow duration-300">
                                        <img
                                            src={getImageUrl(item.image_path)}
                                            alt={item.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                                            style={{ '--tw-scale-x': 1.08, '--tw-scale-y': 1.08 }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                            <div className="text-white translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                                <span className="font-sans text-[9px] font-bold uppercase tracking-wider text-brand-gold-main">
                                                    {item.category || "Kegiatan"}
                                                </span>
                                                <h5 className="font-serif text-xs font-bold mt-1 line-clamp-1">{item.title}</h5>
                                            </div>
                                        </div>
                                    </div>
                                </ScrollReveal>
                            ))}
                        </div>
                    )}

                    <ScrollReveal delay={180}>
                        <div className="text-center">
                            <Link
                                to="/galeri"
                                className="inline-flex items-center gap-2 bg-brand-green-main hover:bg-brand-green-dark text-white font-sans font-bold px-6 py-3.5 rounded-xl shadow-premium transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 no-underline text-sm group"
                            >
                                <span>Lihat Semua Galeri</span>
                                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </ScrollReveal>
                </div>
            </div>

            {/* ─── Section 6: CTA Pendaftaran ────────────────────────────────── */}
            <div className="bg-brand-green-dark text-white relative overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute top-0 left-0 right-0 h-[4px] bg-brand-gold-main" />
                <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
                <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-brand-gold-main/5 blur-3xl pointer-events-none" />
                <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-brand-green-main/20 blur-3xl pointer-events-none" />

                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 relative z-10">
                    <ScrollReveal direction="up">
                        <div className="text-center max-w-2xl mx-auto">
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif mb-4 text-white">
                                Pendaftaran Santri Baru Telah Dibuka!
                            </h2>
                            <p className="font-sans text-sm sm:text-base text-brand-green-light/85 mb-8 leading-relaxed">
                                Mari bergabung menjadi bagian dari generasi penghafal Al-Qur'an dan pemimpin masa depan yang berilmu, bertakwa, dan berintegritas tinggi.
                            </p>
                            <Link
                                to="/formulir-pendaftaran"
                                className="inline-flex items-center gap-2 bg-brand-gold-main hover:bg-brand-gold-dark text-white font-sans font-bold px-8 py-4 rounded-xl shadow-gold-glow hover:-translate-y-1 hover:shadow-xl transition-all duration-300 no-underline text-base group"
                            >
                                <span>{settings.cta_utama_text || 'Formulir Pendaftaran'}</span>
                                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </ScrollReveal>
                </div>
            </div>

            {/* ─── Section 7: Hubungi Kami ───────────────────────────────────── */}
            <div className="bg-white overflow-hidden">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

                        {/* Left: text — slide from left */}
                        <ScrollReveal direction="left">
                            <div>
                                <span className="text-brand-green-main font-sans font-bold uppercase tracking-widest text-xs block mb-2">Hubungi Kami</span>
                                <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-text-title mb-4">
                                    Butuh Informasi Lebih Lanjut?
                                </h2>
                                <p className="font-sans text-sm sm:text-base text-text-body leading-relaxed">
                                    Layanan informasi dan administrasi pendaftaran santri baru siap melayani pertanyaan Anda mengenai program akademik, kurikulum, dan biaya studi.
                                </p>
                            </div>
                        </ScrollReveal>

                        {/* Right: contact card — slide from right */}
                        <ScrollReveal direction="right" delay={130}>
                            <div className="bg-brand-green-light/40 border border-brand-green-main/10 p-6 sm:p-8 rounded-3xl flex flex-col gap-5 shadow-sm relative overflow-hidden hover:shadow-premium transition-shadow duration-500 group">
                                {/* Gold side bar */}
                                <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-brand-gold-main" />

                                <div className="flex items-start gap-3.5 pl-2">
                                    <MapPin className="text-brand-green-main shrink-0 mt-0.5" size={18} />
                                    <div>
                                        <span className="text-text-title font-sans font-bold text-xs block uppercase tracking-wider">Lokasi Kampus</span>
                                        <span className="text-sm text-text-body mt-1 block leading-relaxed">{settings?.alamat}</span>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3.5 pl-2">
                                    <Phone className="text-brand-green-main shrink-0 mt-0.5" size={18} />
                                    <div>
                                        <span className="text-text-title font-sans font-bold text-xs block uppercase tracking-wider">WhatsApp Hotline</span>
                                        <span className="text-sm text-text-body mt-1 block leading-relaxed">{settings?.no_wa || settings?.no_telp}</span>
                                    </div>
                                </div>

                                <Link
                                    to="/kontak"
                                    className="inline-flex items-center justify-center gap-2 bg-brand-green-main hover:bg-brand-green-dark text-white font-sans font-bold px-6 py-3.5 rounded-xl shadow-premium transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 no-underline text-sm mt-2 group/btn"
                                >
                                    <span>Kunjungi Hub Kontak Kami</span>
                                    <ArrowRight size={14} className="transition-transform group-hover/btn:translate-x-1" />
                                </Link>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </div>
        </div>
    );
}
