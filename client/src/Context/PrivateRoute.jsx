

import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './AuthContext';
// import Sidebar from '../components/Sidebar';
// import AppFooter from '../components/Footer';

const PrivateRoute = () => {
    const { authenticated } = useAuth();
    return (
        !authenticated ? <>
            {/* <Sidebar /> */}
           
            <Navigate to='/signin' />
        </> :  <Outlet />
    )
}

export default PrivateRoute;
