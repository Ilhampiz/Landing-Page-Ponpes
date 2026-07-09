import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export default function Footer() {
    const { settings, loading } = useSettings();

    if (loading || !settings) {
        return <footer className="bg-brand-green-dark text-white border-t border-brand-green-main/20 py-12 md:py-16" />;
    }

    const link_fb = settings.link_facebook || settings.link_fb || '';
    const link_ig = settings.link_instagram || settings.link_ig || '';

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
                            {settings.deskripsi_footer || settings.deskripsi_singkat}
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
                            <Link to="/formulir-pendaftaran" className="hover:text-white transition-colors no-underline">Formulir Pendaftaran</Link>
                        </div>
                    </div>

                    {/* Social Media */}
                    <div className="md:col-span-3 flex flex-col gap-3">
                        <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-brand-gold-main">
                            Hubungan Sosial
                        </h4>
                        <div className="flex flex-col gap-2.5 text-sm font-medium text-brand-green-light/80">
                            {link_fb && (
                                <a 
                                    href={link_fb} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="hover:text-white transition-colors no-underline flex items-center gap-2"
                                >
                                    <span>Facebook Resmi</span>
                                </a>
                            )}
                            {link_ig && (
                                <a 
                                    href={link_ig} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="hover:text-white transition-colors no-underline flex items-center gap-2"
                                >
                                    <span>Instagram Resmi</span>
                                </a>
                            )}
                            {!link_fb && !link_ig && (
                                <span className="italic text-brand-green-light/50">Tidak ada media sosial terhubung.</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="h-px bg-brand-green-main/30 w-full my-8 md:my-10" />

                {/* Bottom Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brand-green-light/60">
                    <p className="margin-0">
                        {settings.copyright_text ? (
                            settings.copyright_text.startsWith('©') || settings.copyright_text.includes('©')
                                ? settings.copyright_text
                                : `© ${new Date().getFullYear()} ${settings.copyright_text}`
                        ) : (
                            `© ${new Date().getFullYear()} Pondok Pesantren Al-Qur'anul Karim. All rights reserved.`
                        )}
                    </p>
                    <p className="margin-0 font-medium text-brand-gold-main/80">
                        Modern Islamic Education System
                    </p>
                </div>
            </div>
        </footer>
    );
}
