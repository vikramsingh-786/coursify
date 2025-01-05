import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const PrivateRoute = () => {
    const { user } = useSelector((state) => state.auth); 
    const location = useLocation();

    if (user === undefined) {
        return <div>Loading...</div>; 
    }

    return user ? (
        <Outlet />
    ) : (
        <Navigate to="/login" state={{ from: location }} replace />
    );
};

export default PrivateRoute;
