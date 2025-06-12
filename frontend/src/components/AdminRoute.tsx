// src/components/AdminRoute.tsx

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

interface AdminRouteProps {
    children: React.ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (user && user.role === 'Admin') {
        return <>{children}</>;
    }

    return <Navigate to="/" replace />;
};

export default AdminRoute;