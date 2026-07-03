import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function Footer() {
    const [settings, setSettings] = useState({
        link_ig: '',
        link_fb: ''
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await api.get('/settings');
                if (res.data) {
                    setSettings(prev => ({
                        ...prev,
                        ...res.data
                    }));
                }
            } catch (err) {
                console.error('Error fetching settings for Footer:', err);
            }
        };
        fetchSettings();
    }, []);

    return (
        <footer className="border-t border-gray-200 bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
                <div>
                    <span className="font-semibold text-gray-700">Pondok Pesantren Al-Qur'anul Karim</span>
                    <span className="mx-1.5">•</span>
                    <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
                </div>
                
                <div className="flex items-center gap-4">
                    {settings.link_fb && (
                        <a 
                            href={settings.link_fb} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-gray-500 hover:text-gray-700 transition-colors no-underline font-medium"
                        >
                            Facebook
                        </a>
                    )}
                    {settings.link_ig && (
                        <a 
                            href={settings.link_ig} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-gray-500 hover:text-gray-700 transition-colors no-underline font-medium"
                        >
                            Instagram
                        </a>
                    )}
                    {!settings.link_fb && !settings.link_ig && (
                        <span className="italic text-gray-400">Media Sosial Resmi</span>
                    )}
                </div>
            </div>
        </footer>
    );
}
