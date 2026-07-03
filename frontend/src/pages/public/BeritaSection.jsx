import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { ChevronRight, Newspaper, AlertCircle } from 'lucide-react';

export default function BeritaSection() {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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
        <section id="berita" className="py-12 sm:py-16 md:py-24 bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-gray-900 mb-6">
                        Berita & Pengumuman Terbaru
                    </h2>
                </div>

                {error && (
                    <div className="mb-8 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-2 text-sm font-semibold">
                        <AlertCircle size={20} />
                        <span>{error}</span>
                    </div>
                )}

                {loading ? (
                    <div className="flex flex-col items-center justify-center min-h-[300px]">
                        <div className="w-12 h-12 border-4 border-slate-200 border-t-emerald-600 rounded-full animate-spin" />
                        <p className="mt-4 text-slate-500 text-sm font-medium">Memuat daftar berita...</p>
                    </div>
                ) : news.length === 0 ? (
                    <div className="p-16 max-w-xl mx-auto text-center bg-slate-50 rounded-2xl border border-gray-200">
                        <Newspaper size={48} className="text-slate-400 mb-4 inline-block" />
                        <div className="text-lg font-bold text-slate-700 mb-2">Belum Ada Berita</div>
                        <div className="text-sm text-slate-500">Saat ini belum ada artikel berita atau pengumuman yang dipublikasikan.</div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {news.map((item, idx) => (
                            <article 
                                key={item.id || idx}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-md transition-shadow flex flex-col md:flex-row gap-4 sm:gap-6 items-start cursor-pointer"
                            >
                                {item.thumbnail && (
                                    <div className="w-full md:w-48 h-44 md:h-28 rounded-lg overflow-hidden shrink-0 bg-slate-50 border border-slate-100">
                                        <img 
                                            src={item.thumbnail} 
                                            alt={item.title} 
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                    </div>
                                )}

                                <div className="flex-grow">
                                    <div className="text-xs text-gray-400 uppercase tracking-wide mb-1 flex items-center gap-1.5 font-medium">
                                        <span>Berita</span>
                                        <span>•</span>
                                        <span>{formatDate(item.published_at)}</span>
                                    </div>
                                    
                                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 leading-snug">{item.title}</h3>
                                    
                                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
                                        {getExcerpt(item.content)}
                                    </p>
                                    
                                    <Link 
                                        to={`/berita/${item.slug}`} 
                                        className="inline-flex items-center gap-1 text-emerald-600 text-sm font-semibold hover:text-emerald-700 hover:gap-1.5 transition-all no-underline"
                                    >
                                        <span>Baca Selengkapnya</span>
                                        <ChevronRight size={16} />
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
