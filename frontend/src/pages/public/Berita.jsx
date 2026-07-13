import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { ChevronRight, Newspaper, AlertCircle, Calendar } from 'lucide-react';

export default function Berita() {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const getImageUrl = (path) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        const baseURL = api.defaults.baseURL || 'http://localhost:8000/api';
        const baseDomain = baseURL.replace(/\/api$/, '');
        return `${baseDomain}${path}`;
    };

    useEffect(() => {
        const fetchNews = async () => {
            setLoading(true);
            setError('');
            try {
                const res = await api.get('/news');
                const list = Array.isArray(res.data) ? res.data : (res.data?.data || []);
                setNews(list);
            } catch (err) {
                console.error('Error fetching news:', err);
                setError('Gagal memuat daftar berita. Silakan coba lagi.');
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
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
        if (plainText.length <= 130) return plainText;
        return plainText.substring(0, 130) + '...';
    };

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
            {/* Header Section */}
            <div className="text-center mb-16">
                <span className="text-brand-green-main font-sans font-bold uppercase tracking-widest text-xs block mb-2">Kabar Terbaru</span>
                <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-text-title">
                    Berita & Pengumuman Pesantren
                </h2>
                <div className="w-12 h-[3px] bg-brand-gold-main mx-auto mt-4 rounded-full" />
            </div>

            {error && (
                <div className="mb-8 p-4 bg-rose-50 border border-rose-100 text-rose-700 rounded-2xl flex items-center gap-2.5 text-sm font-semibold max-w-2xl mx-auto">
                    <AlertCircle size={18} className="shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {loading ? (
                <div className="flex flex-col items-center justify-center min-h-[300px]">
                    <div className="w-10 h-10 border-4 border-slate-200 border-t-brand-green-main rounded-full animate-spin" />
                    <p className="mt-4 text-text-body text-sm font-medium">Memuat daftar berita...</p>
                </div>
            ) : news.length === 0 ? (
                <div className="p-16 max-w-xl mx-auto text-center bg-slate-50 rounded-3xl border border-slate-100">
                    <Newspaper size={44} className="text-slate-400 mb-4 inline-block" />
                    <div className="text-lg font-bold text-text-title mb-2">Belum Ada Berita</div>
                    <div className="text-sm text-text-body">Saat ini belum ada artikel berita atau pengumuman yang dipublikasikan.</div>
                </div>
            ) : (
                <div className="flex flex-col gap-6 max-w-4xl mx-auto">
                    {news.map((item, idx) => (
                        <Link 
                            key={item.id || idx}
                            to={`/berita/${item.slug}`}
                            className="group bg-white rounded-3xl border border-slate-200/85 p-5 md:p-6 shadow-md hover:shadow-premium hover:-translate-y-1.5 hover:border-brand-green-main/30 transition-all duration-350 flex flex-col md:flex-row gap-6 items-start cursor-pointer no-underline text-inherit"
                        >
                            {/* Thumbnail */}
                            <div className="w-full md:w-56 h-48 md:h-36 rounded-2xl overflow-hidden shrink-0 bg-slate-50 border border-slate-100/50 shadow-inner">
                                {item.thumbnail ? (
                                    <img 
                                        src={getImageUrl(item.thumbnail)} 
                                        alt={item.title} 
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full bg-brand-green-light flex items-center justify-center">
                                        <Newspaper size={36} className="text-brand-green-main" />
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-grow flex flex-col items-start w-full">
                                {/* Date Badge */}
                                <div className="inline-flex items-center gap-1.5 text-[10px] text-brand-gold-main bg-brand-gold-light px-3 py-1 rounded-full font-sans font-bold uppercase tracking-wider mb-3.5 shadow-sm">
                                    <Calendar size={12} />
                                    <span>{formatDate(item.published_at)}</span>
                                </div>
                                
                                <h3 className="font-serif text-lg md:text-xl font-bold text-text-title mb-2.5 leading-snug group-hover:text-brand-green-main transition-colors">
                                    {item.title}
                                </h3>
                                
                                <p className="font-sans text-sm text-text-body leading-relaxed mb-4 line-clamp-2">
                                    {getExcerpt(item.content)}
                                </p>
                                
                                <div 
                                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-brand-green-main group-hover:text-brand-green-dark group-hover:gap-2 transition-all"
                                >
                                    <span>Baca Selengkapnya</span>
                                    <ChevronRight size={14} />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
