import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [admin, setAdmin] = useState(
        JSON.parse(localStorage.getItem('admin_data')) || null
    );
    const navigate = useNavigate();

    const login = async (email, password) => {
        const res = await api.post('/admin/login', { email, password });
        localStorage.setItem('admin_token', res.data.token);
        localStorage.setItem('admin_data', JSON.stringify(res.data.admin));
        setAdmin(res.data.admin);
        navigate('/admin/dashboard');
    };

    const logout = async () => {
        await api.post('/admin/logout');
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_data');
        setAdmin(null);
        navigate('/admin/login');
    };

    return (
        <AuthContext.Provider value={{ admin, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}