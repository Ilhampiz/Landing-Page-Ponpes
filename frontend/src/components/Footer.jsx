import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { BookOpen } from 'lucide-react';

export default function Footer() {
    const [settings, setSettings] = useState({
        nama_pesantren: 'Pondok Pesantren Al-Qur\'anul Karim',
        deskripsi_footer: 'Membentuk generasi penghafal Al-Qur\'an yang cerdas, berakhlak mulia, mandiri, dan berintegritas tinggi di bawah bimbingan guru tersertifikasi.',
        copyright_text: 'Pondok Pesantren Al-Qur\'anul Karim. All rights reserved.',
        link_ig: '',
        link_fb: '',
        link_instagram: '',
        link_facebook: '',
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await api.get('/settings');
                if (res.data) {
                    setSettings(prev => ({
                        ...prev,
                        ...res.data,
                        link_fb: res.data.link_facebook || res.data.link_fb || '',
                        link_ig: res.data.link_instagram || res.data.link_ig || '',
                    }));
                }
            } catch (err) {
                console.error('Error fetching settings for Footer:', err);
            }
        };
        fetchSettings();
    }, []);

    return (
        <footer className="bg-brand-green-dark text-white border-t border-brand-green-main/20 py-12 md:py-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
                    {/* Brand Info */}
                    <div className="md:col-span-6 flex flex-col items-start gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-brand-green-main rounded-xl text-white border border-brand-green-light/10 shadow-sm">
                                <BookOpen size={20} />
                            </div>
                            <span className="font-serif text-lg font-bold tracking-tight text-white">
                                {settings.nama_pesantren}
                            </span>
                        </div>
                        <p className="font-sans text-sm text-brand-green-light/80 leading-relaxed max-w-sm">
                            {settings.deskripsi_footer}
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="md:col-span-3 flex flex-col gap-3">
                        <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-brand-gold-main">
                            Navigasi Publik
                        </h4>
                        <div className="flex flex-col gap-2.5 text-sm font-medium text-brand-green-light/80">
                            <Link to="/" className="hover:text-white transition-colors no-underline">Beranda</Link>
                            <Link to="/profil" className="hover:text-white transition-colors no-underline">Profil Pesantren</Link>
                            <Link to="/program" className="hover:text-white transition-colors no-underline">Program & Kurikulum</Link>
                            <Link to="/ppdb" className="hover:text-white transition-colors no-underline">PPDB Online</Link>
                        </div>
                    </div>

                    {/* Social Media */}
                    <div className="md:col-span-3 flex flex-col gap-3">
                        <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-brand-gold-main">
                            Hubungan Sosial
                        </h4>
                        <div className="flex flex-col gap-2.5 text-sm font-medium text-brand-green-light/80">
                            {settings.link_fb && (
                                <a 
                                    href={settings.link_fb} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="hover:text-white transition-colors no-underline flex items-center gap-2"
                                >
                                    <span>Facebook Resmi</span>
                                </a>
                            )}
                            {settings.link_ig && (
                                <a 
                                    href={settings.link_ig} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="hover:text-white transition-colors no-underline flex items-center gap-2"
                                >
                                    <span>Instagram Resmi</span>
                                </a>
                            )}
                            {!settings.link_fb && !settings.link_ig && (
                                <span className="italic text-brand-green-light/50">Tidak ada media sosial terhubung.</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="h-px bg-brand-green-main/30 w-full my-8 md:my-10" />

                {/* Bottom Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brand-green-light/60">
                    <p className="margin-0">
                        &copy; {new Date().getFullYear()} {settings.copyright_text}
                    </p>
                    <p className="margin-0 font-medium text-brand-gold-main/80">
                        Modern Islamic Education System
                    </p>
                </div>
            </div>
        </footer>
    );
}
