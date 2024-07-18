import axios from "axios";
import {
    Button,
    Label,
    Modal,
    Pagination,
    Table,
    TextInput
} from "flowbite-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaEye } from "react-icons/fa";
import { HiPlusCircle } from "react-icons/hi";
import { IoIosRefreshCircle } from "react-icons/io";
import Select from 'react-select';
import { modalTheme } from "../theme/modalTheme";
import { tableTheme } from "../theme/tableTheme";


const RoleList = () => {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
 
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [roleView, setRoleView] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [user, setUser] = useState("");
    const [assign, setAssign] = useState("");
    const [newRole, setNewRole] = useState({ name: "", menus: "" });

    const menus = [
        { name: "User Management" },
        { name: "Role Management", },
        { name: "Book Management", },
        { name: "Dashboard" },
        { name: "Profile" },
        { name: "Settings" },
        { name: "Notifications" },
    ]


    const roleList = async () => {
        try {
            const store = JSON.parse(localStorage.getItem("userData") || "{}");
            const apiToken = store?.data?.token;
            console.log(apiToken);
            if (!apiToken) {
                throw new Error("Missing authorization token");
            }

            const response = await axios.post(
                "http://localhost:8000/role/list",
                null,
                {
                    headers: {
                        Authorization: `Bearer ${apiToken}`,
                    },
                }
            );
            setLoading(false);
            setData(response?.data?.data);
        } catch (error) {
            console.error(error.message || "Error fetching roles details");
            throw error;
        }
    };

    useEffect(() => {
        const checkAuth = async () => {
            try {
                await roleList();


            } catch (error) {
                console.error(error?.message || "Error in authentication check");
            }
        };

        checkAuth();
    }, []);

    const UserList = async () => {
        try {
            const store = JSON.parse(localStorage.getItem("userData") || "{}");
            const apiToken = store?.data?.token;
            console.log(apiToken);
            if (!apiToken) {
                throw new Error("Missing authorization token");
            }

            const response = await axios.post(
                "http://localhost:8000/user/list",
                null,
                {
                    headers: {
                        Authorization: `Bearer ${apiToken}`,
                    },
                }
            );
            setLoading(false);
            setUser(response?.data?.data);
        } catch (error) {
            console.error(error.message || "Error fetching roles details");
            throw error;
        }
    };


    const createRole = async () => {
        try {
            const store = JSON.parse(localStorage.getItem("userData") || "{}");
            const apiToken = store?.data?.token;
            if (!apiToken) {
                throw new Error("Missing authorization token");
            }

            // Extract only the value (name) from the selected menu options
            const roleData = {
                ...newRole,
                menus: newRole.menu.map((option) => option.value), // map selected options to their values
            };

            await axios.post(`http://localhost:8000/role/create`, roleData, {
                headers: {
                    Authorization: `Bearer ${apiToken}`,
                },
            });
            await roleList();
            toast.success("Role created successfully");
            setCreateModalOpen(false);
            setNewRole({ name: "", menu: [] });
        } catch (error) {
            console.error(error.message || "Error creating role");
            toast.error("Failed to create role");
        }
    };


    const getRole = async (id) => {
        try {
            const store = JSON.parse(localStorage.getItem("userData") || "{}");
            const apiToken = store?.data?.token;
            console.log(apiToken);
            if (!apiToken) {
                throw new Error("Missing authorization token");
            }

            const response = await axios.get(
                `http://localhost:8000/role/get/${id}`, {
                headers: {
                    Authorization: `Bearer ${apiToken}`,
                },
            });
            setLoading(false);
            setRoleView(response?.data);
        } catch (error) {
            console.error(error.message || "Error fetching roles details");
            throw error;
        }
    };


    // Get current data
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const filteredData = Array.isArray(data)
        ? data.filter(
            (role) =>
                role.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : [];

    const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const serialNumber = indexOfFirstItem + 1;

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Handle create button click
    const handleCreateClick = () => {
        setCreateModalOpen(true);
    };

    // handle view modal
    const handleViewClick = (id) => {
        getRole(id);
        setViewModalOpen(true);
    };

    const handleMenuChange = (selectedOptions) => {
        setNewRole({ ...newRole, menu: selectedOptions });
    };

    return (
        <>
            <div>
                <div className="p-4">
                    <h1 className="my-10 ml-7 text-xl font-semibold dark:text-white ">
                        Role List
                        <div className="float-right rtl:float-left">
                            <div className="flex space-x-2 rtl:space-x-reverse">
                                <Button color="gray" onClick={handleCreateClick}>
                                    <HiPlusCircle className="mr-2 h-5 w-5" />
                                    Add Role
                                </Button>
                                <Button
                                    color="gray"
                                    onClick={() => {
                                        roleList();
                                        toast.success("Record Refreshed");
                                    }}
                                >
                                    <IoIosRefreshCircle className="mr-2 h-5 w-5" />
                                    Refresh
                                </Button>
                            </div>
                        </div>
                    </h1>
                    <div className="flex justify-end items-end mb-3">
                        <TextInput
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="max-w-xs"
                        />
                    </div>
                    <div className="overflow-x-auto">
                        <Table theme={tableTheme} striped={true}>
                            <Table.Head>
                                <Table.HeadCell>#</Table.HeadCell>
                                <Table.HeadCell>name</Table.HeadCell>
                                <Table.HeadCell>menu count</Table.HeadCell>
                                <Table.HeadCell>action</Table.HeadCell>

                            </Table.Head>
                            <Table.Body className="divide-y">
                                {loading
                                    ? [...Array(itemsPerPage)].map((_, index) => (
                                        <Table.Row
                                            key={index}
                                            className="bg-white dark:bg-gray-800"
                                        >
                                            <Table.Cell>
                                                <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-full animate-pulse"></div>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-full animate-pulse"></div>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-full animate-pulse"></div>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-full animate-pulse"></div>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-full animate-pulse"></div>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-full animate-pulse"></div>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))
                                    : currentData.map((role, index) => (
                                        <Table.Row
                                            key={index}
                                            className="bg-white dark:bg-gray-800"
                                        >
                                            <Table.Cell>{serialNumber + index}</Table.Cell>
                                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white ">
                                                {role.name}
                                            </Table.Cell>

                                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white ">
                                                {role.menus.length}
                                            </Table.Cell>
                                            <Table.Cell className="flex flex-wrap gap-2">
                                                <Button
                                                    color="blue"
                                                    pill
                                                    onClick={() => handleViewClick(role?._id)}
                                                    size={"sm"}
                                                >
                                                    <FaEye size={"sm"} className="mr-2 h-5 w-5" />
                                                    view
                                                </Button>

                                            </Table.Cell>
                                            {/* {role.menus.map((menu, index) => (

                                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white ">
                                                    {menu}
                                                </Table.Cell>

                                            ))} */}


                                        </Table.Row>
                                    ))}
                            </Table.Body>
                        </Table>
                    </div>
                    <div className="flex justify-center mt-4">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={paginate}
                        />
                    </div>
                </div>
            </div>

            {/* view Modal */}

            <Modal theme={modalTheme}
                position={'center'}
                show={viewModalOpen}
                size="md"
                onClose={() => setViewModalOpen(false)}
                popup
            >
                <Modal.Header className="justify-center">
                    View Role

                </Modal.Header>
                <Modal.Body>
                    <div className="text-center">

                        <div className="flex flex-col gap-4">

                            <div>
                                <div className="text-center">
                                    <h3 className="mb-1 text-lg mb-2 font-normal text-gray-500 dark:text-gray-400">
                                        Role Name : {roleView?.name}
                                    </h3>
                                    <div className="flex flex-col gap-4">
                                        {roleView && roleView.menus && roleView.menus.length > 0 ? (
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50 dark:bg-gray-800">
                                                    <tr>
                                                        <th
                                                            scope="col"
                                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                        >
                                                            SL.No
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                        >
                                                            Menus
                                                        </th>
                                                    </tr>
                                                </thead>

                                                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                                                    {roleView.menus.map((permission, index) => (
                                                        <tr key={index}>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium dark:text-white">
                                                                {index + 1}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium dark:text-white">
                                                                {permission}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>


                                        ) : (
                                            <p className="text-gray-500 dark:text-gray-400">You do not have any menus.</p>
                                        )}
                                    </div>
                                </div>

                            </div>

                        </div>

                    </div>
                </Modal.Body>
            </Modal>


            {/* create Modal */}
            <Modal
                theme={modalTheme}
                position={'center'}
                show={createModalOpen}
                size="lg"
                onClose={() => setCreateModalOpen(false)}
                popup

            >
                <Modal.Header className="justify-center">
                    Add Role

                </Modal.Header>
                <Modal.Body>
                    <div className="text-center">
                       
                        <div className="flex flex-col gap-4">
                            <div>
                                <Label htmlFor="newName" value="name" />
                                <TextInput
                                    id="newName"
                                    type="text"
                                    value={newRole.name || ""}
                                    onChange={(e) =>
                                        setNewRole({
                                            ...newRole,
                                            name: e.target.value,
                                        })
                                    }
                                />
                            </div>


                        </div>
                        <div className="flex flex-col gap-4">
                            <div>

                                <div>
                                    <Label htmlFor="newMenu" value="Menu" />
                                    <Select
                                        id="newMenu"
                                        isMulti
                                        options={menus.map((menu) => ({ value: menu.name, label: menu.name }))}
                                        value={newRole.menu}
                                        onChange={handleMenuChange}
                                    />
                                </div>
                            </div>


                        </div>
                        <div className="flex justify-center gap-4 mt-4">
                            <Button color="success" onClick={createRole} >
                                save
                            </Button>
                            <Button color="gray" onClick={() => setCreateModalOpen(false)}>
                                cancel
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

        </>
    )
}

export default RoleList