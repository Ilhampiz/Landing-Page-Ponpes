import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { MapPin, Phone, Mail, AlertCircle, Compass, Clock } from 'lucide-react';

const InstagramIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
);

const FacebookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
);

export default function Kontak() {
    const [settings, setSettings] = useState({
        alamat: '',
        no_telp: '',
        no_wa: '',
        email_kontak: '',
        link_ig: '',
        link_fb: '',
        link_instagram: '',
        link_facebook: '',
    });
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSettings = async () => {
            setError('');
            try {
                const res = await api.get('/settings');
                if (res.data) {
                    setSettings(prev => ({
                        ...prev,
                        ...res.data,
                        link_fb: res.data.link_facebook || res.data.link_fb || '',
                        link_ig: res.data.link_instagram || res.data.link_ig || '',
                        no_wa: res.data.no_wa || '',
                    }));
                }
            } catch (err) {
                console.error('Error fetching settings for Kontak:', err);
                setError('Gagal memuat informasi kontak dari server. Menampilkan informasi default.');
            }
        };

        fetchSettings();
    }, []);

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
            {/* Header Section */}
            <div className="text-center mb-16">
                <span className="text-brand-green-main font-sans font-bold uppercase tracking-widest text-xs block mb-2">Hubungi Kami</span>
                <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-text-title">
                    Informasi Kontak & Peta Lokasi
                </h2>
                <div className="w-12 h-[3px] bg-brand-gold-main mx-auto mt-4 rounded-full" />
            </div>

            {error && (
                <div className="mb-8 p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-center gap-2.5 text-sm font-semibold text-brand-gold-dark max-w-2xl mx-auto shadow-sm">
                    <AlertCircle size={18} className="shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-stretch max-w-5xl mx-auto">
                {/* Left Column: Contact details Card */}
                <div className="md:col-span-7 bg-white border border-slate-100 p-6 sm:p-8 rounded-3xl shadow-premium flex flex-col justify-between gap-8">
                    <div>
                        <h3 className="font-serif text-xl md:text-2xl font-bold text-text-title mb-3">
                            Informasi Layanan
                        </h3>
                        <p className="font-sans text-sm text-text-body leading-relaxed mb-6">
                            Layanan administrasi dan informasi pendaftaran santri baru siap melayani Anda di jam operasional kantor.
                        </p>
                        
                        <ul className="space-y-5 p-0 list-none m-0">
                            <li className="flex items-start gap-4">
                                <div className="p-2.5 bg-brand-green-light text-brand-green-main rounded-xl shrink-0 mt-0.5">
                                    <MapPin size={18} />
                                </div>
                                <div>
                                    <span className="text-text-title font-sans font-bold text-xs uppercase tracking-wider block">Alamat Lengkap</span>
                                    <span className="text-sm text-text-body mt-1 block leading-relaxed">{settings.alamat}</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="p-2.5 bg-brand-green-light text-brand-green-main rounded-xl shrink-0 mt-0.5">
                                    <Phone size={18} />
                                </div>
                                <div>
                                    <span className="text-text-title font-sans font-bold text-xs uppercase tracking-wider block">Telepon / WhatsApp</span>
                                    <span className="text-sm text-text-body mt-1 block leading-relaxed">
                                        {settings.no_wa ? `${settings.no_telp} / ${settings.no_wa}` : settings.no_telp}
                                    </span>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="p-2.5 bg-brand-green-light text-brand-green-main rounded-xl shrink-0 mt-0.5">
                                    <Mail size={18} />
                                </div>
                                <div>
                                    <span className="text-text-title font-sans font-bold text-xs uppercase tracking-wider block">Email Resmi</span>
                                    <span className="text-sm text-text-body mt-1 block leading-relaxed">{settings.email_kontak}</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="p-2.5 bg-brand-green-light text-brand-green-main rounded-xl shrink-0 mt-0.5">
                                    <Clock size={18} />
                                </div>
                                <div>
                                    <span className="text-text-title font-sans font-bold text-xs uppercase tracking-wider block">Jam Operasional Kantor</span>
                                    <span className="text-sm text-text-body mt-1 block leading-relaxed">Senin - Sabtu: 08.00 - 16.00 WIB</span>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* Social Media Row */}
                    <div className="border-t border-slate-100 pt-6">
                        <span className="text-text-body font-sans font-bold uppercase tracking-wider text-[10px] block mb-3.5">
                            Ikuti Media Sosial Kami
                        </span>
                        <div className="flex items-center gap-3 flex-wrap">
                            {settings.link_ig && (
                                <a 
                                    href={settings.link_ig} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-200 text-text-body hover:bg-[#e1306c] hover:text-white hover:border-[#e1306c] transition-all duration-300 font-sans font-bold text-xs no-underline cursor-pointer"
                                >
                                    <InstagramIcon />
                                    <span>Instagram</span>
                                </a>
                            )}

                            {settings.link_fb && (
                                <a 
                                    href={settings.link_fb} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-200 text-text-body hover:bg-[#1877f2] hover:text-white hover:border-[#1877f2] transition-all duration-300 font-sans font-bold text-xs no-underline cursor-pointer"
                                >
                                    <FacebookIcon />
                                    <span>Facebook</span>
                                </a>
                            )}

                            {!settings.link_ig && !settings.link_fb && (
                                <span className="text-slate-400 italic text-xs font-medium">Belum ada tautan media sosial.</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Google Maps Placeholder Card */}
                <div className="md:col-span-5 bg-brand-green-light border border-brand-green-main/10 rounded-3xl min-h-[350px] flex flex-col justify-center items-center p-8 text-center shadow-inner relative overflow-hidden group">
                    {/* Visual Gold bar decoration */}
                    <div className="absolute top-0 left-0 right-0 h-[4px] bg-brand-gold-main" />

                    <div className="p-4 bg-white text-brand-green-main rounded-2xl shadow-sm mb-4 transition-transform duration-500 group-hover:rotate-6">
                        <Compass size={28} className="animate-spin duration-10000" />
                    </div>
                    <h4 className="font-serif text-lg font-bold text-text-title mb-2">Peta Lokasi Pesantren</h4>
                    <p className="font-sans text-xs sm:text-sm text-text-body max-w-xs leading-relaxed m-0">
                        Fitur peta interaktif Google Maps sedang dalam proses konfigurasi. Lokasi fisik berada di koordinat resmi sesuai alamat administrasi.
                    </p>
                </div>
            </div>
        </div>
    );
}
