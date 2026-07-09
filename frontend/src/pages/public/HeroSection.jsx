import { useEffect, useRef, useState } from 'react';
import { useSettings } from '../../context/SettingsContext';

const InstagramIcon = ({ size = 18 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
);

const FacebookIcon = ({ size = 18 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
);

const YoutubeIcon = ({ size = 18 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z"/>
        <polygon points="10 15 15 12 10 9"/>
    </svg>
);

/* Floating particle dots */
const particles = [
    { top: '15%', left: '8%', size: 5, delay: '0s',   duration: '6s'  },
    { top: '70%', left: '5%', size: 3, delay: '1.5s', duration: '8s'  },
    { top: '30%', left: '92%', size: 4, delay: '0.8s', duration: '7s' },
    { top: '80%', left: '88%', size: 6, delay: '2s',   duration: '9s' },
    { top: '50%', left: '15%', size: 3, delay: '3s',   duration: '5s' },
    { top: '20%', left: '75%', size: 4, delay: '1s',   duration: '10s'},
];

export default function HeroSection() {
    const { settings, loading } = useSettings();
    const [entered, setEntered] = useState(false);
    const sectionRef = useRef(null);

    /* Trigger entrance animation after settings load */
    useEffect(() => {
        if (!loading && settings) {
            const t = setTimeout(() => setEntered(true), 80);
            return () => clearTimeout(t);
        }
    }, [loading, settings]);

    const getHeroImageUrl = () => {
        if (settings?.hero_image) {
            if (settings.hero_image.startsWith('http')) return settings.hero_image;
            return `http://pesantren-api.test${settings.hero_image}`;
        }
        return '/pesantren_hero.png';
    };

    return (
        <section
            ref={sectionRef}
            id="beranda"
            className="relative min-h-[85vh] md:min-h-[90vh] flex flex-col justify-center items-center bg-cover bg-center bg-no-repeat pt-36 pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden"
            style={{
                backgroundImage: `linear-gradient(rgba(2, 44, 34, 0.82), rgba(2, 44, 34, 0.88)), url('${getHeroImageUrl()}')`,
            }}
        >
            {/* Radial glow from top */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-brand-gold-main/5 rounded-full blur-3xl pointer-events-none" />

            {/* Dot grid overlay */}
            <div className="absolute inset-0 opacity-[0.025] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

            {/* Floating Particles */}
            {particles.map((p, i) => (
                <div
                    key={i}
                    className="absolute rounded-full bg-brand-gold-main/30 pointer-events-none"
                    style={{
                        top: p.top,
                        left: p.left,
                        width: p.size,
                        height: p.size,
                        animation: `float ${p.duration} ${p.delay} ease-in-out infinite alternate`,
                    }}
                />
            ))}

            {/* Floating Social Media Sidebar */}
            {!loading && settings && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-30 pr-3 sm:pr-4 md:pr-6">
                    {(settings.link_instagram || settings.link_ig) && (
                        <a
                            href={settings.link_instagram || settings.link_ig}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-xl bg-brand-green-main hover:bg-brand-gold-main text-white flex items-center justify-center transition-all duration-300 shadow-md hover:-translate-x-1 hover:scale-110 border border-white/10"
                            title="Instagram"
                            style={{ animation: 'slideInRight 0.6s 0.8s both' }}
                        >
                            <InstagramIcon size={18} />
                        </a>
                    )}
                    {(settings.link_facebook || settings.link_fb) && (
                        <a
                            href={settings.link_facebook || settings.link_fb}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-xl bg-brand-green-main hover:bg-brand-gold-main text-white flex items-center justify-center transition-all duration-300 shadow-md hover:-translate-x-1 hover:scale-110 border border-white/10"
                            title="Facebook"
                            style={{ animation: 'slideInRight 0.6s 1.0s both' }}
                        >
                            <FacebookIcon size={18} />
                        </a>
                    )}
                    {settings.link_youtube && (
                        <a
                            href={settings.link_youtube}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-xl bg-brand-green-main hover:bg-brand-gold-main text-white flex items-center justify-center transition-all duration-300 shadow-md hover:-translate-x-1 hover:scale-110 border border-white/10"
                            title="YouTube"
                            style={{ animation: 'slideInRight 0.6s 1.2s both' }}
                        >
                            <YoutubeIcon size={18} />
                        </a>
                    )}
                </div>
            )}

            {/* Main Content */}
            <div className="max-w-4xl mx-auto w-full relative z-10 text-center flex flex-col items-center gap-6">
                {loading || !settings ? (
                    /* Skeleton */
                    <div className="space-y-5 w-full flex flex-col items-center py-4">
                        <div className="h-10 sm:h-12 lg:h-14 w-4/5 md:w-3/4 bg-white/10 animate-pulse rounded-2xl" />
                        <div className="h-10 sm:h-12 lg:h-14 w-3/5 md:w-1/2 bg-white/10 animate-pulse rounded-2xl" />
                        <div className="h-4 w-5/6 md:w-2/3 bg-white/5 animate-pulse rounded-lg mt-8" />
                        <div className="h-4 w-2/3 md:w-1/2 bg-white/5 animate-pulse rounded-lg" />
                    </div>
                ) : (
                    <>
                        {/* Title */}
                        <h1
                            className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight max-w-3xl drop-shadow-md"
                            style={{
                                opacity: entered ? 1 : 0,
                                transform: entered ? 'translateY(0)' : 'translateY(30px)',
                                transition: 'opacity 0.8s 0.25s ease-out, transform 0.8s 0.25s ease-out',
                            }}
                        >
                            {settings.hero_title || 'Pondok Pesantren'}
                        </h1>

                        {/* Gold divider */}
                        <div
                            className="h-[3px] bg-gradient-to-r from-transparent via-brand-gold-main to-transparent rounded-full"
                            style={{
                                width: entered ? '8rem' : '0rem',
                                transition: 'width 0.8s 0.5s ease-out',
                                opacity: entered ? 1 : 0,
                            }}
                        />

                        {/* Subtitle */}
                        <p
                            className="font-sans text-base sm:text-lg text-brand-green-light/90 leading-relaxed max-w-2xl mx-auto"
                            style={{
                                opacity: entered ? 1 : 0,
                                transform: entered ? 'translateY(0)' : 'translateY(20px)',
                                transition: 'opacity 0.8s 0.55s ease-out, transform 0.8s 0.55s ease-out',
                            }}
                        >
                            {settings.hero_subtitle || ''}
                        </p>
                    </>
                )}
            </div>

            {/* Inline keyframes */}
            <style>{`
                @keyframes float {
                    from { transform: translateY(0px) scale(1); opacity: 0.3; }
                    to   { transform: translateY(-18px) scale(1.15); opacity: 0.7; }
                }
                @keyframes slideInRight {
                    from { opacity: 0; transform: translateX(20px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translate(-50%, 16px); }
                    to   { opacity: 1; transform: translate(-50%, 0); }
                }
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50%       { transform: translateY(6px); }
                }
            `}</style>
        </section>
    );
}
