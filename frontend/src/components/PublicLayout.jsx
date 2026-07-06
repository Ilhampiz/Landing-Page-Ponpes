import { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import api from '../api/axios';

export default function PublicLayout({ children }) {
    useEffect(() => {
        const loadBranding = async () => {
            try {
                const res = await api.get('/settings');
                const data = res.data || {};

                // Hapus style dinamis lama jika ada (dari versi sebelumnya)
                const oldStyle = document.getElementById('dynamic-branding-styles');
                if (oldStyle) oldStyle.remove();

                // 1. Favicon
                if (data.favicon) {
                    const faviconUrl = data.favicon.startsWith('http') ? data.favicon : `http://localhost:8000${data.favicon}`;
                    let link = document.querySelector("link[rel~='icon']");
                    if (!link) {
                        link = document.createElement('link');
                        link.rel = 'icon';
                        document.head.appendChild(link);
                    }
                    link.href = faviconUrl;
                }

                // 2. Document Title
                if (data.nama_pesantren) {
                    const currentTitle = document.title;
                    if (!currentTitle.includes(data.nama_pesantren)) {
                        if (currentTitle && currentTitle !== 'Vite + React') {
                            document.title = `${currentTitle} | ${data.nama_pesantren}`;
                        } else {
                            document.title = data.nama_pesantren;
                        }
                    }
                }

            } catch (err) {
                console.error('Error loading branding:', err);
            }
        };

        loadBranding();
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 pt-16">
            <Navbar />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
        </div>
    );
}
