import { useState, useEffect } from 'react';
import { Compass, BookOpen, CheckCircle2, Award, Users, Shield } from 'lucide-react';
import ScrollReveal from "../../components/ScrollReveal";
import api from '../../api/axios';

export default function Profil() {
    const [activeEra, setActiveEra] = useState(null);
    const [settings, setSettings] = useState({
        sejarah_singkat: '',
        visi: '',
        misi: '',
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await api.get('/settings');
                if (res.data) {
                    setSettings({
                        sejarah_singkat: res.data.sejarah_singkat || '',
                        visi: res.data.visi || '',
                        misi: res.data.misi || '',
                    });
                }
            } catch (err) {
                console.error('Error loading settings on profile:', err);
            }
        };
        fetchSettings();
    }, []);

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
            {/* Sejarah Section */}
            <div className="text-center mb-16">
                <span className="text-brand-green-main font-sans font-bold uppercase tracking-widest text-xs block mb-2">Sejarah</span>
                <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-text-title">
                    Profil & Sejarah Singkat
                </h2>
                <div className="w-12 h-[3px] bg-brand-gold-main mx-auto mt-4 rounded-full" />
            </div>

            {settings.sejarah_singkat && (
                <div className="max-w-4xl mx-auto mb-16 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm leading-relaxed text-sm sm:text-base text-text-body font-sans whitespace-pre-line">
                    {settings.sejarah_singkat}
                </div>
            )}

            {/* Timeline Accordion */}
            <div className="mb-20 max-w-4xl mx-auto">
                <div className="relative border-l border-brand-green-main/30 ml-4 md:ml-8 space-y-12 py-4">
                    {/* Node 1 */}
                    <div className="relative pl-8 md:pl-12 group">
                        <ScrollReveal>
                            {/* Timeline Bullet */}
                            <div className="absolute top-1.5 left-[-9px] w-[18px] h-[18px] rounded-full bg-white border-4 border-brand-green-main transition-all duration-300 group-hover:bg-brand-gold-main group-hover:scale-110 shadow-sm" />
                            <div className="flex flex-col items-start bg-white p-6 rounded-2xl border border-slate-100/50 shadow-sm hover:shadow-premium transition-shadow duration-300 w-full">
                                <span className="font-sans text-[10px] md:text-xs font-bold uppercase tracking-wider text-brand-gold-main bg-brand-gold-light px-3.5 py-1 rounded-full shadow-sm w-fit">
                                    Tahun 2012
                                </span>
                                <h3 className="font-serif text-lg md:text-xl font-bold text-text-title mt-4 mb-2">
                                    Awal Mula Perjalanan
                                </h3>
                                <p className="font-sans text-sm md:text-base text-text-body leading-relaxed mb-3">
                                    Didirikan oleh K.H. Ahmad Dahlan, Pondok Pesantren Al-Qur'anul Karim bermula dari sebuah mushola kecil dengan beberapa santri yang memiliki tekad kuat mendalami Al-Qur'an secara intensif.
                                </p>
                                
                                {/* Timeline Accordion Toggle */}
                                <button 
                                    onClick={() => setActiveEra(activeEra === 0 ? null : 0)}
                                    className="font-sans text-xs font-bold text-brand-green-main hover:text-brand-green-dark hover:underline flex items-center gap-1 focus:outline-none cursor-pointer bg-transparent border-none p-0 mt-1"
                                >
                                    <span>{activeEra === 0 ? 'Tutup Detail' : 'Lihat Detail Sejarah'}</span>
                                    <span className="text-[10px]">{activeEra === 0 ? '▲' : '▼'}</span>
                                </button>
                                
                                {/* Accordion Content */}
                                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                    activeEra === 0 ? 'max-h-48 opacity-100 mt-3' : 'max-h-0 opacity-0 pointer-events-none'
                                }`}>
                                    <ul className="list-none p-0 m-0 space-y-2.5 border-l-2 border-brand-gold-main/40 pl-4 py-1">
                                        <li className="font-sans text-xs md:text-sm text-text-body flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-brand-gold-main shrink-0" />
                                            Dimulai dengan 5 santri mukim di pondokan bambu sederhana.
                                        </li>
                                        <li className="font-sans text-xs md:text-sm text-text-body flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-brand-gold-main shrink-0" />
                                            K.H. Ahmad Dahlan bertindak langsung sebagai pengajar utama tahfidz.
                                        </li>
                                        <li className="font-sans text-xs md:text-sm text-text-body flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-brand-gold-main shrink-0" />
                                            Fokus pembelajaran awal pada pemantapan makhraj dan tajwid hafalan.
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>

                    {/* Node 2 */}
                    <div className="relative pl-8 md:pl-12 group">
                        <ScrollReveal>
                            {/* Timeline Bullet */}
                            <div className="absolute top-1.5 left-[-9px] w-[18px] h-[18px] rounded-full bg-white border-4 border-brand-green-main transition-all duration-300 group-hover:bg-brand-gold-main group-hover:scale-110 shadow-sm" />
                            <div className="flex flex-col items-start bg-white p-6 rounded-2xl border border-slate-100/50 shadow-sm hover:shadow-premium transition-shadow duration-300 w-full">
                                <span className="font-sans text-[10px] md:text-xs font-bold uppercase tracking-wider text-brand-gold-main bg-brand-gold-light px-3.5 py-1 rounded-full shadow-sm w-fit">
                                    Pertumbuhan & Kemitraan
                                </span>
                                <h3 className="font-serif text-lg md:text-xl font-bold text-text-title mt-4 mb-2">
                                    Membangun Kepercayaan & Kredibilitas
                                </h3>
                                <p className="font-sans text-sm md:text-base text-text-body leading-relaxed mb-3">
                                    Dedikasi dalam memberikan pendidikan berkualitas melahirkan reputasi positif di mata wali santri. Melalui kerja sama erat pengurus dan donatur, fasilitas asrama pertama berhasil dibangun demi kenyamanan santri.
                                </p>

                                {/* Timeline Accordion Toggle */}
                                <button 
                                    onClick={() => setActiveEra(activeEra === 1 ? null : 1)}
                                    className="font-sans text-xs font-bold text-brand-green-main hover:text-brand-green-dark hover:underline flex items-center gap-1 focus:outline-none cursor-pointer bg-transparent border-none p-0 mt-1"
                                >
                                    <span>{activeEra === 1 ? 'Tutup Detail' : 'Lihat Detail Sejarah'}</span>
                                    <span className="text-[10px]">{activeEra === 1 ? '▲' : '▼'}</span>
                                </button>
                                
                                {/* Accordion Content */}
                                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                    activeEra === 1 ? 'max-h-48 opacity-100 mt-3' : 'max-h-0 opacity-0 pointer-events-none'
                                }`}>
                                    <ul className="list-none p-0 m-0 space-y-2.5 border-l-2 border-brand-gold-main/40 pl-4 py-1">
                                        <li className="font-sans text-xs md:text-sm text-text-body flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-brand-gold-main shrink-0" />
                                            Mendapatkan izin operasional resmi Madrasah Tsanawiyah (MTs).
                                        </li>
                                        <li className="font-sans text-xs md:text-sm text-text-body flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-brand-gold-main shrink-0" />
                                            Penerimaan wakaf tanah seluas 1 hektar untuk pembangunan asrama terpadu.
                                        </li>
                                        <li className="font-sans text-xs md:text-sm text-text-body flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-brand-gold-main shrink-0" />
                                            Mengembangkan program kemitraan pengajar dengan alumni Universitas Timur Tengah.
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>

                    {/* Node 3 */}
                    <div className="relative pl-8 md:pl-12 group">
                        <ScrollReveal>
                            {/* Timeline Bullet */}
                            <div className="absolute top-1.5 left-[-9px] w-[18px] h-[18px] rounded-full bg-white border-4 border-brand-green-main transition-all duration-300 group-hover:bg-brand-gold-main group-hover:scale-110 shadow-sm" />
                            <div className="flex flex-col items-start bg-white p-6 rounded-2xl border border-slate-100/50 shadow-sm hover:shadow-premium transition-shadow duration-300 w-full">
                                <span className="font-sans text-[10px] md:text-xs font-bold uppercase tracking-wider text-brand-gold-main bg-brand-gold-light px-3.5 py-1 rounded-full shadow-sm w-fit">
                                    Kondisi Saat Ini
                                </span>
                                <h3 className="font-serif text-lg md:text-xl font-bold text-text-title mt-4 mb-2">
                                    Lembaga Pendidikan Formal & Pesantren Terpadu
                                </h3>
                                <p className="font-sans text-sm md:text-base text-text-body leading-relaxed mb-3">
                                    Kini menaungi jenjang Madrasah Ibtidaiyah (MI), Madrasah Tsanawiyah (MTs), dan Madrasah Aliyah (MA) terakreditasi unggul. Dilengkapi kompleks asrama representatif serta laboratorium terintegrasi guna mendukung program Tahfidz dan Sains.
                                </p>

                                {/* Timeline Accordion Toggle */}
                                <button 
                                    onClick={() => setActiveEra(activeEra === 2 ? null : 2)}
                                    className="font-sans text-xs font-bold text-brand-green-main hover:text-brand-green-dark hover:underline flex items-center gap-1 focus:outline-none cursor-pointer bg-transparent border-none p-0 mt-1"
                                >
                                    <span>{activeEra === 2 ? 'Tutup Detail' : 'Lihat Detail Sejarah'}</span>
                                    <span className="text-[10px]">{activeEra === 2 ? '▲' : '▼'}</span>
                                </button>
                                
                                {/* Accordion Content */}
                                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                    activeEra === 2 ? 'max-h-48 opacity-100 mt-3' : 'max-h-0 opacity-0 pointer-events-none'
                                }`}>
                                    <ul className="list-none p-0 m-0 space-y-2.5 border-l-2 border-brand-gold-main/40 pl-4 py-1">
                                        <li className="font-sans text-xs md:text-sm text-text-body flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-brand-gold-main shrink-0" />
                                            Telah meluluskan lebih dari 250 santri penghafal Al-Qur'an 30 juz mutqin.
                                        </li>
                                        <li className="font-sans text-xs md:text-sm text-text-body flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-brand-gold-main shrink-0" />
                                            Meraih predikat Akreditasi A (Unggul) secara nasional pada semua jenjang formal.
                                        </li>
                                        <li className="font-sans text-xs md:text-sm text-text-body flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-brand-gold-main shrink-0" />
                                            Menyediakan beasiswa studi lanjut ke universitas terkemuka di Mesir, Madinah, dan PTN.
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20 max-w-5xl mx-auto">
                <ScrollReveal delay={0}>
                    <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl text-center shadow-sm h-full">
                        <span className="font-sans text-3xl md:text-4xl font-bold text-brand-green-main tracking-tight block">10+</span>
                        <span className="font-sans text-xs md:text-sm font-semibold text-text-body mt-2 block">Tahun Mengabdi</span>
                    </div>
                </ScrollReveal>
                <ScrollReveal delay={100}>
                    <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl text-center shadow-sm h-full">
                        <span className="font-sans text-3xl md:text-4xl font-bold text-brand-green-main tracking-tight block">500+</span>
                        <span className="font-sans text-xs md:text-sm font-semibold text-text-body mt-2 block">Santri Aktif</span>
                    </div>
                </ScrollReveal>
                <ScrollReveal delay={200}>
                    <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl text-center shadow-sm h-full">
                        <span className="font-sans text-3xl md:text-4xl font-bold text-brand-green-main tracking-tight block">250+</span>
                        <span className="font-sans text-xs md:text-sm font-semibold text-text-body mt-2 block">Alumni Hafizh</span>
                    </div>
                </ScrollReveal>
                <ScrollReveal delay={300}>
                    <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl text-center shadow-sm h-full">
                        <span className="font-sans text-3xl md:text-4xl font-bold text-brand-green-main tracking-tight block">40+</span>
                        <span className="font-sans text-xs md:text-sm font-semibold text-text-body mt-2 block">Asatidzah</span>
                    </div>
                </ScrollReveal>
            </div>

            {/* Visi & Misi Section */}
            <div className="border-t border-slate-100 bg-slate-50/50 p-6 sm:p-8 md:p-12 rounded-3xl mb-20 shadow-inner max-w-5xl mx-auto">
                <ScrollReveal>
                    <div className="text-center mb-12">
                        <span className="text-brand-green-main font-sans font-bold uppercase tracking-widest text-xs block mb-2">Komitmen</span>
                        <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-text-title">
                            Visi & Misi Lembaga
                        </h2>
                        <div className="w-12 h-[2.5px] bg-brand-gold-main mx-auto mt-3 rounded-full" />
                    </div>
                </ScrollReveal>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Card Visi */}
                    <ScrollReveal>
                        <div className="group relative bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-premium hover:-translate-y-1 transition-all duration-300 overflow-hidden h-full">
                            <div className="absolute top-0 left-0 right-0 h-[3px] bg-brand-gold-main scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                            
                            <div className="flex items-center gap-3.5 mb-6">
                                <div className="p-3 bg-brand-green-light text-brand-green-main rounded-xl shadow-sm">
                                    <Compass size={24} />
                                </div>
                                <h3 className="font-serif text-xl font-bold text-text-title">Visi Pesantren</h3>
                            </div>
                            <div>
                                <p className="font-serif text-base italic text-brand-green-dark border-l-2 border-slate-200 pl-4 py-1 leading-relaxed">
                                    {settings.visi ? `"${settings.visi}"` : '"Terwujudnya lembaga pendidikan Islam unggulan yang mencetak hafizh/hafizhah mutqin, berilmu amaliyah, beramal ilmiah, dan berakhlak mulia."'}
                                </p>
                                <p className="font-sans text-sm text-text-body mt-4 leading-relaxed">
                                    Visi ini menjadi komitmen utama kami dalam mendidik generasi muda Islam agar tidak hanya unggul secara akademis, namun juga memiliki kedekatan spiritual yang kuat dengan Al-Qur'an.
                                </p>
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* Card Misi */}
                    <ScrollReveal delay={150}>
                        <div className="group relative bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-premium hover:-translate-y-1 transition-all duration-300 overflow-hidden h-full">
                            <div className="absolute top-0 left-0 right-0 h-[3px] bg-brand-gold-main scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                            
                            <div className="flex items-center gap-3.5 mb-6">
                                <div className="p-3 bg-brand-green-light text-brand-green-main rounded-xl shadow-sm">
                                    <BookOpen size={24} />
                                </div>
                                <h3 className="font-serif text-xl font-bold text-text-title">Misi Pesantren</h3>
                            </div>
                            {settings.misi ? (
                                <ul className="list-none p-0 m-0 space-y-4">
                                    {settings.misi.split('\n').filter(Boolean).map((line, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-sm text-text-body leading-relaxed">
                                            <CheckCircle2 size={16} className="text-brand-green-main shrink-0 mt-0.5" />
                                            <span>{line}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <ul className="list-none p-0 m-0 space-y-4">
                                    <li className="flex items-start gap-3 text-sm text-text-body leading-relaxed">
                                        <CheckCircle2 size={16} className="text-brand-green-main shrink-0 mt-0.5" />
                                        <span>Menyelenggarakan program Tahfidzul Qur'an yang terstruktur, mutqin, dan berkualitas dengan bimbingan ustadz pemegang sanad.</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-sm text-text-body leading-relaxed">
                                        <CheckCircle2 size={16} className="text-brand-green-main shrink-0 mt-0.5" />
                                        <span>Membekali santri dengan pemahaman kitab kuning klasik yang mendalam serta program pendidikan formal terakreditasi unggul.</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-sm text-text-body leading-relaxed">
                                        <CheckCircle2 size={16} className="text-brand-green-main shrink-0 mt-0.5" />
                                        <span>Menanamkan nilai-nilai akhlakul karimah, keteladanan sosial, kedisiplinan, dan kemandirian dalam ekosistem asrama pesantren.</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-sm text-text-body leading-relaxed">
                                        <CheckCircle2 size={16} className="text-brand-green-main shrink-0 mt-0.5" />
                                        <span>Mengintegrasikan ilmu agama dengan perkembangan sains, teknologi, dan bahasa asing (Arab & Inggris).</span>
                                    </li>
                                </ul>
                            )}
                        </div>
                    </ScrollReveal>
                </div>
            </div>

            {/* Nilai-Nilai Pesantren */}
            <div className="max-w-5xl mx-auto">
                <ScrollReveal>
                    <div className="text-center mb-12">
                        <span className="text-brand-green-main font-sans font-bold uppercase tracking-widest text-xs block mb-2">Nilai Utama</span>
                        <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-text-title">
                            Nilai-Nilai Karakter Mulia
                        </h2>
                        <div className="w-12 h-[2.5px] bg-brand-gold-main mx-auto mt-3 rounded-full" />
                    </div>
                </ScrollReveal>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <ScrollReveal delay={0}>
                        <div className="bg-white border border-slate-100 p-8 rounded-3xl text-center shadow-sm hover:shadow-premium hover:-translate-y-0.5 transition-all duration-300 h-full">
                            <div className="p-3 bg-brand-green-light text-brand-green-main rounded-2xl w-fit mx-auto mb-5 shadow-sm">
                                <Award size={28} />
                            </div>
                            <h4 className="font-serif text-lg font-bold text-text-title mb-2.5">Integritas (Amanah)</h4>
                            <p className="font-sans text-sm text-text-body leading-relaxed m-0">Menjunjung tinggi kejujuran, keadilan, dan keselarasan ucapan dengan perbuatan dalam setiap aspek kehidupan.</p>
                        </div>
                    </ScrollReveal>
                    
                    <ScrollReveal delay={150}>
                        <div className="bg-white border border-slate-100 p-8 rounded-3xl text-center shadow-sm hover:shadow-premium hover:-translate-y-0.5 transition-all duration-300 h-full">
                            <div className="p-3 bg-brand-green-light text-brand-green-main rounded-2xl w-fit mx-auto mb-5 shadow-sm">
                                <Users size={28} />
                            </div>
                            <h4 className="font-serif text-lg font-bold text-text-title mb-2.5">Ukhuwah (Kebersamaan)</h4>
                            <p className="font-sans text-sm text-text-body leading-relaxed m-0">Membina persaudaraan yang erat di antara santri, asatidzah, orang tua, dan masyarakat luas dalam bingkai toleransi.</p>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal delay={300}>
                        <div className="bg-white border border-slate-100 p-8 rounded-3xl text-center shadow-sm hover:shadow-premium hover:-translate-y-0.5 transition-all duration-300 h-full">
                            <div className="p-3 bg-brand-green-light text-brand-green-main rounded-2xl w-fit mx-auto mb-5 shadow-sm">
                                <Shield size={28} />
                            </div>
                            <h4 className="font-serif text-lg font-bold text-text-title mb-2.5">Disiplin & Mandiri</h4>
                            <p className="font-sans text-sm text-text-body leading-relaxed m-0">Membiasakan hidup teratur, bertanggung jawab atas perbuatan pribadi, dan tangguh mengarungi tantangan harian.</p>
                        </div>
                    </ScrollReveal>
                </div>
            </div>
        </div>
    );
}
