import axios from "axios";
import {
    Avatar,
    Drawer,
    Dropdown,
    Navbar,
    Sidebar,
    TextInput
} from "flowbite-react";
import { useState } from "react";
import { BiArrowFromLeft } from "react-icons/bi";
import { CgMenuLeftAlt } from "react-icons/cg";
import {
    HiClipboard,
    HiCollection,
    HiInformationCircle,
    HiSearch
} from "react-icons/hi";
import { Link } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => setIsOpen(false);

  // get login user data from AuthContext
     const { authenticated, userDetails } = useAuth();

    if (!authenticated) {
        return null;
    }

     console.log(userDetails?.data?.user?.role?.menus, "sdfdfgfgsf");

     const onLogout = async () => {
      

       try {
         const apiToken = userDetails?.data?.token;

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
         window.location.href = "/signin";
       } catch (error) {
         console.error(error.message || "Error fetching user details"); // Handle errors
       }
     };

  return (
    <>
      <Navbar fluid rounded>
        <Navbar.Brand>
          <CgMenuLeftAlt
            className="self-center text-2xl cursor-pointer"
            onClick={() => setIsOpen(true)}
          />
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            Flowbite React
          </span>
        </Navbar.Brand>
        <div className="flex md:order-2">
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
              <span className="block text-sm">
                {" "}
                {userDetails?.data?.user?.name}
              </span>
              <span className="block truncate text-sm font-medium">
                {userDetails?.data?.user?.email}
              </span>
            </Dropdown.Header>
            <Dropdown.Item>Dashboard</Dropdown.Item>
            <Dropdown.Item>Settings</Dropdown.Item>
            <Dropdown.Item>Earnings</Dropdown.Item>
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
                  {userDetails?.data?.user?.role?.menus?.map((item, index) => (
                    <Sidebar.ItemGroup key={index}>
                      <Sidebar.Item
                        icon={BiArrowFromLeft}
                        component={Link}
                        to={`/${item.toLowerCase().replace(/\s+/g, "-")}`}
                      >
                        {item}
                      </Sidebar.Item>
                    </Sidebar.ItemGroup>
                  ))}
                  <Sidebar.ItemGroup>
                    <Sidebar.Item
                      href="https://github.com/themesberg/flowbite-react/"
                      icon={HiClipboard}
                    >
                      Docs
                    </Sidebar.Item>
                    <Sidebar.Item
                      href="https://flowbite-react.com/"
                      icon={HiCollection}
                    >
                      Components
                    </Sidebar.Item>
                    <Sidebar.Item
                      href="https://github.com/themesberg/flowbite-react/issues"
                      icon={HiInformationCircle}
                    >
                      Help
                    </Sidebar.Item>
                  </Sidebar.ItemGroup>
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
