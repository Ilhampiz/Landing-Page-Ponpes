import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
    LogOut,
    UserCheck,
    BookOpen,
    X
} from 'lucide-react';
import { adminMenuItems } from '../config/adminMenu';
import { useSidebar } from '../context/SidebarContext';

export default function Sidebar() {
    const { admin, logout } = useAuth();
    const { isOpen, closeSidebar } = useSidebar();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/admin/login');
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    return (
        <aside className={`w-[240px] fixed top-0 bottom-0 left-0 bg-slate-900 text-slate-300 flex flex-col justify-between z-40 border-r border-slate-800 font-sans shadow-xl transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div>
                {/* Header Brand */}
                <div className="h-16 px-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/20">
                    <div className="flex items-center space-x-2.5">
                        <BookOpen className="w-5 h-5 text-emerald-450 shrink-0 animate-pulse" />
                        <span className="font-serif font-bold text-xs sm:text-sm tracking-wide text-white truncate">Al-Qur'anul Karim</span>
                    </div>
                    <button 
                        onClick={closeSidebar}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 lg:hidden transition cursor-pointer"
                        aria-label="Close menu"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Logged in Admin Credentials */}
                <div className="px-5 py-4 border-b border-slate-800/80 bg-slate-950/10 flex items-center space-x-3">
                    <div className="bg-slate-800 p-2 rounded-xl text-emerald-400 shrink-0 border border-slate-700/50 shadow-sm">
                        <UserCheck className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-[11px] sm:text-xs font-bold text-slate-100 truncate">{admin?.name || 'Administrator'}</span>
                        <span className="text-[9px] sm:text-[10px] text-slate-500 font-semibold uppercase tracking-wider truncate">{admin?.role || 'Pengelola'}</span>
                    </div>
                </div>

                {/* NavLink Menu List */}
                <nav className="p-4 space-y-1.5">
                    {adminMenuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={closeSidebar}
                                className={({ isActive }) => `
                                    group flex items-center space-x-3 px-4 py-2.5 rounded-xl text-[11px] sm:text-xs font-semibold transition-all duration-150
                                    ${isActive 
                                        ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-md shadow-emerald-950/20 font-bold' 
                                        : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                                    }
                                `}
                            >
                                {({ isActive }) => (
                                    <>
                                        <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                                        <span>{item.name}</span>
                                    </>
                                )}
                            </NavLink>
                        );
                    })}
                </nav>
            </div>

            {/* Logout button at the bottom */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/10">
                <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 w-full px-4 py-2.5 rounded-xl text-[11px] sm:text-xs font-semibold text-rose-450 hover:bg-rose-950/20 hover:text-rose-350 transition-all duration-150 text-left cursor-pointer border border-transparent hover:border-rose-900/10"
                >
                    <LogOut className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>Keluar Akun</span>
                </button>
            </div>
        </aside>
    );
}
