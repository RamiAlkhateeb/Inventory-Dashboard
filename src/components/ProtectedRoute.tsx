import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = () => {
    const { user } = useAuth();
    const token = localStorage.getItem('token'); // Quick fallback check

    if (!user && !token) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />; // If logged in, render the protected child components
};