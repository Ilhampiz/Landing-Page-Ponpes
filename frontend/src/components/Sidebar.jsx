import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
    LayoutDashboard, 
    Newspaper, 
    Image as ImageIcon, 
    GraduationCap, 
    Users, 
    Settings as SettingsIcon, 
    LogOut,
    UserCheck,
    BookOpen
} from 'lucide-react';

export default function Sidebar() {
    const { admin, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/admin/login');
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    const menuItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Berita', path: '/admin/news', icon: Newspaper },
        { name: 'Galeri', path: '/admin/gallery', icon: ImageIcon },
        { name: 'Program', path: '/admin/programs', icon: GraduationCap },
        { name: 'PPDB', path: '/admin/ppdb', icon: Users },
        { name: 'Pengaturan', path: '/admin/settings', icon: SettingsIcon },
    ];

    return (
        <aside className="w-[220px] fixed top-0 bottom-0 left-0 bg-[#1e293b] text-white flex flex-col justify-between z-40 border-r border-slate-700 font-sans shadow-lg">
            <div>
                {/* Header Brand */}
                <div className="p-5 border-b border-slate-700 flex items-center space-x-2 bg-slate-900">
                    <BookOpen className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span className="font-serif font-bold text-sm tracking-wide text-white truncate">Pesantren Qur'ani</span>
                </div>

                {/* Logged in Admin Credentials */}
                <div className="px-5 py-4 border-b border-slate-700 bg-slate-800 flex items-center space-x-2.5">
                    <div className="bg-slate-700 p-1.5 rounded-full text-slate-300 shrink-0">
                        <UserCheck className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col overflow-hidden">
                        <span className="text-xs font-semibold text-white truncate">{admin?.name || 'Admin'}</span>
                        <span className="text-[10px] text-slate-450 font-medium uppercase tracking-wider truncate">{admin?.role || 'Administrator'}</span>
                    </div>
                </div>

                {/* NavLink Menu List */}
                <nav className="p-3 space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) => `
                                    flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200
                                    ${isActive 
                                        ? 'bg-emerald-600 text-white shadow-sm font-bold' 
                                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                                    }
                                `}
                            >
                                <Icon className="w-4 h-4 shrink-0" />
                                <span>{item.name}</span>
                            </NavLink>
                        );
                    })}
                </nav>
            </div>

            {/* Logout button at the bottom */}
            <div className="p-3 border-t border-slate-700 bg-slate-900">
                <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 w-full px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/30 hover:text-rose-300 transition-all duration-200 text-left cursor-pointer"
                >
                    <LogOut className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>Keluar Akun</span>
                </button>
            </div>
        </aside>
    );
}
