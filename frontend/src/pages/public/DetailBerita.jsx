import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { 
    Calendar, 
    User, 
    ChevronLeft, 
    AlertCircle, 
    Newspaper, 
    ArrowUpRight, 
    BookOpen
} from 'lucide-react';

export default function DetailBerita() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [article, setArticle] = useState(null);
    const [recentNews, setRecentNews] = useState([]);
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
        const fetchArticleAndRecent = async () => {
            setLoading(true);
            setError('');
            try {
                // Fetch the detailed article
                const articleRes = await api.get(`/news/${slug}`);
                setArticle(articleRes.data);

                // Fetch all news for the sidebar (filter out current article)
                const listRes = await api.get('/news');
                const list = Array.isArray(listRes.data) ? listRes.data : (listRes.data?.data || []);
                const filtered = list.filter(item => item.slug !== slug).slice(0, 4);
                setRecentNews(filtered);
            } catch (err) {
                console.error('Error fetching article details:', err);
                setError('Gagal memuat detail berita. Berita mungkin tidak ada atau telah dihapus.');
            } finally {
                setLoading(false);
            }
        };

        fetchArticleAndRecent();
        // Scroll to top on page transition
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [slug]);

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('id-ID', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
            });
        } catch (e) {
            return dateStr;
        }
    };

    const formatTime = (dateStr) => {
        if (!dateStr) return '';
        try {
            const date = new Date(dateStr);
            return date.toLocaleTimeString('id-ID', { 
                hour: '2-digit', 
                minute: '2-digit' 
            }) + ' WIB';
        } catch (e) {
            return '';
        }
    };

    // Calculate reading time roughly based on word count
    const getReadingTime = (content) => {
        if (!content) return '1 min';
        const plainText = content.replace(/<[^>]*>/g, '');
        const words = plainText.trim().split(/\s+/).length;
        const time = Math.ceil(words / 200); // 200 words per minute
        return `${time} menit baca`;
    };

    // Extract unique active authors from recent news + current article
    const getActiveAuthors = () => {
        const authors = [];
        const seen = new Set();

        const addAuthor = (newsItem) => {
            if (!newsItem || !newsItem.author) return;
            const authId = newsItem.author.id || newsItem.author_id;
            if (!seen.has(authId)) {
                seen.add(authId);
                authors.push({
                    id: authId,
                    name: newsItem.author.name,
                    role: newsItem.author.role || 'Contributor',
                    email: newsItem.author.email
                });
            }
        };

        addAuthor(article);
        recentNews.forEach(addAuthor);

        // Fallback standard authors if none found
        if (authors.length === 0) {
            authors.push({
                id: 'default',
                name: 'Admin Pesantren',
                role: 'Humas & Publikasi',
                email: 'info@pesantren.id'
            });
        }

        return authors.slice(0, 3);
    };

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 min-h-[600px] flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-slate-200 border-t-brand-green-main rounded-full animate-spin mb-4" />
                <p className="text-text-body text-sm font-medium">Memuat isi berita...</p>
            </div>
        );
    }

    if (error || !article) {
        return (
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 min-h-[500px]">
                <div className="p-8 md:p-16 max-w-xl mx-auto text-center bg-white rounded-3xl border border-slate-200 shadow-premium">
                    <AlertCircle size={48} className="text-rose-500 mb-5 inline-block animate-bounce" />
                    <h3 className="text-xl font-serif font-bold text-text-title mb-3">Berita Tidak Ditemukan</h3>
                    <p className="text-sm text-text-body mb-8 leading-relaxed">
                        {error || 'Maaf, artikel berita yang Anda cari tidak dapat ditemukan atau telah dihapus oleh administrator.'}
                    </p>
                    <Link 
                        to="/berita"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-green-main hover:bg-brand-green-dark text-white rounded-xl text-sm font-bold tracking-wide transition-all shadow-md"
                    >
                        <ChevronLeft size={16} />
                        Kembali ke Daftar Berita
                    </Link>
                </div>
            </div>
        );
    }

    const activeAuthors = getActiveAuthors();

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
            {/* Back Button & Breadcrumbs */}
            <div className="mb-8 flex items-center justify-between">
                <Link 
                    to="/berita" 
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-brand-green-main hover:text-brand-green-dark transition-colors group"
                >
                    <ChevronLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                    Kembali ke Berita
                </Link>
                <div className="text-[10px] uppercase font-sans tracking-widest text-slate-400 font-bold hidden sm:block">
                    Detail Berita &bull; {article.title?.substring(0, 20)}...
                </div>
            </div>

            {/* Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 xl:gap-12 items-start">
                
                {/* Left Column: Article content (2/3 width) */}
                <article className="lg:col-span-2">
                    
                    {/* Feature Image / Thumbnail */}
                    <div className="w-full h-[250px] sm:h-[400px] md:h-[480px] rounded-3xl overflow-hidden bg-slate-100 border border-slate-200/60 shadow-md mb-8 group relative">
                        {article.thumbnail ? (
                            <img 
                                src={getImageUrl(article.thumbnail)} 
                                alt={article.title} 
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-102"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.style.display = 'none';
                                }}
                            />
                        ) : (
                            <div className="w-full h-full bg-brand-green-light flex flex-col items-center justify-center gap-3">
                                <Newspaper size={64} className="text-brand-green-main animate-pulse" />
                                <span className="text-sm font-semibold text-brand-green-main/70">Gambar Tidak Tersedia</span>
                            </div>
                        )}
                    </div>

                    {/* Metadata: Author + Date */}
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-5 border-b border-slate-200/70 pb-5">
                        
                        {/* Author info */}
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-brand-green-main/10 border border-brand-green-main/20 flex items-center justify-center text-brand-green-main font-sans font-bold text-xs uppercase shadow-sm">
                                {article.author?.name ? article.author.name.substring(0, 2) : 'AD'}
                            </div>
                            <div className="text-xs font-semibold text-text-title font-sans">
                                {article.author?.name || 'Administrator'}
                            </div>
                        </div>

                        {/* Divider */}
                        <span className="text-slate-300 text-xs select-none">|</span>

                        {/* Date info */}
                        <div className="flex items-center gap-1 text-xs text-text-body font-sans">
                            <Calendar size={13} className="text-brand-gold-main" />
                            <span>{formatDate(article.published_at)}</span>
                        </div>
                    </div>

                    {/* Article Title */}
                    <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-text-title mb-6 leading-tight tracking-tight">
                        {article.title}
                    </h1>

                    {/* Article Body Content */}
                    <div 
                        className="news-content prose prose-slate max-w-none text-text-body font-sans text-[15px] sm:text-base leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />
                </article>

                {/* Right Column: Sidebar (1/3 width) */}
                <aside className="space-y-10 lg:sticky lg:top-24">
                    
                    {/* Recent News Widget */}
                    <div className="bg-white rounded-3xl border border-slate-200/85 p-6 shadow-premium relative overflow-hidden">
                        {/* Decorative background circle */}
                        <div className="absolute -top-10 -right-10 w-24 h-24 bg-brand-green-light rounded-full -z-0 opacity-40" />

                        <h3 className="font-serif text-lg font-bold text-text-title mb-5 flex items-center justify-between relative z-10">
                            <span>Berita Terbaru</span>
                            <Newspaper size={18} className="text-brand-green-main" />
                        </h3>
                        
                        {recentNews.length === 0 ? (
                            <div className="text-center py-6 text-sm text-text-body bg-slate-50 rounded-2xl border border-slate-100">
                                Belum ada berita lainnya.
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4 relative z-10">
                                {recentNews.map((item, idx) => (
                                    <Link 
                                        key={item.id || idx}
                                        to={`/berita/${item.slug}`}
                                        className="flex gap-4 items-start group no-underline hover:bg-slate-50/50 p-2 -m-2 rounded-2xl transition-all duration-300"
                                    >
                                        {/* Small Thumbnail */}
                                        <div className="w-20 h-16 rounded-xl overflow-hidden shrink-0 bg-slate-50 border border-slate-200/60 shadow-inner relative">
                                            {item.thumbnail ? (
                                                <img 
                                                    src={getImageUrl(item.thumbnail)} 
                                                    alt={item.title} 
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.style.display = 'none';
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-brand-green-light flex items-center justify-center">
                                                    <Newspaper size={18} className="text-brand-green-main" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Card content */}
                                        <div className="flex-grow min-w-0">
                                            <h4 className="font-sans text-sm font-bold text-text-title leading-snug line-clamp-2 group-hover:text-brand-green-main transition-colors mb-1.5">
                                                {item.title}
                                            </h4>
                                            <div className="flex items-center gap-2 text-[10px] text-text-body font-sans font-medium">
                                                <span className="text-brand-gold-main font-bold">
                                                    {item.author?.name ? item.author.name.split(' ')[0] : 'Admin'}
                                                </span>
                                                <span className="text-slate-300">&bull;</span>
                                                <span>{formatDate(item.published_at)}</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Active Authors / Contributors Widget */}
                    <div className="bg-white rounded-3xl border border-slate-200/85 p-6 shadow-premium relative overflow-hidden">
                        {/* Decorative background circle */}
                        <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-brand-gold-light rounded-full -z-0 opacity-50" />

                        <h3 className="font-serif text-lg font-bold text-text-title mb-5 flex items-center justify-between relative z-10">
                            <span>Redaksi & Penulis</span>
                            <User size={18} className="text-brand-gold-main" />
                        </h3>
                        
                        <div className="flex flex-col gap-4 relative z-10">
                            {activeAuthors.map((author, index) => (
                                <div 
                                    key={author.id || index}
                                    className="flex items-center justify-between group p-1"
                                >
                                    <div className="flex items-center gap-3">
                                        {/* User avatar */}
                                        <div className="w-10 h-10 rounded-full bg-brand-gold-light border border-brand-gold-main/20 flex items-center justify-center text-brand-gold-main font-sans font-bold text-sm uppercase">
                                            {author.name ? author.name.substring(0, 2) : 'AD'}
                                        </div>
                                        <div>
                                            <h4 className="font-sans text-sm font-bold text-text-title leading-tight">
                                                {author.name}
                                            </h4>
                                            <p className="text-[11px] text-text-body mt-0.5">
                                                {author.role === 'Admin' ? 'Humas Pesantren' : author.role}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="w-7 h-7 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-brand-green-light group-hover:text-brand-green-main group-hover:border-brand-green-main/20 transition-all">
                                        <ArrowUpRight size={14} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>

            </div>
        </div>
    );
}
