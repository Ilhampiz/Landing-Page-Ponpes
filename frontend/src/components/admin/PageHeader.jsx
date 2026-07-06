import { useSidebar } from '../../context/SidebarContext';
import { Menu } from 'lucide-react';

export default function PageHeader({ title, children }) {
    const { toggleSidebar } = useSidebar();

    return (
        <header className="bg-white border-b border-slate-100 px-4 sm:px-6 md:px-8 flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 sm:py-0 sm:h-16 shrink-0 shadow-sm z-10 gap-3">
            <div className="flex items-center space-x-3 min-w-0">
                <button
                    onClick={toggleSidebar}
                    className="p-2 rounded-xl text-slate-555 hover:bg-slate-50 border border-slate-200 lg:hidden shrink-0 transition cursor-pointer shadow-xs"
                    aria-label="Open sidebar"
                >
                    <Menu className="w-4 h-4" />
                </button>
                <h1 className="text-base sm:text-lg font-bold font-serif text-slate-900 tracking-tight truncate">{title}</h1>
            </div>
            {children && (
                <div className="flex items-center space-x-3 shrink-0 self-start sm:self-auto w-full sm:w-auto justify-end">
                    {children}
                </div>
            )}
        </header>
    );
}
