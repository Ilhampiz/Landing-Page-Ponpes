import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Public pages
import Home from './pages/public/Home';
import PublicLayout from './components/PublicLayout';

// Admin pages
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminNews from './pages/admin/News';
import AdminGallery from './pages/admin/Gallery';
import AdminPrograms from './pages/admin/Programs';
import AdminPpdb from './pages/admin/Ppdb';
import AdminSettings from './pages/admin/Settings';

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
            <Route path="/admin/dashboard" element={
                <PrivateRoute><AdminDashboard /></PrivateRoute>
            } />
            <Route path="/admin/news" element={
                <PrivateRoute><AdminNews /></PrivateRoute>
            } />
            <Route path="/admin/gallery" element={
                <PrivateRoute><AdminGallery /></PrivateRoute>
            } />
            <Route path="/admin/programs" element={
                <PrivateRoute><AdminPrograms /></PrivateRoute>
            } />
            <Route path="/admin/ppdb" element={
                <PrivateRoute><AdminPpdb /></PrivateRoute>
            } />
            <Route path="/admin/settings" element={
                <PrivateRoute><AdminSettings /></PrivateRoute>
            } />

            {/* ===================== */}
            {/* PUBLIC ROUTES         */}
            {/* ===================== */}
            <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />

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