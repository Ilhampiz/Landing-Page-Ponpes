import { useState, useEffect } from 'react';
import { BookOpen, Menu, X, ArrowRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import api from '../api/axios';

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const activeRoute = location.pathname;

    const [settings, setSettings] = useState({
        nama_pesantren: '',
        logo: '',
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await api.get('/settings');
                if (res.data) {
                    setSettings({
                        nama_pesantren: res.data.nama_pesantren || '',
                        logo: res.data.logo || '',
                    });
                }
            } catch (err) {
                console.error('Error fetching settings for Navbar:', err);
            }
        };
        fetchSettings();
    }, []);

    // Menangani efek scroll untuk merubah gaya Navbar secara dinamis
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const menuItems = [
        { label: 'Beranda', to: '/' },
        { label: 'Profil', to: '/profil' },
        { label: 'Program', to: '/program' },
        { label: 'Galeri', to: '/galeri' },
        { label: 'Berita', to: '/berita' },
        { label: 'Kontak', to: '/kontak' },
    ];

    return (
        <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
            scrolled 
                ? 'bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-premium py-3' 
                : 'bg-white/70 backdrop-blur-md border-b border-transparent py-4'
        }`}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                {/* Brand / Logo */}
                <Link 
                    to="/" 
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 group no-underline"
                >
                    {settings.logo ? (
                        <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-100 flex items-center justify-center p-1 bg-white">
                            <img 
                                src={settings.logo.startsWith('http') ? settings.logo : `http://localhost:8000${settings.logo}`} 
                                alt="Logo" 
                                className="max-w-full max-h-full object-contain" 
                            />
                        </div>
                    ) : (
                        <div className="p-2 bg-brand-green-light text-brand-green-main rounded-xl transition-all duration-300 group-hover:bg-brand-green-main group-hover:text-white shadow-sm">
                            <BookOpen size={20} className="transition-transform duration-300 group-hover:rotate-6" />
                        </div>
                    )}
                    <div className="flex flex-col">
                        <span className="font-serif text-base sm:text-lg font-bold leading-none text-brand-green-dark tracking-tight">
                            {settings.nama_pesantren || 'Pondok Pesantren'}
                        </span>
                        <span className="font-sans text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-brand-gold-main mt-1">
                            Islamic Boarding School
                        </span>
                    </div>
                </Link>

                {/* Desktop Nav Items */}
                <div className="hidden md:flex items-center gap-7">
                    <div className="flex items-center gap-6 text-sm font-medium">
                        {menuItems.map((item) => {
                            const isActive = activeRoute === item.to;
                            return (
                                <Link
                                    key={item.to}
                                    to={item.to}
                                    className={`relative py-1.5 no-underline transition-colors group font-sans ${
                                        isActive 
                                            ? 'text-brand-green-main font-semibold' 
                                            : 'text-text-body hover:text-brand-green-main'
                                    }`}
                                >
                                    {item.label}
                                    {/* Underline Hover & Active Effect */}
                                    <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-brand-gold-main transition-transform duration-300 origin-left ${
                                        isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                                    }`} />
                                </Link>
                            );
                        })}
                    </div>

                    {/* CTA Button */}
                    <Link
                        to="/ppdb"
                        className="group flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-green-main hover:bg-brand-green-dark text-white font-sans font-semibold text-sm transition-all duration-300 hover:shadow-premium hover:-translate-y-0.5 active:translate-y-0 no-underline"
                    >
                        <span>PPDB Online</span>
                        <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                </div>

                {/* Mobile Menu Hamburger Button */}
                <button
                    onClick={() => setOpen(!open)}
                    className="md:hidden inline-flex items-center justify-center p-2 rounded-xl text-text-title hover:bg-brand-green-light hover:text-brand-green-main focus:outline-none border-none bg-transparent cursor-pointer transition-colors"
                >
                    {open ? <X size={22} /> : <Menu size={22} />}
                </button>
            </div>

            {/* Mobile Dropdown Menu (Floating Card Pattern) */}
            <div className={`absolute top-full left-4 right-4 bg-white/95 backdrop-blur-xl border border-slate-100 rounded-2xl p-4 shadow-xl mt-3 flex flex-col gap-2 transition-all duration-350 transform origin-top ${
                open ? 'opacity-100 scale-y-100 visible' : 'opacity-0 scale-y-95 invisible pointer-events-none'
            }`}>
                <nav className="flex flex-col gap-1 text-sm font-medium">
                    {menuItems.map((item) => {
                        const isActive = activeRoute === item.to;
                        return (
                            <Link
                                key={item.to}
                                to={item.to}
                                onClick={() => setOpen(false)}
                                className={`no-underline py-3 px-4 rounded-xl transition-colors block ${
                                    isActive 
                                        ? 'text-brand-green-main font-semibold bg-brand-green-light' 
                                        : 'text-text-body hover:bg-slate-50 hover:text-brand-green-main'
                                }`}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                    
                    <div className="h-px bg-slate-100 my-2" />
                    
                    {/* Mobile CTA */}
                    <Link
                        to="/ppdb"
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-brand-green-main hover:bg-brand-green-dark text-white font-sans font-semibold text-sm transition-all duration-300 shadow-premium no-underline"
                    >
                        <span>Daftar PPDB Online</span>
                        <ArrowRight size={14} />
                    </Link>
                </nav>
            </div>
        </nav>
    );
}
