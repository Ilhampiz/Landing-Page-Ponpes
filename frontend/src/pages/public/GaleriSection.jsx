import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Camera, AlertCircle } from 'lucide-react';

export default function GaleriSection() {
    const [gallery, setGallery] = useState([]);
    const [categories, setCategories] = useState(['All']);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchGallery = async () => {
            setLoading(true);
            setError('');
            try {
                const res = await api.get('/gallery');
                const list = Array.isArray(res.data) ? res.data : (res.data?.data || []);
                setGallery(list);

                const uniqueCats = list
                    .map(item => item.category)
                    .filter((cat, idx, self) => cat && self.indexOf(cat) === idx);
                
                setCategories(['All', ...uniqueCats]);
            } catch (err) {
                console.error('Error fetching gallery:', err);
                setError('Gagal memuat galeri foto. Silakan coba lagi.');
            } finally {
                setLoading(false);
            }
        };

        fetchGallery();
    }, []);

    const filteredGallery = selectedCategory === 'All'
        ? gallery
        : gallery.filter(item => item.category === selectedCategory);

    return (
        <section id="galeri" className="py-12 sm:py-16 md:py-24 bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-gray-900 mb-6">
                        Galeri Kegiatan & Fasilitas
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
                        <p className="mt-4 text-slate-500 text-sm font-medium">Memuat galeri foto...</p>
                    </div>
                ) : gallery.length === 0 ? (
                    <div className="p-16 max-w-xl mx-auto text-center bg-slate-50 rounded-2xl border border-gray-200">
                        <Camera size={48} className="text-slate-400 mb-4 inline-block" />
                        <div className="text-lg font-bold text-slate-700 mb-2">Galeri Kosong</div>
                        <div className="text-sm text-slate-500">Saat ini dokumentasi foto belum tersedia atau sedang diperbarui.</div>
                    </div>
                ) : (
                    <>
                        {categories.length > 1 && (
                            <div className="flex justify-center items-center flex-wrap gap-2.5 mb-10">
                                {categories.map((cat) => {
                                    const isActive = selectedCategory === cat;
                                    return (
                                        <button
                                            key={cat}
                                            onClick={() => setSelectedCategory(cat)}
                                            className={`px-5 py-2 rounded-full text-xs font-bold transition-all border border-solid border-gray-200 cursor-pointer ${
                                                isActive 
                                                    ? 'bg-emerald-600 border-emerald-650 text-white shadow-[0_4px_12px_rgba(5,150,105,0.2)]' 
                                                    : 'bg-gray-55 text-gray-600 hover:bg-gray-100'
                                            }`}
                                        >
                                            {cat === 'All' ? 'Semua' : cat}
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                            {filteredGallery.map((photo, idx) => (
                                <div key={photo.id || idx} className="relative group overflow-hidden rounded-lg">
                                    <img 
                                        src={photo.image_path} 
                                        alt={photo.title || 'Gambar Galeri'} 
                                        className="w-full h-32 sm:h-40 md:h-48 object-cover rounded-lg shadow hover:opacity-90 transition-opacity"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://placehold.co/600x400?text=Gambar+Galeri';
                                        }}
                                    />
                                    {photo.title && (
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/75 via-black/40 to-transparent p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-350 pointer-events-none rounded-b-lg">
                                            <p className="text-white text-xs font-bold m-0 truncate">{photo.title}</p>
                                            {photo.category && (
                                                <span className="text-[9px] text-emerald-300 uppercase tracking-widest block font-semibold mt-0.5">{photo.category}</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {filteredGallery.length === 0 && (
                            <div className="text-center py-10 text-slate-500 text-sm">
                                Tidak ada foto di bawah kategori "{selectedCategory}".
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
}
