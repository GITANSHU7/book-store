import axios from "axios";
import {
  Avatar,
  Drawer,
  Dropdown,
  Navbar,
  Sidebar,
  TextInput,
  useThemeMode,
} from "flowbite-react";
import { useState } from "react";
import { BiArrowFromLeft } from "react-icons/bi";
import { CgMenuLeftAlt } from "react-icons/cg";
import { FaRegSun } from "react-icons/fa";
import {
  HiClipboard,
  HiCollection,
  HiInformationCircle,
  HiSearch,
} from "react-icons/hi";
import { LuMoon } from "react-icons/lu";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { clearUserData } from "../redux/authSlice";

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { toggleMode, mode } = useThemeMode();
  const handleClose = () => setIsOpen(false);

  const { authenticated, userDetails, setUserDetails } = useAuth();

  if (!authenticated) {
    return null;
  }

  const onLogout = async () => {
    try {
      const apiToken = user?.data?.token;

      if (!apiToken) {
        throw new Error("Missing authorization token"); // Throw error if no token
      }

      const response = await axios.post(
        "http://localhost:8000/auth/signout",
        null,
        {
          headers: {
            Authorization: `Bearer ${apiToken}`,
          },
        }
      );
      // on sucessful logout, remove the user data from local storage
      localStorage.removeItem("userData");
      clearUserData();
      setUserDetails(null);
      window.location.href = "/signin";
    } catch (error) {
      console.error(error.message || "Error fetching user details"); // Handle errors
    }
  };

  const handleToggleMode = () => {
    dispatch(toggleMode());
  };
  return (
    <>
      <Navbar fluid rounded className="bg-blue-400 dark:bg-slate-900">
        <Navbar.Brand>
          <CgMenuLeftAlt
            className="self-center text-2xl cursor-pointer mr-2"
            onClick={() => setIsOpen(true)}
          />
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white" onClick={()=> { navigate('/dashboard')}}>
            The Book Store
          </span>
        </Navbar.Brand>

        <div className="flex md:order-2">
          <span
            className="cursor-pointer flex items-center mr-4"
            onClick={toggleMode}
          >
            {mode === "light" ? (
              <LuMoon size={"20"} className="text-white" />
            ) : (
              <FaRegSun size={"20"} className="text-yellow-300" />
            )}
          </span>
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt="User settings"
                img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                rounded
              />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm"> {user?.data?.user?.name}</span>
              <span className="block truncate text-sm font-medium">
                {user?.data?.user?.email}
              </span>
            </Dropdown.Header>
            <Dropdown.Item onClick={()=> { navigate('/dashboard')}} >Dashboard</Dropdown.Item>


            <Dropdown.Divider />
            <Dropdown.Item onClick={onLogout}>Sign out</Dropdown.Item>
          </Dropdown>
        </div>
      </Navbar>
      <Drawer open={isOpen} onClose={handleClose}>
        <Drawer.Header title="MENU" titleIcon={() => <></>} />
        <Drawer.Items>
          <Sidebar
            aria-label="Sidebar with multi-level dropdown example"
            className="[&>div]:bg-transparent [&>div]:p-0"
          >
            <div className="flex h-full flex-col justify-between py-2">
              <div>
                <form className="pb-3 md:hidden">
                  <TextInput
                    icon={HiSearch}
                    type="search"
                    placeholder="Search"
                    required
                    size={32}
                  />
                </form>

                <Sidebar.Items>
                  {user?.data?.user?.role?.menus?.map((item, index) => (
                    <Sidebar.ItemGroup key={index}>
                      <Sidebar.Item
                        icon={BiArrowFromLeft}
                        as={Link}
                        to={`/${item.toLowerCase().replace(/\s+/g, "-")}`}
                      >
                        {item}
                      </Sidebar.Item>
                    </Sidebar.ItemGroup>
                  ))}
                  
                </Sidebar.Items>
              </div>
            </div>
          </Sidebar>
        </Drawer.Items>
      </Drawer>
    </>
  );
};

export default SideBar;
