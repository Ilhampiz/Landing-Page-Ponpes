import { useState } from 'react';
import api from '../../api/axios';
import { CheckCircle2, AlertCircle, Send } from 'lucide-react';

export default function PpdbSection() {
    const [formData, setFormData] = useState({
        nama_calon_santri: '',
        nama_orang_tua: '',
        tempat_lahir: '',
        tanggal_lahir: '',
        alamat: '',
        no_hp: '',
        email: '',
        jenjang: ''
    });

    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [hoveredBtn, setHoveredBtn] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (fieldErrors[name]) {
            setFieldErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccessMsg('');
        setErrorMsg('');
        setFieldErrors({});

        try {
            const response = await api.post('/ppdb', formData);
            if (response.status === 201 || response.status === 200) {
                setSuccessMsg('Pendaftaran berhasil dikirim! Kami akan menghubungi Anda segera.');
                setFormData({
                    nama_calon_santri: '',
                    nama_orang_tua: '',
                    tempat_lahir: '',
                    tanggal_lahir: '',
                    alamat: '',
                    no_hp: '',
                    email: '',
                    jenjang: ''
                });
            }
        } catch (err) {
            console.error('Error submitting PPDB form:', err);
            if (err.response && err.response.data && err.response.data.errors) {
                setFieldErrors(err.response.data.errors);
                setErrorMsg('Gagal mengirim pendaftaran. Silakan periksa kembali isian formulir Anda.');
            } else {
                setErrorMsg(err.response?.data?.message || 'Terjadi kesalahan pada server. Silakan coba beberapa saat lagi.');
            }
        } finally {
            setLoading(false);
        }
    };

    const styles = {
        formCard: {
            backgroundColor: '#f8fafc',
            borderRadius: '24px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.02), 0 4px 6px -2px rgba(0, 0, 0, 0.01)',
        },
        cardHeaderLine: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            backgroundColor: '#059669',
        },
        fieldGroup: {
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            marginBottom: '20px',
        },
        fieldRow: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px',
        },
        label: {
            fontSize: '0.875rem',
            fontWeight: '700',
            color: '#334155',
        },
        input: (hasError) => ({
            padding: '12px 16px',
            borderRadius: '12px',
            border: hasError ? '1.5px solid #ef4444' : '1px solid #cbd5e1',
            fontSize: '0.95rem',
            color: '#1e293b',
            outline: 'none',
            backgroundColor: '#ffffff',
            transition: 'border-color 0.2s ease',
        }),
        textarea: (hasError) => ({
            padding: '12px 16px',
            borderRadius: '12px',
            border: hasError ? '1.5px solid #ef4444' : '1px solid #cbd5e1',
            fontSize: '0.95rem',
            color: '#1e293b',
            outline: 'none',
            backgroundColor: '#ffffff',
            resize: 'none',
            minHeight: '100px',
            transition: 'border-color 0.2s ease',
        }),
        select: (hasError) => ({
            padding: '12px 16px',
            borderRadius: '12px',
            border: hasError ? '1.5px solid #ef4444' : '1px solid #cbd5e1',
            fontSize: '0.95rem',
            color: '#1e293b',
            outline: 'none',
            backgroundColor: '#ffffff',
            cursor: 'pointer',
            transition: 'border-color 0.2s ease',
        }),
        errorText: {
            fontSize: '0.75rem',
            color: '#ef4444',
            fontWeight: '600',
            marginTop: '2px',
        },
        btnSubmit: {
            width: '100%',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            backgroundColor: '#059669',
            color: '#ffffff',
            fontWeight: '700',
            fontSize: '1rem',
            padding: '16px 24px',
            borderRadius: '12px',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 8px 16px rgba(5, 150, 105, 0.2)',
            transition: 'all 0.2s ease',
        },
        successBox: {
            backgroundColor: '#e6f4ea',
            border: '1px solid #a3cfbb',
            borderRadius: '16px',
            padding: '20px',
            color: '#137333',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            marginBottom: '30px',
        },
        errorBox: {
            backgroundColor: '#fce8e6',
            border: '1px solid #f5c2c7',
            borderRadius: '16px',
            padding: '20px',
            color: '#c5221f',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            marginBottom: '30px',
        }
    };

    return (
        <section id="ppdb" className="py-12 sm:py-16 md:py-24 bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-gray-900 mb-6">
                        Formulir Pendaftaran Online (PPDB)
                    </h2>
                </div>
                
                {successMsg && (
                    <div style={styles.successBox}>
                        <CheckCircle2 size={24} style={{ flexShrink: 0, marginTop: '2px' }} />
                        <div>
                            <h4 className="margin-0 mb-1 font-bold">Registrasi Berhasil!</h4>
                            <p className="margin-0 text-sm sm:text-base text-gray-650 leading-relaxed">{successMsg}</p>
                        </div>
                    </div>
                )}

                {errorMsg && (
                    <div style={styles.errorBox}>
                        <AlertCircle size={24} style={{ flexShrink: 0, marginTop: '2px' }} />
                        <div>
                            <h4 className="margin-0 mb-1 font-bold">Registrasi Gagal</h4>
                            <p className="margin-0 text-sm sm:text-base text-gray-650 leading-relaxed">{errorMsg}</p>
                        </div>
                    </div>
                )}

                <div style={styles.formCard} className="p-8 md:p-10 relative overflow-hidden">
                    <div style={styles.cardHeaderLine} />
                    
                    <form onSubmit={handleSubmit}>
                        <div style={styles.fieldRow}>
                            <div style={styles.fieldGroup}>
                                <label htmlFor="nama_calon_santri" style={styles.label}>Nama Lengkap Calon Santri <span className="text-rose-500">*</span></label>
                                <input
                                    type="text"
                                    id="nama_calon_santri"
                                    name="nama_calon_santri"
                                    required
                                    value={formData.nama_calon_santri}
                                    onChange={handleInputChange}
                                    style={styles.input(!!fieldErrors.nama_calon_santri)}
                                    placeholder="Contoh: Muhammad Ali"
                                />
                                {fieldErrors.nama_calon_santri && (
                                    <span style={styles.errorText}>{fieldErrors.nama_calon_santri[0]}</span>
                                )}
                            </div>

                            <div style={styles.fieldGroup}>
                                <label htmlFor="nama_orang_tua" style={styles.label}>Nama Orang Tua / Wali <span className="text-rose-500">*</span></label>
                                <input
                                    type="text"
                                    id="nama_orang_tua"
                                    name="nama_orang_tua"
                                    required
                                    value={formData.nama_orang_tua}
                                    onChange={handleInputChange}
                                    style={styles.input(!!fieldErrors.nama_orang_tua)}
                                    placeholder="Contoh: Ahmad Dahlan"
                                />
                                {fieldErrors.nama_orang_tua && (
                                    <span style={styles.errorText}>{fieldErrors.nama_orang_tua[0]}</span>
                                )}
                            </div>
                        </div>

                        <div style={styles.fieldRow}>
                            <div style={styles.fieldGroup}>
                                <label htmlFor="tempat_lahir" style={styles.label}>Tempat Lahir <span className="text-rose-500">*</span></label>
                                <input
                                    type="text"
                                    id="tempat_lahir"
                                    name="tempat_lahir"
                                    required
                                    value={formData.tempat_lahir}
                                    onChange={handleInputChange}
                                    style={styles.input(!!fieldErrors.tempat_lahir)}
                                    placeholder="Kota / Kabupaten"
                                />
                                {fieldErrors.tempat_lahir && (
                                    <span style={styles.errorText}>{fieldErrors.tempat_lahir[0]}</span>
                                )}
                            </div>

                            <div style={styles.fieldGroup}>
                                <label htmlFor="tanggal_lahir" style={styles.label}>Tanggal Lahir <span className="text-rose-500">*</span></label>
                                <input
                                    type="date"
                                    id="tanggal_lahir"
                                    name="tanggal_lahir"
                                    required
                                    value={formData.tanggal_lahir}
                                    onChange={handleInputChange}
                                    style={styles.input(!!fieldErrors.tanggal_lahir)}
                                />
                                {fieldErrors.tanggal_lahir && (
                                    <span style={styles.errorText}>{fieldErrors.tanggal_lahir[0]}</span>
                                )}
                            </div>
                        </div>

                        <div style={styles.fieldRow}>
                            <div style={styles.fieldGroup}>
                                <label htmlFor="no_hp" style={styles.label}>Nomor WhatsApp / HP Aktif <span className="text-rose-500">*</span></label>
                                <input
                                    type="tel"
                                    id="no_hp"
                                    name="no_hp"
                                    required
                                    value={formData.no_hp}
                                    onChange={handleInputChange}
                                    style={styles.input(!!fieldErrors.no_hp)}
                                    placeholder="Contoh: 08123456789"
                                />
                                {fieldErrors.no_hp && (
                                    <span style={styles.errorText}>{fieldErrors.no_hp[0]}</span>
                                )}
                            </div>

                            <div style={styles.fieldGroup}>
                                <label htmlFor="email" style={styles.label}>Alamat Email <span className="text-slate-400 font-normal">(Opsional)</span></label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    style={styles.input(!!fieldErrors.email)}
                                    placeholder="email@example.com"
                                />
                                {fieldErrors.email && (
                                    <span style={styles.errorText}>{fieldErrors.email[0]}</span>
                                )}
                            </div>
                        </div>

                        <div style={styles.fieldGroup}>
                            <label htmlFor="jenjang" style={styles.label}>Jenjang Pendidikan Terpilih <span className="text-rose-500">*</span></label>
                            <select
                                id="jenjang"
                                name="jenjang"
                                required
                                value={formData.jenjang}
                                onChange={handleInputChange}
                                style={styles.select(!!fieldErrors.jenjang)}
                            >
                                <option value="" disabled>-- Pilih Jenjang Pendidikan --</option>
                                <option value="MI/SD">MI / SD (Madrasah Ibtidaiyah)</option>
                                <option value="MTs/SMP">MTs / SMP (Madrasah Tsanawiyah)</option>
                                <option value="MA/SMA">MA / SMA (Madrasah Aliyah)</option>
                            </select>
                            {fieldErrors.jenjang && (
                                <span style={styles.errorText}>{fieldErrors.jenjang[0]}</span>
                            )}
                        </div>

                        <div style={styles.fieldGroup}>
                            <label htmlFor="alamat" style={styles.label}>Alamat Rumah Lengkap <span className="text-rose-500">*</span></label>
                            <textarea
                                id="alamat"
                                name="alamat"
                                required
                                value={formData.alamat}
                                onChange={handleInputChange}
                                style={styles.textarea(!!fieldErrors.alamat)}
                                placeholder="Tuliskan nama jalan, RT/RW, kelurahan/desa, kecamatan, kota/kabupaten, dan provinsi..."
                            />
                            {fieldErrors.alamat && (
                                <span style={styles.errorText}>{fieldErrors.alamat[0]}</span>
                            )}
                        </div>

                        <div className="mt-8">
                            <button
                                type="submit"
                                disabled={loading}
                                onMouseEnter={() => setHoveredBtn(true)}
                                onMouseLeave={() => setHoveredBtn(false)}
                                style={{
                                    ...styles.btnSubmit,
                                    transform: hoveredBtn && !loading ? 'translateY(-2px)' : 'none',
                                    backgroundColor: loading ? '#047857' : (hoveredBtn ? '#047857' : '#059669'),
                                    boxShadow: hoveredBtn && !loading ? '0 8px 16px rgba(5, 150, 105, 0.2)' : styles.btnSubmit.boxShadow,
                                    opacity: loading ? 0.8 : 1,
                                    cursor: loading ? 'not-allowed' : 'pointer'
                                }}
                            >
                                <Send size={18} />
                                <span>{loading ? 'Sedang Mengirim...' : 'Kirim Pendaftaran PPDB'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}
