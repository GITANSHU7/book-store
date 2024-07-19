import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";
import SideBar from "../conponents/SideBar";
// import Sidebar from "../components/Sidebar";
// import AppFooter from "../components/Footer";

const PrivateRoutes = () => {
  const { authenticated } = useAuth();
  return authenticated ? (
    <>
      <SideBar />
      <div className="min-h-screen">
        <Outlet />
      </div>
      {/* <AppFooter /> */}
    </>
  ) : (
    <Navigate to="/signin" />
  );
};

export default PrivateRoutes;
