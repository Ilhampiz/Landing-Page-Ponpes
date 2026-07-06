import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import PageHeader from '../../components/admin/PageHeader';
import { Newspaper, Image, GraduationCap, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
    const { admin } = useAuth();
    const [stats, setStats] = useState({
        newsCount: 0,
        galleryCount: 0,
        programCount: 0,
        ppdbCount: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [newsRes, galleryRes, programsRes, ppdbRes] = await Promise.all([
                    api.get('/admin/news'),
                    api.get('/admin/gallery'),
                    api.get('/admin/programs'),
                    api.get('/admin/ppdb')
                ]);

                setStats({
                    newsCount: Array.isArray(newsRes.data) ? newsRes.data.length : (newsRes.data?.data?.length || 0),
                    galleryCount: Array.isArray(galleryRes.data) ? galleryRes.data.length : (galleryRes.data?.data?.length || 0),
                    programCount: Array.isArray(programsRes.data) ? programsRes.data.length : (programsRes.data?.data?.length || 0),
                    ppdbCount: Array.isArray(ppdbRes.data) ? ppdbRes.data.length : (ppdbRes.data?.data?.length || 0),
                });
            } catch (err) {
                console.error('Error fetching dashboard stats:', err);
                setError('Gagal memuat beberapa data statistik.');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const cards = [
        { title: 'Jumlah Berita', count: stats.newsCount, path: '/admin/news', icon: Newspaper, iconColor: 'text-blue-600 bg-blue-50 border-blue-100' },
        { title: 'Jumlah Foto', count: stats.galleryCount, path: '/admin/gallery', icon: Image, iconColor: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
        { title: 'Jumlah Program', count: stats.programCount, path: '/admin/programs', icon: GraduationCap, iconColor: 'text-amber-600 bg-amber-50 border-amber-100' },
        { title: 'Pendaftar PPDB', count: stats.ppdbCount, path: '/admin/ppdb', icon: Users, iconColor: 'text-emerald-600 bg-emerald-50 border-emerald-100' }
    ];

    return (
        <>
            <PageHeader title="Panel Dashboard">
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                    {admin?.name || 'Administrator'}
                </span>
            </PageHeader>

            <main className="flex-grow p-6 md:p-8 overflow-y-auto max-w-7xl w-full space-y-6">
                {/* Welcome banner */}
                <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm relative overflow-hidden">
                    <div className="space-y-1 relative z-10">
                        <h2 className="text-base sm:text-lg font-serif font-bold text-slate-900">Selamat Datang Kembali, {admin?.name || 'Admin'}!</h2>
                        <p className="text-slate-500 text-[11px] sm:text-xs md:text-sm max-w-xl leading-relaxed">
                            Di sini Anda dapat memantau ringkasan statistik terkini dari situs web Pondok Pesantren Al-Qur'anul Karim.
                        </p>
                    </div>
                    <div className="shrink-0 flex items-center">
                        <span className="text-[11px] sm:text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-100 px-3.5 py-2 rounded-xl">
                            Role: {admin?.role || 'Administrator'}
                        </span>
                    </div>
                </div>

                {error && (
                    <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl text-xs font-semibold">
                        {error}
                    </div>
                )}

                {/* Stats summary section */}
                <div className="space-y-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Statistik Portal</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {cards.map((card, idx) => {
                            const Icon = card.icon;
                            return (
                                <div 
                                    key={idx} 
                                    className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-slate-350 transition-all duration-200 flex flex-col justify-between h-36 group"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider">{card.title}</p>
                                            {loading ? (
                                                <div className="h-9 w-16 bg-slate-100 animate-pulse rounded-md" />
                                            ) : (
                                                <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-800">{card.count}</span>
                                            )}
                                        </div>
                                        <div className={`p-2.5 rounded-xl border ${card.iconColor} shrink-0`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                                        <Link to={card.path} className="text-[11px] sm:text-xs font-semibold text-emerald-700 hover:text-emerald-800 inline-flex items-center space-x-1">
                                            <span>Kelola Data</span>
                                            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </main>
        </>
    );
}
