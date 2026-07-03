import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { MapPin, Phone, Mail, AlertCircle, Compass, Clock } from 'lucide-react';

const InstagramIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
);

const FacebookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
);

export default function KontakSection() {
    const [settings, setSettings] = useState({
        alamat: 'Jl. Raya Pesantren No. 123, Sleman, Yogyakarta',
        no_telp: '08123456789',
        email_kontak: 'info@pesantren.com',
        link_ig: '',
        link_fb: ''
    });
    const [error, setError] = useState('');
    const [hoveredSocial, setHoveredSocial] = useState(null);

    useEffect(() => {
        const fetchSettings = async () => {
            setError('');
            try {
                const res = await api.get('/settings');
                if (res.data) {
                    setSettings(prev => ({
                        ...prev,
                        ...res.data
                    }));
                }
            } catch (err) {
                console.error('Error fetching settings for Kontak:', err);
                setError('Gagal memuat informasi kontak dari server. Menampilkan informasi default.');
            }
        };

        fetchSettings();
    }, []);

    const styles = {
        socialBtn: (isActive, isHovered, brandColor) => ({
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: '12px',
            fontSize: '0.875rem',
            fontWeight: '700',
            textDecoration: 'none',
            border: '1px solid #e2e8f0',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            backgroundColor: isHovered ? brandColor : '#ffffff',
            color: isHovered ? '#ffffff' : '#334155',
            borderColor: isHovered ? brandColor : '#e2e8f0',
        })
    };

    return (
        <section id="kontak" className="py-12 sm:py-16 md:py-24 bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-gray-900 mb-6">
                        Hubungi Kami & Lokasi Pesantren
                    </h2>
                </div>

                {error && (
                    <div className="mb-8 p-4 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl flex items-center gap-2 text-sm font-semibold">
                        <AlertCircle size={20} />
                        <span>{error}</span>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Left Column: Contact details */}
                    <div className="flex flex-col gap-6">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Informasi Hubungan</h3>
                            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                                Layanan sekretariat dan administrasi pesantren buka setiap hari kerja. Silakan hubungi nomor di bawah atau kirim surel ke alamat terlampir.
                            </p>
                        </div>

                        <ul className="space-y-4 p-0 list-none">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                                <div>
                                    <span className="text-gray-900 font-bold text-sm block">Alamat Lengkap</span>
                                    <span className="text-sm sm:text-base text-gray-600 leading-relaxed">{settings.alamat}</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <Phone className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                                <div>
                                    <span className="text-gray-900 font-bold text-sm block">Telepon / WhatsApp</span>
                                    <span className="text-sm sm:text-base text-gray-600 leading-relaxed">{settings.no_telp}</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <Mail className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                                <div>
                                    <span className="text-gray-900 font-bold text-sm block">Email Kontak</span>
                                    <span className="text-sm sm:text-base text-gray-600 leading-relaxed">{settings.email_kontak}</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <Clock className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                                <div>
                                    <span className="text-gray-900 font-bold text-sm block">Jam Operasional Kantor</span>
                                    <span className="text-sm sm:text-base text-gray-600 leading-relaxed">Senin - Sabtu: 08.00 - 16.00 WIB</span>
                                </div>
                            </li>
                        </ul>

                        {/* Social Links */}
                        <div className="border-t border-gray-200 pt-6 mt-4">
                            <h4 className="text-slate-500 font-bold uppercase tracking-wider text-xs mb-3">Media Sosial Resmi</h4>
                            <div className="flex items-center gap-3 flex-wrap">
                                {settings.link_ig && (
                                    <a 
                                        href={settings.link_ig} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        style={styles.socialBtn(true, hoveredSocial === 'ig', '#e1306c')}
                                        onMouseEnter={() => setHoveredSocial('ig')}
                                        onMouseLeave={() => setHoveredSocial(null)}
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
                                        style={styles.socialBtn(true, hoveredSocial === 'fb', '#1877f2')}
                                        onMouseEnter={() => setHoveredSocial('fb')}
                                        onMouseLeave={() => setHoveredSocial(null)}
                                    >
                                        <FacebookIcon />
                                        <span>Facebook</span>
                                    </a>
                                )}

                                {!settings.link_ig && !settings.link_fb && (
                                    <span className="text-slate-400 italic text-sm">Media sosial belum ditautkan.</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Google Maps placeholder */}
                    <div className="bg-slate-50 border border-gray-200 border-dashed rounded-2xl min-h-[300px] flex flex-col justify-center items-center p-8 text-center">
                        <Compass className="w-12 h-12 text-slate-400 mb-4" />
                        <h4 className="text-gray-900 font-semibold text-lg mb-2">Peta Lokasi</h4>
                        <p className="text-gray-600 text-sm max-w-xs leading-relaxed m-0">
                            Fitur peta interaktif Google Maps sedang dalam proses konfigurasi. Lokasi pesantren berada tepat sesuai alamat di sebelah kiri.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
