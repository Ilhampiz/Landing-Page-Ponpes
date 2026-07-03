import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Award, MapPin, ChevronRight, AlertCircle } from 'lucide-react';

export default function HeroSection() {
    const [settings, setSettings] = useState({
        hero_title: 'Pondok Pesantren Al-Qur\'anul Karim',
        alamat: 'Jl. Raya Pesantren No. 123, Sleman, Yogyakarta'
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

    const handleScrollToPpdb = (e) => {
        e.preventDefault();
        const element = document.getElementById('ppdb');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <section id="beranda" className="relative flex items-center justify-center bg-gradient-to-b from-gray-50 to-white py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-green-100 rounded-full filter blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-100 rounded-full filter blur-[120px] pointer-events-none" />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                {/* Left Column: Text & Content */}
                <div className="text-left flex flex-col items-start">
                    <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2 rounded-full text-xs md:text-sm font-semibold uppercase tracking-wider mb-6">
                        <Award size={16} className="text-emerald-600" />
                        <span>Pendaftaran Santri Baru Dibuka</span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 mb-4">
                        {settings.hero_title}
                    </h1>

                    <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6">
                        Membentuk generasi penghafal Al-Qur'an yang cerdas, berkarakter mulia, mandiri, dan berintegritas.
                    </p>

                    <div className="inline-flex items-center gap-2 text-sm text-gray-600 bg-gray-100 border border-gray-200 px-5 py-3 rounded-full mb-8 max-w-full">
                        <MapPin size={18} className="text-emerald-600 shrink-0" />
                        <span className="truncate">{settings.alamat}</span>
                    </div>

                    <div>
                        <a 
                            href="#ppdb" 
                            onClick={handleScrollToPpdb} 
                            className="inline-flex items-center px-5 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base rounded-full bg-green-600 text-white font-semibold shadow hover:bg-green-700 transition-colors no-underline animate-none"
                        >
                            <span>Daftar PPDB</span>
                            <ChevronRight size={20} className="ml-1" />
                        </a>
                    </div>
                </div>

                {/* Right Column: Hero Image */}
                <div className="w-full flex justify-center items-center">
                    <img 
                        src="/pesantren_hero.png" 
                        alt="Pondok Pesantren" 
                        className="w-full h-auto rounded-xl shadow-lg object-cover"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://placehold.co/600x450?text=Pondok+Pesantren';
                        }}
                    />
                </div>
            </div>

            {error && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-2 text-sm font-semibold max-w-md z-20">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                </div>
            )}
        </section>
    );
}
