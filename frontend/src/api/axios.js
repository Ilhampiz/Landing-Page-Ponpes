import axios from 'axios';

const api = axios.create({
    baseURL: 'http://pesantren-api.test/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Otomatis sisipkan token di setiap request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Otomatis logout jika token expired atau tidak valid (401)
api.interceptors.response.use(
    (response) => response, // Jika sukses, lanjutkan normal
    (error) => {
        if (error.response && error.response.status === 401) {
            // Cek apakah sedang di halaman admin (bukan halaman login itu sendiri)
            const isAdminPage = window.location.pathname.startsWith('/admin') &&
                                window.location.pathname !== '/admin/login';

            if (isAdminPage) {
                // Hapus semua data sesi dari localStorage
                localStorage.removeItem('admin_token');
                localStorage.removeItem('admin_data');

                // Redirect ke halaman login dengan pesan
                window.location.href = '/admin/login?session=expired';
            }
        }
        return Promise.reject(error);
    }
);

export default api;