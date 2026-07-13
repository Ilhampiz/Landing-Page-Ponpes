import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { GraduationCap, AlertCircle } from 'lucide-react';
import ProgramCard from "../../components/ProgramCard";

export default function Program() {
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

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
            {/* Header Section */}
            <div className="text-center mb-16">
                <span className="text-brand-green-main font-sans font-bold uppercase tracking-widest text-xs block mb-2">Kurikulum</span>
                <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-text-title">
                    Program & Kurikulum Pendidikan
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
                    <p className="mt-4 text-text-body text-sm font-medium">Memuat daftar program...</p>
                </div>
            ) : programs.length === 0 ? (
                <div className="p-16 max-w-xl mx-auto text-center bg-slate-50 rounded-3xl border border-slate-100">
                    <GraduationCap size={44} className="text-slate-400 mb-4 inline-block" />
                    <div className="text-lg font-bold text-text-title mb-2">Belum ada program</div>
                    <div className="text-sm text-text-body">Saat ini program pendidikan belum tersedia atau sedang diperbarui oleh admin.</div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {programs.map((program, idx) => (
                        <ProgramCard 
                            key={program.id || idx}
                            title={program.title}
                            description={program.description}
                            category={program.category || `Program #${program.order !== undefined ? program.order : idx + 1}`}
                            icon_or_image={program.icon_or_image}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
