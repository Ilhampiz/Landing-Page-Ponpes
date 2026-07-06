import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { Award, MapPin, ChevronRight, AlertCircle, Sparkles } from 'lucide-react';

export default function HeroSection() {
    const [settings, setSettings] = useState({
        nama_pesantren: 'Pondok Pesantren Al-Qur\'anul Karim',
        hero_title: 'Mendidik Generasi Qur\'ani & Unggul',
        hero_subtitle: 'Membentuk generasi penghafal Al-Qur\'an yang cerdas, berkarakter mulia, mandiri, berwawasan luas, dan berintegritas tinggi di bawah bimbingan guru tersertifikasi.',
        alamat: 'Jl. Raya Pesantren No. 123, Sleman, Yogyakarta',
        cta_utama_text: 'Daftar PPDB Online',
        cta_sekunder_text: 'Pelajari Profil Kami',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSettings = async () => {
            setLoading(true);
            setError('');
            try {
                const settingsRes = await api.get('/settings');
                if (settingsRes.data) {
                    setSettings(prev => ({
                        ...prev,
                        ...settingsRes.data
                    }));
                }
            } catch (err) {
                console.error('Error loading settings for Hero:', err);
                setError('Gagal memuat beberapa konten halaman.');
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const getHeroImageUrl = () => {
        if (settings.hero_image) {
            if (settings.hero_image.startsWith('http')) return settings.hero_image;
            return `http://localhost:8000${settings.hero_image}`;
        }
        return '/pesantren_hero.png';
    };

    return (
        <section 
            id="beranda" 
            className="relative min-h-[85vh] md:min-h-[90vh] flex flex-col justify-center bg-cover bg-center bg-no-repeat pt-32 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
            style={{ 
                backgroundImage: `linear-gradient(to right, rgba(2, 44, 34, 0.95) 0%, rgba(2, 44, 34, 0.85) 50%, rgba(2, 44, 34, 0.4) 100%), url('${getHeroImageUrl()}')` 
            }}
        >
            {/* Subtle light sparkles glow overlay */}
            <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

            <div className="max-w-6xl mx-auto w-full relative z-10 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
                {/* Left Column: Text & Content */}
                <div className="md:col-span-8 lg:col-span-7 text-left flex flex-col items-start">
                    {/* Badge PPDB */}
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider mb-6 shadow-sm">
                        <Sparkles size={14} className="text-brand-gold-main" />
                        <span>Pendaftaran Santri Baru Dibuka (PPDB)</span>
                    </div>

                    <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight mb-5">
                        {settings.hero_title}
                    </h1>

                    <p className="font-sans text-base sm:text-lg text-brand-green-light/90 leading-relaxed mb-6 max-w-xl">
                        {settings.hero_subtitle}
                    </p>

                    {/* Alamat Badge */}
                    <div className="inline-flex items-center gap-2 text-xs md:text-sm text-brand-green-light/95 bg-white/10 backdrop-blur-md border border-white/20 px-4.5 py-2.5 rounded-xl mb-8 max-w-full hover:bg-white/20 transition-colors duration-200 shadow-sm">
                        <MapPin size={16} className="text-brand-gold-main shrink-0" />
                        <span className="truncate">{settings.alamat}</span>
                    </div>

                    {/* Double CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <Link 
                            to="/ppdb" 
                            className="group inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-brand-gold-main hover:bg-brand-gold-dark text-white font-sans font-semibold text-sm sm:text-base transition-all duration-300 shadow-gold-glow hover:-translate-y-0.5 active:translate-y-0 no-underline"
                        >
                            <span>{settings.cta_utama_text}</span>
                            <ChevronRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                        <Link 
                            to="/profil" 
                            className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl border border-white/30 text-white hover:bg-white/10 font-sans font-semibold text-sm sm:text-base transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 no-underline"
                        >
                            <span>{settings.cta_sekunder_text}</span>
                        </Link>
                    </div>
                </div>

                {/* Right Column: Floating Accreditation Badge */}
                <div className="md:col-span-4 lg:col-span-5 w-full flex justify-end items-end h-full">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl shadow-premium flex items-center gap-3.5 mt-8 md:mt-0">
                        <div className="p-2.5 bg-brand-gold-main text-white rounded-xl shadow-sm">
                            <Award size={22} className="fill-current" />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-bold tracking-wider text-brand-gold-main leading-none">Akreditasi Lembaga</p>
                            <p className="text-base font-bold text-white mt-1">A (Unggul)</p>
                        </div>
                    </div>
                </div>
            </div>

            {error && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 p-4 bg-rose-950/80 backdrop-blur border border-rose-800 text-rose-200 rounded-xl flex items-center gap-2 text-sm font-semibold max-w-md z-20">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                </div>
            )}
        </section>
    );
}
