import { 
    LayoutDashboard, 
    Newspaper, 
    Image as ImageIcon, 
    GraduationCap, 
    Users, 
    Settings as SettingsIcon 
} from 'lucide-react';

export const adminMenuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Berita', path: '/admin/news', icon: Newspaper },
    { name: 'Galeri', path: '/admin/gallery', icon: ImageIcon },
    { name: 'Program', path: '/admin/programs', icon: GraduationCap },
    { name: 'PPDB', path: '/admin/ppdb', icon: Users },
    {name: 'Profil & Tampilan', path: '/admin/settings', icon: SettingsIcon },
];
