import { 
    LayoutDashboard, 
    Newspaper, 
    Image as ImageIcon, 
    GraduationCap, 
    Users, 
    Settings as SettingsIcon,
    UserCircle,
} from 'lucide-react';

export const adminMenuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Berita', path: '/admin/news', icon: Newspaper },
    { name: 'Galeri', path: '/admin/gallery', icon: ImageIcon },
    { name: 'Program', path: '/admin/programs', icon: GraduationCap },
    { name: 'Pendaftaran', path: '/admin/pendaftaran', icon: Users },
    { name: 'Profil', path: '/admin/profil', icon: UserCircle },
    { name: 'Setting', path: '/admin/settings', icon: SettingsIcon },
];
