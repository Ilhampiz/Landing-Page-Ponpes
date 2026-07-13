import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { CheckCircle2, AlertCircle, Send, Sparkles, ArrowRight, ArrowLeft, User, Phone, GraduationCap } from 'lucide-react';

export default function FormulirPendaftaran() {
    const [step, setStep] = useState(1);
    const [programs, setPrograms] = useState([]);
    const [formData, setFormData] = useState({
        nama_calon_santri: '',
        nama_orang_tua: '',
        tempat_lahir: '',
        tanggal_lahir: '',
        alamat: '',
        no_hp: '',
        email: '',
        jenjang: '',
        program_pilihan: ''
    });

    useEffect(() => {
        api.get('/programs')
            .then(res => {
                setPrograms(Array.isArray(res.data) ? res.data : (res.data?.data || []));
            })
            .catch(err => console.error('Gagal memuat program:', err));
    }, []);

    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});

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

    // Validasi input per step sebelum lanjut
    const validateStep = (currentStep) => {
        const errors = {};
        if (currentStep === 1) {
            if (!formData.nama_calon_santri.trim()) errors.nama_calon_santri = ['Nama calon santri harus diisi'];
            if (!formData.tempat_lahir.trim()) errors.tempat_lahir = ['Tempat lahir harus diisi'];
            if (!formData.tanggal_lahir) errors.tanggal_lahir = ['Tanggal lahir harus diisi'];
        } else if (currentStep === 2) {
            if (!formData.nama_orang_tua.trim()) errors.nama_orang_tua = ['Nama orang tua/wali harus diisi'];
            if (!formData.no_hp.trim()) errors.no_hp = ['Nomor HP harus diisi'];
            if (!formData.email.trim()) {
                errors.email = ['Alamat email harus diisi'];
            } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
                errors.email = ['Format email tidak valid'];
            }
        } else if (currentStep === 3) {
            if (!formData.program_pilihan) errors.program_pilihan = ['Pilih program pendidikan yang diinginkan'];
            if (!formData.jenjang) errors.jenjang = ['Pilih jenjang pendidikan terpilih'];
            if (!formData.alamat.trim()) errors.alamat = ['Alamat rumah lengkap harus diisi'];
        }

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return false;
        }
        setFieldErrors({});
        return true;
    };

    const nextStep = () => {
        if (validateStep(step)) {
            setStep(prev => prev + 1);
        }
    };

    const prevStep = () => {
        setStep(prev => prev - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateStep(3)) return;

        setLoading(true);
        setSuccessMsg('');
        setErrorMsg('');
        setFieldErrors({});

        try {
            const response = await api.post('/ppdb', formData);
            if (response.status === 201 || response.status === 200) {
                setSuccessMsg('Pendaftaran berhasil dikirim! Panitia pendaftaran akan segera menghubungi Anda melalui nomor WhatsApp.');
                setFormData({
                    nama_calon_santri: '',
                    nama_orang_tua: '',
                    tempat_lahir: '',
                    tanggal_lahir: '',
                    alamat: '',
                    no_hp: '',
                    email: '',
                    jenjang: '',
                    program_pilihan: ''
                });
                setStep(1);
            }
        } catch (err) {
            console.error('Error submitting registration form:', err);
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

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
            {/* Header Section */}
            <div className="text-center mb-12">
                <span className="text-brand-green-main font-sans font-bold uppercase tracking-widest text-xs block mb-2">Penerimaan Baru</span>
                <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-text-title">
                    Formulir Pendaftaran Santri Baru
                </h2>
                <div className="w-12 h-[3px] bg-brand-gold-main mx-auto mt-4 rounded-full" />
            </div>

            {/* Success Alert */}
            {successMsg && (
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 text-emerald-800 flex items-start gap-4 mb-8 shadow-sm max-w-3xl mx-auto">
                    <CheckCircle2 size={24} className="shrink-0 mt-0.5 text-brand-green-main" />
                    <div>
                        <h4 className="m-0 font-serif font-bold text-base text-brand-green-dark mb-1">Registrasi Berhasil!</h4>
                        <p className="m-0 text-sm font-sans text-emerald-700/90 leading-relaxed">{successMsg}</p>
                    </div>
                </div>
            )}

            {/* Error Alert */}
            {errorMsg && (
                <div className="bg-rose-50 border border-rose-100 rounded-2xl p-5 text-rose-800 flex items-start gap-4 mb-8 shadow-sm max-w-3xl mx-auto">
                    <AlertCircle size={24} className="shrink-0 mt-0.5 text-rose-600" />
                    <div>
                        <h4 className="m-0 font-serif font-bold text-base text-rose-900 mb-1">Registrasi Gagal</h4>
                        <p className="m-0 text-sm font-sans text-rose-700/90 leading-relaxed">{errorMsg}</p>
                    </div>
                </div>
            )}

            {/* Form Card */}
            <div className="bg-white rounded-3xl border border-slate-100 p-4 sm:p-8 md:p-12 shadow-premium relative overflow-hidden max-w-3xl mx-auto">
                <div className="absolute top-0 left-0 right-0 h-[6px] bg-brand-green-main" />
                
                {/* Visual badge highlight */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 border-b border-slate-100 pb-6">
                    <div className="flex items-center gap-2 bg-brand-gold-light border border-brand-gold-main/10 px-4 py-2 rounded-xl text-brand-gold-main w-fit">
                        <Sparkles size={16} className="animate-pulse" />
                        <span className="font-sans text-xs font-bold uppercase tracking-wider">Tahun Pelajaran 2026/2027</span>
                    </div>

                    {/* Progress Step Bar */}
                    <div className="flex items-center gap-2 md:gap-3">
                        <div className="flex items-center gap-1.5">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                step >= 1 ? 'bg-brand-green-main text-white' : 'bg-slate-100 text-slate-400'
                            }`}>1</span>
                            <span className={`text-xs font-bold font-sans ${step === 1 ? 'text-brand-green-main' : 'text-slate-400'}`}>Data Santri</span>
                        </div>
                        <span className="h-px w-4 bg-slate-200" />
                        <div className="flex items-center gap-1.5">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                step >= 2 ? 'bg-brand-green-main text-white' : 'bg-slate-100 text-slate-400'
                            }`}>2</span>
                            <span className={`text-xs font-bold font-sans ${step === 2 ? 'text-brand-green-main' : 'text-slate-400'}`}>Kontak Wali</span>
                        </div>
                        <span className="h-px w-4 bg-slate-200" />
                        <div className="flex items-center gap-1.5">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                step >= 3 ? 'bg-brand-green-main text-white' : 'bg-slate-100 text-slate-400'
                            }`}>3</span>
                            <span className={`text-xs font-bold font-sans ${step === 3 ? 'text-brand-green-main' : 'text-slate-400'}`}>Pilihan</span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* STEP 1: Identitas Santri */}
                    {step === 1 && (
                        <div className="space-y-5 animate-fadeIn">
                            <div className="flex items-center gap-2 mb-2 text-brand-green-main">
                                <User size={18} />
                                <h3 className="font-serif text-lg font-bold text-text-title">Identitas Calon Santri</h3>
                            </div>
                            
                            <div className="flex flex-col gap-2">
                                <label htmlFor="nama_calon_santri" className="font-sans text-xs font-bold uppercase tracking-wider text-text-title">
                                    Nama Lengkap Calon Santri <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="nama_calon_santri"
                                    name="nama_calon_santri"
                                    required
                                    value={formData.nama_calon_santri}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 rounded-xl border outline-none text-sm text-text-title font-sans bg-white shadow-sm transition-all duration-200 ${
                                        fieldErrors.nama_calon_santri 
                                            ? 'border-rose-300 focus:border-rose-500 focus:ring-1 focus:ring-rose-500' 
                                            : 'border-slate-200 focus:border-brand-green-main focus:ring-1 focus:ring-brand-green-main'
                                    }`}
                                    placeholder="Contoh: Muhammad Ali"
                                />
                                {fieldErrors.nama_calon_santri && (
                                    <span className="text-xs font-bold text-rose-500 mt-1">{fieldErrors.nama_calon_santri[0]}</span>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="tempat_lahir" className="font-sans text-xs font-bold uppercase tracking-wider text-text-title">
                                        Tempat Lahir <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="tempat_lahir"
                                        name="tempat_lahir"
                                        required
                                        value={formData.tempat_lahir}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 rounded-xl border outline-none text-sm text-text-title font-sans bg-white shadow-sm transition-all duration-200 ${
                                            fieldErrors.tempat_lahir 
                                                ? 'border-rose-300 focus:border-rose-500 focus:ring-1 focus:ring-rose-500' 
                                                : 'border-slate-200 focus:border-brand-green-main focus:ring-1 focus:ring-brand-green-main'
                                        }`}
                                        placeholder="Kota / Kabupaten"
                                    />
                                    {fieldErrors.tempat_lahir && (
                                        <span className="text-xs font-bold text-rose-500 mt-1">{fieldErrors.tempat_lahir[0]}</span>
                                    )}
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label htmlFor="tanggal_lahir" className="font-sans text-xs font-bold uppercase tracking-wider text-text-title">
                                        Tanggal Lahir <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        id="tanggal_lahir"
                                        name="tanggal_lahir"
                                        required
                                        value={formData.tanggal_lahir}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 rounded-xl border outline-none text-sm text-text-title font-sans bg-white shadow-sm transition-all duration-200 ${
                                            fieldErrors.tanggal_lahir 
                                                ? 'border-rose-300 focus:border-rose-500 focus:ring-1 focus:ring-rose-500' 
                                                : 'border-slate-200 focus:border-brand-green-main focus:ring-1 focus:ring-brand-green-main'
                                        }`}
                                    />
                                    {fieldErrors.tanggal_lahir && (
                                        <span className="text-xs font-bold text-rose-500 mt-1">{fieldErrors.tanggal_lahir[0]}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: Kontak & Wali */}
                    {step === 2 && (
                        <div className="space-y-5 animate-fadeIn">
                            <div className="flex items-center gap-2 mb-2 text-brand-green-main">
                                <Phone size={18} />
                                <h3 className="font-serif text-lg font-bold text-text-title">Informasi Orang Tua & Kontak</h3>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label htmlFor="nama_orang_tua" className="font-sans text-xs font-bold uppercase tracking-wider text-text-title">
                                    Nama Orang Tua / Wali <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="nama_orang_tua"
                                    name="nama_orang_tua"
                                    required
                                    value={formData.nama_orang_tua}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 rounded-xl border outline-none text-sm text-text-title font-sans bg-white shadow-sm transition-all duration-200 ${
                                        fieldErrors.nama_orang_tua 
                                            ? 'border-rose-300 focus:border-rose-500 focus:ring-1 focus:ring-rose-500' 
                                            : 'border-slate-200 focus:border-brand-green-main focus:ring-1 focus:ring-brand-green-main'
                                    }`}
                                    placeholder="Contoh: Ahmad Dahlan"
                                />
                                {fieldErrors.nama_orang_tua && (
                                    <span className="text-xs font-bold text-rose-500 mt-1">{fieldErrors.nama_orang_tua[0]}</span>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="no_hp" className="font-sans text-xs font-bold uppercase tracking-wider text-text-title">
                                        Nomor WhatsApp Aktif <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        id="no_hp"
                                        name="no_hp"
                                        required
                                        value={formData.no_hp}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 rounded-xl border outline-none text-sm text-text-title font-sans bg-white shadow-sm transition-all duration-200 ${
                                            fieldErrors.no_hp 
                                                ? 'border-rose-300 focus:border-rose-500 focus:ring-1 focus:ring-rose-500' 
                                                : 'border-slate-200 focus:border-brand-green-main focus:ring-1 focus:ring-brand-green-main'
                                        }`}
                                        placeholder="Contoh: 08123456789"
                                    />
                                    {fieldErrors.no_hp && (
                                        <span className="text-xs font-bold text-rose-500 mt-1">{fieldErrors.no_hp[0]}</span>
                                    )}
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label htmlFor="email" className="font-sans text-xs font-bold uppercase tracking-wider text-text-title">
                                        Alamat Email <span className="text-rose-500 font-bold">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 rounded-xl border outline-none text-sm text-text-title font-sans bg-white shadow-sm transition-all duration-200 ${
                                            fieldErrors.email 
                                                ? 'border-rose-300 focus:border-rose-500 focus:ring-1 focus:ring-rose-500' 
                                                : 'border-slate-200 focus:border-brand-green-main focus:ring-1 focus:ring-brand-green-main'
                                        }`}
                                        placeholder="email@example.com"
                                    />
                                    {fieldErrors.email && (
                                        <span className="text-xs font-bold text-rose-500 mt-1">{fieldErrors.email[0]}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: Pilihan Studi & Alamat */}
                    {step === 3 && (
                        <div className="space-y-5 animate-fadeIn">
                            <div className="flex items-center gap-2 mb-2 text-brand-green-main">
                                <GraduationCap size={18} />
                                <h3 className="font-serif text-lg font-bold text-text-title">Program, Jenjang & Domisili</h3>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label htmlFor="program_pilihan" className="font-sans text-xs font-bold uppercase tracking-wider text-text-title">
                                    Program Pendidikan Unggulan <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    id="program_pilihan"
                                    name="program_pilihan"
                                    required
                                    value={formData.program_pilihan}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3.5 rounded-xl border outline-none text-sm text-text-title font-sans bg-white shadow-sm cursor-pointer transition-all duration-200 ${
                                        fieldErrors.program_pilihan 
                                            ? 'border-rose-300 focus:border-rose-500 focus:ring-1 focus:ring-rose-500' 
                                            : 'border-slate-200 focus:border-brand-green-main focus:ring-1 focus:ring-brand-green-main'
                                    }`}
                                >
                                    <option value="" disabled>-- Pilih Program Pendidikan --</option>
                                    {programs.map((prog) => (
                                        <option key={prog.id} value={prog.title}>
                                            {prog.title}
                                        </option>
                                    ))}
                                </select>
                                {fieldErrors.program_pilihan && (
                                    <span className="text-xs font-bold text-rose-500 mt-1">{fieldErrors.program_pilihan[0]}</span>
                                )}
                            </div>

                            <div className="flex flex-col gap-2">
                                <label htmlFor="jenjang" className="font-sans text-xs font-bold uppercase tracking-wider text-text-title">
                                    Jenjang Pendidikan Terpilih <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    id="jenjang"
                                    name="jenjang"
                                    required
                                    value={formData.jenjang}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3.5 rounded-xl border outline-none text-sm text-text-title font-sans bg-white shadow-sm cursor-pointer transition-all duration-200 ${
                                        fieldErrors.jenjang 
                                            ? 'border-rose-300 focus:border-rose-500 focus:ring-1 focus:ring-rose-500' 
                                            : 'border-slate-200 focus:border-brand-green-main focus:ring-1 focus:ring-brand-green-main'
                                    }`}
                                >
                                    <option value="" disabled>-- Pilih Jenjang Pendidikan --</option>
                                    <option value="MI/SD">MI / SD (Madrasah Ibtidaiyah)</option>
                                    <option value="MTs/SMP">MTs / SMP (Madrasah Tsanawiyah)</option>
                                    <option value="MA/SMA">MA / SMA (Madrasah Aliyah)</option>
                                </select>
                                {fieldErrors.jenjang && (
                                    <span className="text-xs font-bold text-rose-500 mt-1">{fieldErrors.jenjang[0]}</span>
                                )}
                            </div>

                            <div className="flex flex-col gap-2">
                                <label htmlFor="alamat" className="font-sans text-xs font-bold uppercase tracking-wider text-text-title">
                                    Alamat Rumah Lengkap <span className="text-rose-500">*</span>
                                </label>
                                <textarea
                                    id="alamat"
                                    name="alamat"
                                    required
                                    value={formData.alamat}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 rounded-xl border outline-none text-sm text-text-title font-sans bg-white shadow-sm resize-none min-h-[120px] transition-all duration-200 ${
                                        fieldErrors.alamat 
                                            ? 'border-rose-300 focus:border-rose-500 focus:ring-1 focus:ring-rose-500' 
                                            : 'border-slate-200 focus:border-brand-green-main focus:ring-1 focus:ring-brand-green-main'
                                    }`}
                                    placeholder="Tuliskan nama jalan, RT/RW, kelurahan/desa, kecamatan, kota/kabupaten, dan provinsi..."
                                />
                                {fieldErrors.alamat && (
                                    <span className="text-xs font-bold text-rose-500 mt-1">{fieldErrors.alamat[0]}</span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Step Navigation Actions */}
                    <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-8">
                        {step > 1 ? (
                            <button
                                type="button"
                                onClick={prevStep}
                                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-200 text-text-title hover:bg-slate-50 transition-all font-sans font-bold text-xs cursor-pointer select-none bg-white"
                            >
                                <ArrowLeft size={16} />
                                <span>Kembali</span>
                            </button>
                        ) : (
                            <div />
                        )}

                        {step < 3 ? (
                            <button
                                type="button"
                                onClick={nextStep}
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-green-main hover:bg-brand-green-dark text-white font-sans font-bold text-xs cursor-pointer select-none border-none transition-all shadow-sm hover:shadow-premium"
                            >
                                <span>Lanjutkan</span>
                                <ArrowRight size={16} />
                            </button>
                        ) : (
                            <button
                                type="submit"
                                disabled={loading}
                                className={`inline-flex items-center gap-2 bg-brand-green-main hover:bg-brand-green-dark text-white font-sans font-bold text-xs py-3 px-6 rounded-xl transition-all duration-300 shadow-premium hover:shadow-premium hover:-translate-y-0.5 active:translate-y-0 ${
                                    loading ? 'opacity-85 cursor-not-allowed' : 'cursor-pointer'
                                }`}
                            >
                                <Send size={14} />
                                <span>{loading ? 'Sedang Mengirim...' : 'Kirim Pendaftaran'}</span>
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
