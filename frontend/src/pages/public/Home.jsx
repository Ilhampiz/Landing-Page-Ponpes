import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import RunningText from "../../components/RunningText";
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

export default function Home() {
    const [programs, setPrograms] = useState([]);
    const [showFullSambutan, setShowFullSambutan] = useState(false);
    const [news, setNews] = useState([]);
    const [gallery, setGallery] = useState([]);
    const [settings, setSettings] = useState({
        alamat: 'Jl. Raya Pesantren No. 123, Sleman, Yogyakarta',
        no_telp: '08123456789'
    });
    const [loadingPrograms, setLoadingPrograms] = useState(true);
    const [loadingNews, setLoadingNews] = useState(true);
    const [loadingGallery, setLoadingGallery] = useState(true);

    const getImageUrl = (path) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        return `http://localhost:8000${path}`;
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

        const fetchSettings = async () => {
            try {
                const res = await api.get('/settings');
                if (res.data) {
                    setSettings(prev => ({
                        ...prev,
                        ...res.data
                    }));
                }
            } catch (err) {
                console.error('Error fetching settings for Home:', err);
            }
        };

        fetchPrograms();
        fetchNews();
        fetchGallery();
        fetchSettings();
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

            {/* Section 1: Sambutan Singkat */}
            <div className="bg-slate-50 border-b border-slate-100">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
                    <div className="bg-white rounded-3xl border border-slate-100 p-8 md:p-12 shadow-premium flex flex-col md:flex-row gap-10 items-center">
                        {/* Leader Avatar and Identity */}
                        <div className="flex flex-col items-center text-center shrink-0">
                            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-brand-green-main/20 shadow-md relative group">
                                <img 
                                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop" 
                                    alt="Pimpinan Pesantren" 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <h3 className="font-serif text-lg sm:text-xl font-bold text-text-title mt-4 mb-1">
                                KH. Ahmad Dahlan, Lc., M.A.
                            </h3>
                            <span className="font-sans text-xs font-bold uppercase tracking-wider text-brand-gold-main">
                                Pimpinan Pondok Pesantren
                            </span>
                        </div>

                        {/* Quote and Focus Pillars */}
                        <div className="flex-1 flex flex-col items-start">
                            {/* Quote Icon */}
                            <div className="text-brand-green-main/10 mb-2">
                                <Quote size={40} className="fill-current" />
                            </div>
                            
                            <p className="font-sans text-base text-text-body leading-relaxed italic mb-4">
                                "Assalamu'alaikum Warahmatullahi Wabarakatuh. Selamat datang di laman resmi Pondok Pesantren Al-Qur'anul Karim. Kami berkomitmen untuk mendidik generasi Qurani yang berakhlak mulia, unggul dalam sains, cerdas, dan mandiri. Semoga media informasi ini bermanfaat bagi wali santri dan masyarakat luas..."
                            </p>

                            {/* Collapsible paragraph */}
                            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                showFullSambutan ? 'max-h-48 opacity-100 mb-4' : 'max-h-0 opacity-0 pointer-events-none'
                            }`}>
                                <p className="font-sans text-sm text-text-body leading-relaxed italic border-l-2 border-brand-gold-main pl-4 py-1">
                                    "Di era modernisasi ini, tantangan dalam mendampingi tumbuh kembang anak semakin dinamis. Oleh sebab itu, kami merancang program pengajaran kepesantrenan klasik terpadu dengan integrasi literasi digital dan pengembangan sains. Kami berharap ikhtiar ini melahirkan lulusan yang tangguh menjawab tantangan zaman tanpa kehilangan akar kepribadian Islami."
                                </p>
                            </div>

                            {/* Baca Selengkapnya Button */}
                            <button 
                                onClick={() => setShowFullSambutan(!showFullSambutan)}
                                className="font-sans text-xs font-bold text-brand-green-main hover:text-brand-green-dark hover:underline flex items-center gap-1.5 focus:outline-none cursor-pointer mb-6 bg-transparent border-none"
                            >
                                <span>{showFullSambutan ? 'Sembunyikan' : 'Baca Sambutan Selengkapnya'}</span>
                                <span className="text-[10px]">{showFullSambutan ? '▲' : '▼'}</span>
                            </button>


                        </div>
                    </div>
                </div>
            </div>
            {/* Section 2: Visi Misi Ringkas */}
            <div className="bg-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
                    <ScrollReveal>
                        <div className="bg-brand-green-light/40 border border-brand-green-main/10 p-8 md:p-12 rounded-3xl text-center max-w-3xl mx-auto shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-[3px] bg-brand-gold-main" />
                            <span className="text-brand-green-main font-sans font-bold uppercase tracking-widest text-xs block mb-3">Visi Utama</span>
                            <p className="text-lg sm:text-xl md:text-2xl font-serif italic text-brand-green-dark mb-6 leading-relaxed max-w-2xl mx-auto">
                                "Terwujudnya lembaga pendidikan Islam unggulan yang mencetak hafizh/hafizhah mutqin, berilmu amaliyah, beramal ilmiah, dan berakhlak mulia."
                            </p>
                            <Link 
                                to="/profil" 
                                className="inline-flex items-center gap-1.5 text-brand-green-main font-sans font-bold hover:text-brand-green-dark hover:gap-2 transition-all no-underline text-sm uppercase tracking-wider"
                            >
                                <span>Pelajari Profil & Sejarah Kami</span>
                                <ArrowRight size={14} />
                            </Link>
                        </div>
                    </ScrollReveal>
                </div>
            </div>

            {/* Section 3: Program Unggulan */}
            <div className="bg-slate-50 border-t border-b border-slate-100">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
                    <ScrollReveal>
                        <div className="text-center mb-12">
                            <span className="text-brand-green-main font-sans font-bold uppercase tracking-widest text-xs block mb-2">Program</span>
                            <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-text-title">
                                Program Pendidikan Unggulan
                            </h2>
                            <p className="font-sans text-sm text-text-body max-w-md mx-auto mt-2">Kurikulum terpadu memadukan hafalan Al-Qur'an, studi agama, dan ilmu umum.</p>
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
                                <ScrollReveal key={item.id || idx} delay={idx * 100}>
                                    <ProgramCard 
                                        title={item.title}
                                        description={item.description}
                                        category={item.category || "Unggulan"}
                                    />
                                </ScrollReveal>
                            ))}
                        </div>
                    )}

                    <ScrollReveal delay={150}>
                        <div className="text-center">
                            <Link 
                                to="/program" 
                                className="inline-flex items-center gap-2 bg-brand-green-main hover:bg-brand-green-dark text-white font-sans font-bold px-6 py-3.5 rounded-xl shadow-premium transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 no-underline text-sm"
                            >
                                <span>Lihat Semua Program</span>
                                <ArrowRight size={14} />
                            </Link>
                        </div>
                    </ScrollReveal>
                </div>
            </div>

            {/* Section 4: Berita & Pengumuman Terbaru */}
            {/* Section 4: Berita & Pengumuman Terbaru */}
            <div className="bg-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
                    <ScrollReveal>
                        <div className="text-center mb-12">
                            <span className="text-brand-green-main font-sans font-bold uppercase tracking-widest text-xs block mb-2">Informasi</span>
                            <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-text-title">
                                Berita & Pengumuman Terbaru
                            </h2>
                            <div className="w-12 h-[3px] bg-brand-gold-main mx-auto mt-4 rounded-full" />
                            <p className="font-sans text-sm text-text-body max-w-md mx-auto mt-4">Ikuti kabar terbaru dan pengumuman resmi mengenai kegiatan pesantren.</p>
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
                                <ScrollReveal key={item.id || idx} delay={idx * 100}>
                                    <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-premium hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
                                        <div className="h-48 overflow-hidden bg-slate-50 border-b border-slate-100 relative">
                                            {item.thumbnail ? (
                                                <img 
                                                    src={getImageUrl(item.thumbnail)} 
                                                    alt={item.title} 
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-brand-green-light/50 text-brand-green-main">
                                                    <Newspaper size={36} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-6 flex flex-col justify-between flex-1 gap-4">
                                            <div>
                                                <span className="font-sans text-[10px] font-bold text-brand-gold-main uppercase tracking-wider flex items-center gap-1">
                                                    <Calendar size={12} />
                                                    {formatDate(item.published_at)}
                                                </span>
                                                <h4 className="font-serif text-base font-bold text-text-title mt-2 line-clamp-2">{item.title}</h4>
                                                <p className="font-sans text-xs text-text-body mt-2 line-clamp-3 leading-relaxed">{getExcerpt(item.content)}</p>
                                            </div>
                                            <Link to="/berita" className="font-sans text-xs font-bold text-brand-green-main hover:text-brand-green-dark inline-flex items-center gap-1 hover:gap-1.5 transition-all no-underline mt-2">
                                                <span>Baca Selengkapnya</span>
                                                <ArrowRight size={12} />
                                            </Link>
                                        </div>
                                    </div>
                                </ScrollReveal>
                            ))}
                        </div>
                    )}

                    <ScrollReveal delay={150}>
                        <div className="text-center">
                            <Link 
                                to="/berita" 
                                className="inline-flex items-center gap-2 bg-brand-green-main hover:bg-brand-green-dark text-white font-sans font-bold px-6 py-3.5 rounded-xl shadow-premium transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 no-underline text-sm"
                            >
                                <span>Lihat Semua Berita</span>
                                <ArrowRight size={14} />
                            </Link>
                        </div>
                    </ScrollReveal>
                </div>
            </div>

            {/* Section 5: Galeri Dokumentasi */}
            <div className="bg-slate-50 border-t border-b border-slate-100">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
                    <ScrollReveal>
                        <div className="text-center mb-12">
                            <span className="text-brand-green-main font-sans font-bold uppercase tracking-widest text-xs block mb-2">Dokumentasi</span>
                            <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-text-title">
                                Galeri Kegiatan & Fasilitas
                            </h2>
                            <div className="w-12 h-[3px] bg-brand-gold-main mx-auto mt-4 rounded-full" />
                            <p className="font-sans text-sm text-text-body max-w-md mx-auto mt-4">Galeri dokumentasi visual aktivitas santri dan sarana prasarana pesantren.</p>
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
                                <ScrollReveal key={item.id || idx} delay={idx * 50}>
                                    <div className="group relative rounded-2xl overflow-hidden aspect-video bg-slate-100 border border-slate-200/50 shadow-sm cursor-pointer">
                                        <img 
                                            src={getImageUrl(item.image_path)} 
                                            alt={item.title} 
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                            <div className="text-white">
                                                <span className="font-sans text-[9px] font-bold uppercase tracking-wider text-brand-gold-main">{item.category || "Kegiatan"}</span>
                                                <h5 className="font-serif text-xs font-bold mt-1 line-clamp-1">{item.title}</h5>
                                            </div>
                                        </div>
                                    </div>
                                </ScrollReveal>
                            ))}
                        </div>
                    )}

                    <ScrollReveal delay={150}>
                        <div className="text-center">
                            <Link 
                                to="/galeri" 
                                className="inline-flex items-center gap-2 bg-brand-green-main hover:bg-brand-green-dark text-white font-sans font-bold px-6 py-3.5 rounded-xl shadow-premium transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 no-underline text-sm"
                            >
                                <span>Lihat Semua Galeri</span>
                                <ArrowRight size={14} />
                            </Link>
                        </div>
                    </ScrollReveal>
                </div>
            </div>
            {/* Section 6: CTA Pendaftaran Santri Baru */}
            <div className="bg-brand-green-dark text-white relative overflow-hidden">
                {/* Subtle gold decoration bar */}
                <div className="absolute top-0 left-0 right-0 h-[4px] bg-brand-gold-main" />
                <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 relative z-10">
                    <ScrollReveal>
                        <div className="text-center max-w-2xl mx-auto">
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif mb-4 text-white">
                                Pendaftaran Santri Baru Telah Dibuka!
                            </h2>
                            <p className="font-sans text-sm sm:text-base text-brand-green-light/85 mb-8 leading-relaxed">
                                Mari bergabung menjadi bagian dari generasi penghafal Al-Qur'an dan pemimpin masa depan yang berilmu, bertakwa, dan berintegritas tinggi.
                            </p>
                            <Link 
                                to="/ppdb" 
                                className="inline-flex items-center gap-2 bg-brand-gold-main hover:bg-brand-gold-dark text-white font-sans font-bold px-8 py-4 rounded-xl shadow-gold-glow hover:-translate-y-0.5 transition-all duration-300 no-underline text-base"
                            >
                                <span>Daftar Sekarang (PPDB Online)</span>
                                <ArrowRight size={18} />
                            </Link>
                        </div>
                    </ScrollReveal>
                </div>
            </div>

            {/* Section 7: CTA Hubungi Kami */}
            <div className="bg-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                        <ScrollReveal>
                            <div>
                                <span className="text-brand-green-main font-sans font-bold uppercase tracking-widest text-xs block mb-2">Hubungi Kami</span>
                                <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-text-title mb-4">
                                    Butuh Informasi Lebih Lanjut?
                                </h2>
                                <p className="font-sans text-sm sm:text-base text-text-body leading-relaxed mb-0">
                                    Layanan informasi dan administrasi pendaftaran santri baru siap melayani pertanyaan Anda mengenai program akademik, kurikulum, dan biaya studi.
                                </p>
                            </div>
                        </ScrollReveal>
                        
                        <ScrollReveal delay={200}>
                            <div className="bg-brand-green-light/40 border border-brand-green-main/10 p-6 sm:p-8 rounded-3xl flex flex-col gap-5 shadow-sm relative overflow-hidden">
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
                                        <span className="text-sm text-text-body mt-1 block leading-relaxed">{settings?.no_telp}</span>
                                    </div>
                                </div>
                                <Link 
                                    to="/kontak" 
                                    className="inline-flex items-center justify-center gap-2 bg-brand-green-main hover:bg-brand-green-dark text-white font-sans font-bold px-6 py-3.5 rounded-xl shadow-premium transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 no-underline text-sm mt-2"
                                >
                                    <span>Kunjungi Hub Kontak Kami</span>
                                    <ArrowRight size={14} />
                                </Link>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </div>
        </div>
    );
}

