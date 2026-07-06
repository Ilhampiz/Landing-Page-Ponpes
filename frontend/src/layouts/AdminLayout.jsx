import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { SidebarProvider, useSidebar } from '../context/SidebarContext';

function AdminLayoutContent() {
    const { isOpen, closeSidebar } = useSidebar();

    return (
        <div className="min-h-screen flex bg-slate-50 font-sans overflow-x-hidden relative">
            {/* Backdrop for Mobile Drawer */}
            {isOpen && (
                <div 
                    onClick={closeSidebar} 
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-30 lg:hidden transition-opacity duration-300"
                />
            )}
            
            <Sidebar />
            
            <div className="flex-grow lg:ml-[240px] ml-0 flex flex-col min-w-0 transition-all duration-300">
                <Outlet />
            </div>
        </div>
    );
}

export default function AdminLayout() {
    return (
        <SidebarProvider>
            <AdminLayoutContent />
        </SidebarProvider>
    );
}
