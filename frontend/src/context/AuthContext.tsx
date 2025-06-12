import { createContext, useState, useContext, useEffect, type ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

interface AuthUser {
    username: string;
    role: string;
}

interface AuthContextType {
    user: AuthUser | null;
    login: (token: string) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        try {
            const token = localStorage.getItem('authToken');
            if (token) {
                const decoded: { name: string; role: string } = jwtDecode(token);
                setUser({ username: decoded.name, role: decoded.role });
            }
        } catch (error) {
            localStorage.removeItem('authToken');
            console.error("Failed to initialize auth state from token", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const login = (token: string) => {
        try {
            const decoded: { name: string; role: string } = jwtDecode(token);
            const authUser: AuthUser = { username: decoded.name, role: decoded.role };

            setUser(authUser);
            localStorage.setItem('authToken', token);
        } catch (error) {
            console.error("Failed to decode token on login", error);
            logout();
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('authToken');
    };

    const value = { user, login, logout, isLoading };

    return (
        <AuthContext.Provider value={value}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
};