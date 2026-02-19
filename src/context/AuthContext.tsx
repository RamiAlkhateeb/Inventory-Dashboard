import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { api } from '../services/api';

// Types
export interface User {
    email: string;
    displayName: string;
    token: string;
}

interface AuthContextType {
    user: User | null;
    login: (values: any) => Promise<void>;
    logout: () => void;
}

// Create Context
const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    // On app load, check if token exists and fetch user (like ReplaySubject)
    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await api.get<User>('/account'); // Neil's standard current user endpoint
                    setUser(response.data);
                } catch {
                    localStorage.removeItem('token');
                }
            }
        };
        loadUser();
    }, []);

    const login = async (values: any) => {
        const response = await api.post<User>('/account/login', values);
        localStorage.setItem('token', response.data.token);
        setUser(response.data);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used inside AuthProvider");
    return context;
};