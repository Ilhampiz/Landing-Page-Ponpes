import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from 'react-router-dom';
import { BookOpen, Mail, Lock, AlertCircle, ShieldAlert, Loader2 } from 'lucide-react';

export default function Login() {
    const { login } = useAuth();
    const location = useLocation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [sessionExpired, setSessionExpired] = useState(false);
    const [loading, setLoading] = useState(false);

    // Deteksi redirect dari auto-logout (token expired)
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('session') === 'expired') {
            setSessionExpired(true);
        }
    }, [location]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSessionExpired(false);
        setLoading(true);
        try {
            await login(email, password);
        } catch (err) {
            if (err.response?.status === 429) {
                setError('Terlalu banyak percobaan login. Silakan tunggu 1 menit sebelum mencoba lagi.');
            } else {
                setError(err.response?.data?.message || 'Email atau password salah. Silakan coba lagi.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4 py-12 font-sans">
            <div className="w-full max-w-md bg-white border border-slate-200 px-8 py-10 rounded-3xl shadow-lg relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1.5 bg-emerald-700" />
                
                {/* Header Brand */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center space-x-2 text-emerald-800 mb-2">
                        <BookOpen className="w-6 h-6 shrink-0" />
                        <span className="font-serif text-2xl font-bold tracking-wide">Al-Qur'anul Karim</span>
                    </div>
                    <p className="text-slate-400 text-xs font-semibold tracking-wider uppercase">Portal Admin Pesantren</p>
                </div>

                <div className="mb-6 text-center">
                    <h2 className="font-serif text-xl font-bold text-slate-800">Masuk Portal</h2>
                    <p className="text-slate-500 text-xs mt-1">Silakan masukkan akun pengelola Anda</p>
                </div>

                {sessionExpired && (
                    <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl flex items-start space-x-2.5 mb-4 text-xs font-semibold">
                        <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                        <span>Sesi Anda telah berakhir. Silakan masuk kembali.</span>
                    </div>
                )}

                {error && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl flex items-start space-x-2.5 mb-6 text-xs font-semibold">
                        <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Email field */}
                    <div className="flex flex-col space-y-1.5">
                        <label htmlFor="email" className="text-xs font-bold text-slate-600">Email</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                                <Mail className="w-4 h-4" />
                            </span>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 text-xs text-slate-800 bg-white"
                                placeholder="admin@pesantren.com"
                            />
                        </div>
                    </div>

                    {/* Password field */}
                    <div className="flex flex-col space-y-1.5">
                        <label htmlFor="password" className="text-xs font-bold text-slate-600">Kata Sandi</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                                <Lock className="w-4 h-4" />
                            </span>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 text-xs text-slate-800 bg-white"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-emerald-700 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl shadow transition flex items-center justify-center space-x-2 cursor-pointer disabled:bg-emerald-900/60"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Memproses...</span>
                                </>
                            ) : (
                                <span>Masuk Sekarang</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
