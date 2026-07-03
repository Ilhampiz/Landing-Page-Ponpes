import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { GraduationCap, AlertCircle, BookOpen } from 'lucide-react';

export default function ProgramSection() {
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPrograms = async () => {
            setLoading(true);
            setError('');
            try {
                const res = await api.get('/programs');
                const list = Array.isArray(res.data) ? res.data : (res.data?.data || []);
                const sorted = list.sort((a, b) => (a.order || 0) - (b.order || 0));
                setPrograms(sorted);
            } catch (err) {
                console.error('Error fetching programs:', err);
                setError('Gagal memuat daftar program kurikulum. Silakan coba lagi.');
            } finally {
                setLoading(false);
            }
        };

        fetchPrograms();
    }, []);

    const styles = {
        card: {
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            border: '1px solid #f1f5f9',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        imageContainer: {
            width: '100%',
            height: '200px',
            borderRadius: '12px',
            overflow: 'hidden',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
        },
        image: {
            width: '100%',
            height: '100%',
            objectFit: 'cover',
        },
        iconPlaceholder: {
            backgroundColor: '#d1fae5',
            color: '#065f46',
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        orderBadge: {
            alignSelf: 'flex-start',
            backgroundColor: '#f1f5f9',
            color: '#64748b',
            fontSize: '0.75rem',
            fontWeight: '700',
            padding: '4px 10px',
            borderRadius: '6px',
            fontFamily: 'monospace',
        },
        emptyContainer: {
            textAlign: 'center',
            backgroundColor: '#f8fafc',
            borderRadius: '24px',
            border: '1px solid #e2e8f0',
        }
    };

    return (
        <section id="program" className="py-12 sm:py-16 md:py-24 bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-gray-900 mb-6">
                        Program & Kurikulum Pendidikan
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
                        <p className="mt-4 text-slate-500 text-sm font-medium">Memuat daftar program...</p>
                    </div>
                ) : programs.length === 0 ? (
                    <div className="p-16 max-w-xl mx-auto text-center bg-slate-50 rounded-2xl border border-gray-200">
                        <GraduationCap size={48} className="text-slate-400 mb-4 inline-block" />
                        <div className="text-lg font-bold text-slate-700 mb-2">Belum ada program</div>
                        <div className="text-sm text-slate-500">Saat ini program pendidikan belum tersedia atau sedang diperbarui oleh admin.</div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {programs.map((program, idx) => (
                            <div 
                                key={program.id || idx}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-350 flex flex-col gap-4"
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <span className="bg-slate-100 text-slate-600 text-[10px] font-bold py-1 px-2.5 rounded-md uppercase tracking-wider font-mono">
                                        PROGRAM #{program.order !== undefined ? program.order : idx + 1}
                                    </span>
                                </div>

                                {program.icon_or_image ? (
                                    <div className="w-full h-44 rounded-lg overflow-hidden bg-slate-50 border border-slate-100">
                                        <img 
                                            src={program.icon_or_image} 
                                            alt={program.title} 
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <div className="bg-emerald-50 text-emerald-800 w-12 h-12 rounded-xl flex items-center justify-center mb-2">
                                        <BookOpen size={24} />
                                    </div>
                                )}

                                <div>
                                    <h3 className="text-base font-semibold text-gray-900 mb-2">{program.title}</h3>
                                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                                        {program.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
