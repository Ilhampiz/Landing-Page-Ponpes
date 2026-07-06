import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Public pages
import Home from "./pages/public/Home";
import Profil from "./pages/public/Profil";
import Program from "./pages/public/Program";
import Galeri from "./pages/public/Galeri";
import Berita from "./pages/public/Berita";
import Ppdb from "./pages/public/Ppdb";
import Kontak from "./pages/public/Kontak";
import PublicLayout from "./components/PublicLayout";

// Admin pages
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminNews from './pages/admin/News';
import AdminGallery from './pages/admin/Gallery';
import AdminPrograms from './pages/admin/Programs';
import AdminPpdb from './pages/admin/Ppdb';
import AdminSettings from './pages/admin/Settings';

import AdminLayout from './layouts/AdminLayout';

// Inline placeholders for missing public routes to prevent crashes





function PrivateRoute({ children }) {
    // Check Laravel Sanctum token
    const token = localStorage.getItem('admin_token');
    return token ? children : <Navigate to="/admin/login" />;
}

function AppRoutes() {
    return (
        <Routes>
            {/* ===================== */}
            {/* ADMIN ROUTES          */}
            {/* ===================== */}
            <Route path="/admin/login" element={<AdminLogin />} />
            
            <Route element={<PrivateRoute><AdminLayout /></PrivateRoute>}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/news" element={<AdminNews />} />
                <Route path="/admin/gallery" element={<AdminGallery />} />
                <Route path="/admin/programs" element={<AdminPrograms />} />
                <Route path="/admin/ppdb" element={<AdminPpdb />} />
                <Route path="/admin/settings" element={<AdminSettings />} />
            </Route>

            {/* ===================== */}
            {/* PUBLIC ROUTES         */}
            {/* ===================== */}
            <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
            <Route path="/profil" element={<PublicLayout><Profil /></PublicLayout>} />
            <Route path="/program" element={<PublicLayout><Program /></PublicLayout>} />
            <Route path="/galeri" element={<PublicLayout><Galeri /></PublicLayout>} />
            <Route path="/berita" element={<PublicLayout><Berita /></PublicLayout>} />
            <Route path="/ppdb" element={<PublicLayout><Ppdb /></PublicLayout>} />
            <Route path="/kontak" element={<PublicLayout><Kontak /></PublicLayout>} />

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </BrowserRouter>
    );
}