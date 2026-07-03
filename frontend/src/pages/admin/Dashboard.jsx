import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import Sidebar from '../../components/Sidebar';
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
        { title: 'Jumlah Berita', count: stats.newsCount, path: '/admin/news', icon: Newspaper, color: 'bg-blue-50 text-blue-700 border-blue-100' },
        { title: 'Jumlah Foto', count: stats.galleryCount, path: '/admin/gallery', icon: Image, color: 'bg-indigo-50 text-indigo-700 border-indigo-100' },
        { title: 'Jumlah Program', count: stats.programCount, path: '/admin/programs', icon: GraduationCap, color: 'bg-amber-50 text-amber-700 border-amber-100' },
        { title: 'Pendaftar PPDB', count: stats.ppdbCount, path: '/admin/ppdb', icon: Users, color: 'bg-emerald-50 text-emerald-700 border-emerald-100' }
    ];

    return (
        <div className="min-h-screen bg-slate-50 font-sans flex">
            {/* Sidebar fixed di kiri */}
            <Sidebar />

            {/* Konten di kanan (margin-left: 220px untuk mengimbangi sidebar fixed) */}
            <div className="flex-grow ml-[220px] flex flex-col min-w-0">
                <header className="bg-white border-b border-slate-200 py-4 px-8 flex justify-between items-center h-16 shrink-0 shadow-xs">
                    <h1 className="text-lg font-bold text-slate-800 font-serif">Panel Dashboard</h1>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                        {admin?.name || 'Administrator'}
                    </span>
                </header>

                <main className="flex-grow p-6 md:p-8 overflow-y-auto max-w-7xl w-full space-y-6">
                    {/* Welcome banner */}
                    <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 p-6 md:p-8 rounded-3xl text-white shadow relative overflow-hidden">
                        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
                        <div className="relative z-10 space-y-2">
                            <h2 className="text-xl sm:text-2xl font-bold font-serif">Selamat Datang, {admin?.name || 'Admin'}!</h2>
                            <p className="text-emerald-100/90 text-xs md:text-sm max-w-xl leading-relaxed">
                                Senang melihat Anda kembali. Di sini Anda dapat memantau ringkasan statistik terkini dari situs web Pondok Pesantren Al-Qur'anul Karim.
                            </p>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl text-xs font-semibold">
                            {error}
                        </div>
                    )}

                    {/* Stats summary section */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-slate-800 font-serif uppercase tracking-wider">Statistik Portal</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {cards.map((card, idx) => {
                                const Icon = card.icon;
                                return (
                                    <div 
                                        key={idx} 
                                        className={`border p-6 rounded-2xl transition-all duration-200 flex flex-col justify-between h-36 ${card.color}`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="p-2.5 rounded-lg bg-white shadow-xs">
                                                <Icon className="w-5 h-5 text-slate-700" />
                                            </div>
                                            {loading ? (
                                                <div className="h-7 w-10 bg-slate-200/60 animate-pulse rounded-md" />
                                            ) : (
                                                <span className="text-2xl font-bold tracking-tight">{card.count}</span>
                                            )}
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold opacity-80">{card.title}</p>
                                            <Link to={card.path} className="text-[10px] font-bold inline-flex items-center space-x-1 hover:underline">
                                                <span>Kelola</span>
                                                <ArrowRight className="w-3 h-3" />
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
