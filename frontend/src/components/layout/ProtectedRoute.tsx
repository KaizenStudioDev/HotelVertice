import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
    /** Roles that are allowed to access this route */
    allowedRoles: string[];
    /** Where to redirect if the user has a different staff role */
    staffRedirect?: string;
}

/**
 * Protects a route by role.
 * - Not logged in → /login
 * - Logged in but wrong role → staffRedirect (if staff) or /
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, staffRedirect }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="w-full h-screen flex items-center justify-center bg-gray-light">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
            </div>
        );
    }

    if (!user) return <Navigate to="/login" replace />;

    if (!allowedRoles.includes(user.role)) {
        // Send staff to their own panel, everyone else to home
        if (staffRedirect) return <Navigate to={staffRedirect} replace />;
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
