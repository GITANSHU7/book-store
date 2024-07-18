import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Alert, Flowbite } from "flowbite-react";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import { AuthProvider } from "./Context/AuthContext";
import { Toaster } from "react-hot-toast";
import PrivateRoute from "./Context/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import UserList from "./pages/UserList";
import RoleList from "./pages/RoleList";

function App() {
  return (
    <>
      <AuthProvider>
        <Flowbite>
          <Toaster />

          <Router>
            <Routes>
              <Route element={<PrivateRoute />}>
                {/* <Route path="/user-management" element={<UserList />} />
                            <Route path="/role-management" element={<RoleList />} />
                            <Route path="/dashboard" element={<Dashboard />} /> */}
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/user-management" element={<UserList />} />
                <Route path="/role-management" element={<RoleList />} />
                {/* <Route path="/notifications" element={<Notification />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/reports" element={<Reports />} />
                            <Route path="/settings" element={<Settings />} />                      */}
              </Route>
              <Route path="/signin" element={<Signin />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </Router>
        </Flowbite>
      </AuthProvider>
      {/* <Signup /> */}
    </>
  );
}

export default App;
