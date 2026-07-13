import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { MapPin, Phone, Mail, AlertCircle, Compass, Clock, MessageSquare } from 'lucide-react';

const InstagramIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
);

const FacebookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
);

const YoutubeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
        <path d="m10 15 5-3-5-3v6Z" />
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
        link_youtube: '',
        link_instagram: '',
        link_facebook: '',
    });
    const [error, setError] = useState('');

    const formatWaLink = (number) => {
        if (!number) return '#';
        let cleaned = number.replace(/\D/g, '');
        if (cleaned.startsWith('0')) {
            cleaned = '62' + cleaned.slice(1);
        }
        return `https://wa.me/${cleaned}`;
    };

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
                        link_youtube: res.data.link_youtube || '',
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

                        {/* Social Media Row */}
                        <div className="border-t border-slate-100 pt-6 mt-6">
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

                                {settings.link_youtube && (
                                    <a
                                        href={settings.link_youtube}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-200 text-text-body hover:bg-[#ff0000] hover:text-white hover:border-[#ff0000] transition-all duration-300 font-sans font-bold text-xs no-underline cursor-pointer"
                                    >
                                        <YoutubeIcon />
                                        <span>YouTube</span>
                                    </a>
                                )}

                                {!settings.link_ig && !settings.link_fb && !settings.link_youtube && (
                                    <span className="text-slate-400 italic text-xs font-medium">Belum ada tautan media sosial.</span>
                                )}
                            </div>
                        </div>

                        {/* Direct Action Banner Buttons */}
                        <div className="mt-7 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            {settings.no_wa && (
                                <a
                                    href={formatWaLink(settings.no_wa)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-center justify-center gap-2.5 px-5 py-3.5 bg-brand-green-main hover:bg-brand-gold-main text-white border border-brand-gold-main/40 rounded-2xl font-sans font-bold text-xs sm:text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 no-underline"
                                >
                                    <MessageSquare size={18} className="text-brand-gold-main group-hover:text-white transition-colors" />
                                    <span>Chat WhatsApp Admin</span>
                                </a>
                            )}
                            {settings.email_kontak && (
                                <a
                                    href={`mailto:${settings.email_kontak}`}
                                    className="group flex items-center justify-center gap-2.5 px-5 py-3.5 bg-brand-green-main hover:bg-brand-gold-main text-white border border-brand-gold-main/40 rounded-2xl font-sans font-bold text-xs sm:text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 no-underline"
                                >
                                    <Mail size={18} className="text-brand-gold-main group-hover:text-white transition-colors" />
                                    <span>Kirim Email Resmi</span>
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Google Maps Interactive Embed */}
                <div className="md:col-span-5 bg-white border border-slate-200 rounded-3xl min-h-[380px] overflow-hidden shadow-sm relative flex flex-col">
                    <div className="px-5 py-4 bg-brand-green-dark text-white flex items-center justify-between z-10 shrink-0">
                        <div className="flex items-center gap-2.5">
                            <Compass size={18} className="text-brand-gold-main" />
                            <span className="font-serif font-bold text-sm sm:text-base">Peta Lokasi Pesantren</span>
                        </div>
                        <a
                            href="https://maps.google.com/?q=-6.923238668240691,110.17150326950274"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-sans text-brand-gold-main hover:underline flex items-center gap-1 font-semibold"
                        >
                            Buka Google Maps ↗
                        </a>
                    </div>
                    <div className="w-full flex-grow relative min-h-[340px]">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d990.1816737497826!2d110.17150326950274!3d-6.923238668240691!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNsKwNTUnMjMuNyJTIDExMMKwMTAnMTkuNyJF!5e0!3m2!1sid!2sid!4v1783805764487!5m2!1sid!2sid"
                            className="absolute inset-0 w-full h-full border-0"
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Peta Lokasi Pesantren"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
