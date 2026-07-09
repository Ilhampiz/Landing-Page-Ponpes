import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Camera, AlertCircle, Image as ImageIcon } from 'lucide-react';

export default function Galeri() {
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

    const getImageUrl = (path) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        return `http://pesantren-api.test${path}`;
    };

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
            {/* Header Section */}
            <div className="text-center mb-12">
                <span className="text-brand-green-main font-sans font-bold uppercase tracking-widest text-xs block mb-2">Dokumentasi</span>
                <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-text-title">
                    Galeri Kegiatan & Fasilitas
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
                    <p className="mt-4 text-text-body text-sm font-medium">Memuat galeri foto...</p>
                </div>
            ) : gallery.length === 0 ? (
                <div className="p-16 max-w-xl mx-auto text-center bg-slate-50 rounded-3xl border border-slate-100">
                    <Camera size={44} className="text-slate-400 mb-4 inline-block" />
                    <div className="text-lg font-bold text-text-title mb-2">Galeri Kosong</div>
                    <div className="text-sm text-text-body">Saat ini dokumentasi foto belum tersedia atau sedang diperbarui.</div>
                </div>
            ) : (
                <>
                    {/* Categories Filter Tabs */}
                    {categories.length > 1 && (
                        <div className="flex justify-center items-center flex-wrap gap-2.5 mb-12">
                            {categories.map((cat) => {
                                const isActive = selectedCategory === cat;
                                return (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`px-5 py-2.5 rounded-xl text-xs font-bold font-sans transition-all border border-solid cursor-pointer ${
                                            isActive 
                                                ? 'bg-brand-green-main border-brand-green-dark text-white shadow-premium' 
                                                : 'bg-slate-50 border-slate-100 text-text-body hover:bg-slate-100 hover:text-text-title'
                                        }`}
                                    >
                                        {cat === 'All' ? 'Semua Kategori' : cat}
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* Gallery Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredGallery.map((photo, idx) => (
                            <div 
                                key={photo.id || idx} 
                                className="group relative overflow-hidden rounded-2xl border border-slate-100/50 shadow-sm transition-all duration-350 hover:shadow-premium hover:-translate-y-1 bg-white p-2.5"
                            >
                                <div className="overflow-hidden rounded-xl h-48 w-full bg-slate-50">
                                    <img 
                                        src={getImageUrl(photo.image_path)} 
                                        alt={photo.title || 'Gambar Galeri'} 
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://placehold.co/600x450/065f46/ffffff?text=Galeri+Foto';
                                        }}
                                    />
                                </div>
                                
                                {photo.title && (
                                    <div className="absolute inset-2.5 bg-gradient-to-t from-brand-green-dark/95 via-brand-green-dark/70 to-transparent p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl flex flex-col justify-end">
                                        <div className="p-1 bg-brand-gold-main/20 text-brand-gold-main rounded-lg w-fit mb-2">
                                            <ImageIcon size={14} />
                                        </div>
                                        <p className="text-white text-sm font-serif font-bold truncate m-0">
                                            {photo.title}
                                        </p>
                                        {photo.category && (
                                            <span className="text-[10px] text-brand-gold-main uppercase tracking-widest font-sans font-bold block mt-1">
                                                {photo.category}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {filteredGallery.length === 0 && (
                        <div className="text-center py-16 text-text-body text-sm font-medium">
                            Tidak ada dokumentasi foto di bawah kategori "{selectedCategory}".
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
