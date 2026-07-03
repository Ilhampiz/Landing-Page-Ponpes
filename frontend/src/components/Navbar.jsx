import { useState } from 'react';
import { BookOpen, Menu, X } from 'lucide-react';

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('beranda');

    const menuItems = [
        { label: 'Beranda', to: 'beranda' },
        { label: 'Profil', to: 'profil' },
        { label: 'Program', to: 'program' },
        { label: 'Galeri', to: 'galeri' },
        { label: 'Berita', to: 'berita' },
        { label: 'PPDB', to: 'ppdb' },
        { label: 'Kontak', to: 'kontak' },
    ];

    const handleScroll = (e, id) => {
        e.preventDefault();
        setActiveSection(id);
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        setOpen(false);
    };

    return (
        <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                {/* Brand / Logo */}
                <a 
                    href="#beranda" 
                    onClick={(e) => handleScroll(e, 'beranda')} 
                    className="flex items-center gap-2 text-emerald-850 font-bold text-lg no-underline"
                >
                    <BookOpen size={22} className="text-emerald-600" />
                    <span className="text-emerald-800 font-serif">Pondok Pesantren</span>
                </a>

                {/* Desktop Nav Items */}
                <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
                    {menuItems.map((item) => (
                        <a
                            key={item.to}
                            href={`#${item.to}`}
                            onClick={(e) => handleScroll(e, item.to)}
                            className={`no-underline hover:text-emerald-600 transition-colors py-1 ${
                                activeSection === item.to 
                                    ? 'text-emerald-700 font-bold border-b-2 border-emerald-600' 
                                    : 'text-gray-600'
                            }`}
                        >
                            {item.label}
                        </a>
                    ))}
                </div>

                {/* Mobile Menu Hamburger Button */}
                <button
                    onClick={() => setOpen(!open)}
                    className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none border-none bg-transparent cursor-pointer"
                >
                    {open ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Dropdown Menu */}
            <div className={open ? "md:hidden border-t bg-white" : "hidden md:hidden"}>
                <nav className="px-4 pb-4 pt-2 flex flex-col gap-2 text-sm text-gray-700">
                    {menuItems.map((item) => (
                        <a
                            key={item.to}
                            href={`#${item.to}`}
                            onClick={(e) => handleScroll(e, item.to)}
                            className={`no-underline py-2.5 px-3 rounded-lg hover:bg-slate-50 transition-colors block ${
                                activeSection === item.to 
                                    ? 'text-emerald-700 font-bold bg-emerald-50' 
                                    : 'text-gray-600'
                            }`}
                        >
                            {item.label}
                        </a>
                    ))}
                </nav>
            </div>
        </nav>
    );
}
