import { useState } from 'react';
import { Compass, BookOpen, CheckCircle2, Award, Users, Shield } from 'lucide-react';

export default function ProfilSection() {
    const [hoveredCard, setHoveredCard] = useState(null);

    const styles = {
        historyBox: {
            backgroundColor: '#f8fafc',
            borderLeft: '5px solid #059669',
            borderRadius: '0 20px 20px 0',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)',
        },
        card: {
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        cardHeader: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
        },
        cardIconContainer: {
            backgroundColor: '#d1fae5',
            color: '#065f46',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        cardTitle: {
            fontSize: '1.35rem',
            fontWeight: '750',
            color: '#0f172a',
            margin: 0,
        },
        visiText: {
            fontSize: '1.1rem',
            color: '#334155',
            lineHeight: '1.7',
            fontStyle: 'italic',
            borderLeft: '3px solid #cbd5e1',
            paddingLeft: '16px',
            margin: '10px 0',
        },
        misiList: {
            listStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
        },
        misiItem: {
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            fontSize: '0.95rem',
            color: '#475569',
            lineHeight: '1.6',
        },
        misiIcon: {
            color: '#059669',
            flexShrink: 0,
            marginTop: '3px',
        },
        statItem: {
            textAlign: 'center',
            padding: '24px',
            backgroundColor: '#f8fafc',
            borderRadius: '16px',
            border: '1px solid #f1f5f9',
        },
        statNumber: {
            fontSize: '2.5rem',
            fontWeight: '800',
            color: '#059669',
            marginBottom: '6px',
            display: 'block',
        },
        statLabel: {
            fontSize: '0.9rem',
            fontWeight: '600',
            color: '#64748b',
        }
    };

    return (
        <section id="profil" className="py-12 sm:py-16 md:py-24 bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Sejarah Section */}
                <div className="text-center mb-16">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-gray-900 mb-6">
                        Profil & Sejarah Singkat
                    </h2>
                </div>

                <div className="space-y-8 sm:space-y-10 mb-16">
                    <div style={styles.historyBox} className="p-8 md:p-10">
                        <h3 className="m-0 mb-4 text-emerald-800 text-xl font-bold">
                            Awal Mula Perjalanan
                        </h3>
                        <p className="m-0 text-slate-700 text-base sm:text-lg font-medium leading-relaxed">
                            "Didirikan pada tahun 2012 oleh K.H. Ahmad Dahlan, Pondok Pesantren Al-Qur'anul Karim bermula dari sebuah mushola kecil dengan beberapa santri yang bertekad kuat mendalami Al-Qur'an."
                        </p>
                    </div>

                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                        Seiring berjalannya waktu, dedikasi dalam memberikan pendidikan Islam yang berkualitas, bersih, dan berintegritas membuahkan kepercayaan besar dari masyarakat. Melalui kerja keras segenap pengurus dan dukungan para donatur, pesantren ini bertransformasi menjadi lembaga pendidikan terpadu yang memadukan pendidikan formal dan non-formal.
                    </p>

                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                        Kini, Pondok Pesantren Al-Qur'anul Karim menaungi jenjang Madrasah Ibtidaiyah (MI), Madrasah Tsanawiyah (MTs), dan Madrasah Aliyah (MA), dengan fasilitas asrama yang representatif untuk mendukung kenyamanan santri dalam menghafal Al-Qur'an serta menuntut ilmu agama dan sains.
                    </p>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div style={styles.statItem}>
                            <span style={styles.statNumber}>10+</span>
                            <span style={styles.statLabel}>Tahun Mengabdi</span>
                        </div>
                        <div style={styles.statItem}>
                            <span style={styles.statNumber}>500+</span>
                            <span style={styles.statLabel}>Santri Aktif</span>
                        </div>
                        <div style={styles.statItem}>
                            <span style={styles.statNumber}>250+</span>
                            <span style={styles.statLabel}>Alumni Penghafal Qur'an</span>
                        </div>
                        <div style={styles.statItem}>
                            <span style={styles.statNumber}>40+</span>
                            <span style={styles.statLabel}>Ustadz & Ustadzah</span>
                        </div>
                    </div>
                </div>

                {/* Visi & Misi Section */}
                <div className="border-t border-slate-100 bg-slate-50 p-8 md:p-12 rounded-3xl mb-16">
                    <div className="text-center mb-10">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-gray-900 mb-6">
                            Visi & Misi
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Card Visi */}
                        <div 
                            style={{
                                ...styles.card,
                                transform: hoveredCard === 'visi' ? 'translateY(-6px)' : 'none',
                                boxShadow: hoveredCard === 'visi' ? '0 12px 20px rgba(0,0,0,0.06)' : 'none',
                                borderColor: hoveredCard === 'visi' ? '#10b981' : '#e2e8f0'
                            }}
                            className="p-8 flex flex-col gap-5 bg-white"
                            onMouseEnter={() => setHoveredCard('visi')}
                            onMouseLeave={() => setHoveredCard(null)}
                        >
                            <div style={styles.cardHeader}>
                                <div style={styles.cardIconContainer}>
                                    <Compass size={24} />
                                </div>
                                <h3 style={styles.cardTitle}>Visi Pesantren</h3>
                            </div>
                            <div>
                                <p style={styles.visiText}>
                                    "Terwujudnya lembaga pendidikan Islam unggulan yang mencetak hafizh/hafizhah mutqin, berilmu amaliyah, beramal ilmiah, dan berakhlak mulia."
                                </p>
                                <p className="text-sm sm:text-base text-gray-600 leading-relaxed mt-4">
                                    Visi ini menjadi komitmen utama kami dalam mendidik generasi muda Islam agar tidak hanya unggul secara akademis, namun juga memiliki kedekatan spiritual yang kuat dengan Al-Qur'an.
                                </p>
                            </div>
                        </div>

                        {/* Card Misi */}
                        <div 
                            style={{
                                ...styles.card,
                                transform: hoveredCard === 'misi' ? 'translateY(-6px)' : 'none',
                                boxShadow: hoveredCard === 'misi' ? '0 12px 20px rgba(0,0,0,0.06)' : 'none',
                                borderColor: hoveredCard === 'misi' ? '#10b981' : '#e2e8f0'
                            }}
                            className="p-8 flex flex-col gap-5 bg-white"
                            onMouseEnter={() => setHoveredCard('misi')}
                            onMouseLeave={() => setHoveredCard(null)}
                        >
                            <div style={styles.cardHeader}>
                                <div style={styles.cardIconContainer}>
                                    <BookOpen size={24} />
                                </div>
                                <h3 style={styles.cardTitle}>Misi Pesantren</h3>
                            </div>
                            <ul style={styles.misiList}>
                                <li style={styles.misiItem}>
                                    <CheckCircle2 size={16} style={styles.misiIcon} />
                                    <span className="text-sm sm:text-base">Menyelenggarakan program Tahfidzul Qur'an yang terstruktur, mutqin, dan berkualitas dengan bimbingan ustadz pemegang sanad.</span>
                                </li>
                                <li style={styles.misiItem}>
                                    <CheckCircle2 size={16} style={styles.misiIcon} />
                                    <span className="text-sm sm:text-base">Membekali santri dengan pemahaman kitab kuning klasik yang mendalam serta program pendidikan formal terakreditasi unggul.</span>
                                </li>
                                <li style={styles.misiItem}>
                                    <CheckCircle2 size={16} style={styles.misiIcon} />
                                    <span className="text-sm sm:text-base">Menanamkan nilai-nilai akhlakul karimah, keteladanan sosial, kedisiplinan, dan kemandirian dalam ekosistem asrama pesantren.</span>
                                </li>
                                <li style={styles.misiItem}>
                                    <CheckCircle2 size={16} style={styles.misiIcon} />
                                    <span className="text-sm sm:text-base">Mengintegrasikan ilmu agama dengan perkembangan sains, teknologi, dan bahasa asing (Arab & Inggris).</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Nilai-Nilai Pesantren */}
                <div>
                    <div className="text-center mb-10">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-gray-900 mb-6">
                            Nilai-Nilai Karakter
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 text-center">
                            <div className="text-emerald-600 mb-4 inline-block">
                                <Award size={36} />
                            </div>
                            <h4 className="text-lg font-bold mb-2 text-slate-800">Integritas (Amanah)</h4>
                            <p className="text-sm sm:text-base text-gray-600 leading-relaxed m-0">Menjunjung tinggi kejujuran, keadilan, dan keselarasan ucapan dengan perbuatan.</p>
                        </div>
                        <div className="p-6 text-center">
                            <div className="text-emerald-600 mb-4 inline-block">
                                <Users size={36} />
                            </div>
                            <h4 className="text-lg font-bold mb-2 text-slate-800">Ukhuwah (Kebersamaan)</h4>
                            <p className="text-sm sm:text-base text-gray-600 leading-relaxed m-0">Membina persaudaraan yang erat di antara santri, asatidzah, dan masyarakat luas.</p>
                        </div>
                        <div className="p-6 text-center">
                            <div className="text-emerald-600 mb-4 inline-block">
                                <Shield size={36} />
                            </div>
                            <h4 className="text-lg font-bold mb-2 text-slate-800">Disiplin & Mandiri</h4>
                            <p className="text-sm sm:text-base text-gray-600 leading-relaxed m-0">Membiasakan hidup teratur, bertanggung jawab, dan mandiri dalam menjalani kegiatan harian.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
