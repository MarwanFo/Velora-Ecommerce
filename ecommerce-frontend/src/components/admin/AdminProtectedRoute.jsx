import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PropTypes from 'prop-types';

/**
 * AdminProtectedRoute Component
 * Redirects to admin login if user is not authenticated or not an admin
 */
const AdminProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-900">
                <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/vl-control-panel/auth" state={{ from: location }} replace />;
    }

    if (!user.is_admin) {
        return <Navigate to="/vl-control-panel/auth" state={{ from: location }} replace />;
    }

    return children;
};

AdminProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AdminProtectedRoute;


