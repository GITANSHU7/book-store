import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaEdit } from "react-icons/fa";
import { HiOutlineExclamationCircle, HiPlusCircle } from "react-icons/hi";
import { IoIosRefreshCircle } from "react-icons/io";
import { RiDeleteBin6Fill } from "react-icons/ri";
import {
  Button,
  Modal,
  Table,
  TextInput,
  Pagination,
  Label,
  Select,
} from "flowbite-react";
import { tableTheme } from "../theme/tableTheme";
import { modalTheme } from "../theme/modalTheme";
import { hasMenuAccess } from "../utils/hasMenuAccess";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { useSelector } from "react-redux";

const UserList = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const [userToEdit, setUserToEdit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    username: "",
    role: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [role, setRole] = useState("");
  const navigation = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const userRole = user?.data?.user?.role;
  const apiToken = user?.data?.token;

  // not authorized
  useEffect(() => {
    if (!hasMenuAccess("User Management", userRole)) {
      navigation("/not-authorized");
    }
  }, []);

  const loadUser = async () => {
    try {
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
      setData(response?.data?.data);
    } catch (error) {
      console.error(error.message || "Error fetching user details");
      throw error;
    }
  };

  // list the role
  const roleList = async () => {
    try {
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
      setRole(response?.data?.data);
    } catch (error) {
      console.error(error.message || "Error fetching user details");
      throw error;
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await loadUser();
      } catch (error) {
        console.error(error?.message || "Error in authentication check");
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    roleList();
  }, [editModalOpen]);

  console.log(role, "role1");

  // Delete user
  const deleteUser = async () => {
    if (!userIdToDelete) return;

    try {
      if (!apiToken) {
        throw new Error("Missing authorization token");
      }

      await axios.delete(
        `http://localhost:8000/user/delete/${userIdToDelete}`,
        {
          headers: {
            Authorization: `Bearer ${apiToken}`,
          },
        }
      );
      await loadUser();
      toast.success("User deleted successfully");
      setDeleteModalOpen(false);
      setUserIdToDelete(null);
    } catch (error) {
      console.error(error.message || "Error deleting user");
      toast.error("Failed to delete user");
    }
  };

  // Edit user
  const editUser = async () => {
    if (!userToEdit) return;

    try {
      if (!apiToken) {
        throw new Error("Missing authorization token");
      }

      await axios.put(
        `http://localhost:8000/user/update/${userToEdit._id}`,
        userToEdit,
        {
          headers: {
            Authorization: `Bearer ${apiToken}`,
          },
        }
      );
      await loadUser();
      toast.success("User updated successfully");
      setEditModalOpen(false);
      setUserToEdit(null);
    } catch (error) {
      console.error(error.message || "Error updating user");
      toast.error("Failed to update user");
    }
  };

  // Create user
  const createUser = async () => {
    try {
      if (!apiToken) {
        throw new Error("Missing authorization token");
      }

      await axios.post(`http://localhost:8000/user/create`, newUser, {
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      });
      await loadUser();
      toast.success("User created successfully");
      setCreateModalOpen(false);
      setNewUser({ name: "", email: "", username: "" });
    } catch (error) {
      console.error(error.message || "Error creating user");
      toast.error("Failed to create user");
    }
  };

  // Get current data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const filteredData = Array.isArray(data)
    ? data.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.username.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const serialNumber = indexOfFirstItem + 1;

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle delete button click
  const handleDeleteClick = (id) => {
    setUserIdToDelete(id);
    setDeleteModalOpen(true);
  };

  // Handle edit button click
  const handleEditClick = (user) => {
    setUserToEdit(user);
    setEditModalOpen(true);
  };

  // Handle create button click
  const handleCreateClick = () => {
    setCreateModalOpen(true);
  };

  return (
    <>
      <div>
        <div className="p-4">
          <h1 className="my-10 ml-7 text-xl font-semibold dark:text-white ">
            User List
            <div className="float-right rtl:float-left">
              <div className="flex space-x-2 rtl:space-x-reverse">
                <Button color="gray" onClick={handleCreateClick}>
                  <HiPlusCircle className="mr-2 h-5 w-5" />
                  Add User
                </Button>
                <Button
                  color="gray"
                  onClick={() => {
                    loadUser();
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
                <Table.HeadCell>email</Table.HeadCell>
                <Table.HeadCell>username</Table.HeadCell>
                <Table.HeadCell>role</Table.HeadCell>
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
                  : currentData.map((user, index) => (
                      <Table.Row
                        key={index}
                        className="bg-white dark:bg-gray-800"
                      >
                        <Table.Cell>{serialNumber + index}</Table.Cell>
                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white ">
                          {user.name}
                        </Table.Cell>
                        <Table.Cell>{user.email}</Table.Cell>
                        <Table.Cell>{user.username}</Table.Cell>
                        <Table.Cell>{user?.role?.name ?? "N/A"}</Table.Cell>
                        <Table.Cell className="flex flex-wrap gap-2">
                          <Button
                            color="blue"
                            pill
                            onClick={() => handleEditClick(user)}
                            size={"sm"}
                          >
                            <FaEdit size={"sm"} className="mr-2 h-5 w-5" />
                            edit
                          </Button>
                          <Button
                            color="failure"
                            pill
                            onClick={() => handleDeleteClick(user._id)}
                            size={"sm"}
                          >
                            <RiDeleteBin6Fill
                              size={"sm"}
                              className="mr-2 h-5 w-5"
                            />
                            delete
                          </Button>
                        </Table.Cell>
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

      {/* Delete User Modal */}
      <Modal
        show={deleteModalOpen}
        size="md"
        onClose={() => setDeleteModalOpen(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure? You want to delete this user
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={deleteUser}>
                Yes I'm sure
              </Button>
              <Button color="gray" onClick={() => setDeleteModalOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        theme={modalTheme}
        position={"center"}
        show={editModalOpen}
        size="md"
        onClose={() => setEditModalOpen(false)}
        popup
      >
        <Modal.Header className="justify-center">Edit User</Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <div className="flex flex-col gap-4">
              <div>
                <Label htmlFor="name" value="name" />
                <TextInput
                  id="name"
                  type="text"
                  value={userToEdit?.name || ""}
                  onChange={(e) =>
                    setUserToEdit({
                      ...userToEdit,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="email" value="email" />
                <TextInput
                  id="email"
                  type="email"
                  value={userToEdit?.email || ""}
                  onChange={(e) =>
                    setUserToEdit({
                      ...userToEdit,
                      email: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="username" value="username" />
                <TextInput
                  id="username"
                  type="text"
                  value={userToEdit?.username || ""}
                  onChange={(e) =>
                    setUserToEdit({
                      ...userToEdit,
                      username: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <Label htmlFor="role" value="role" />
                <Select
                  id="role"
                  value={userToEdit?.role?._id || ""}
                  onChange={(e) =>
                    setUserToEdit({
                      ...userToEdit,
                      role: e.target.value,
                    })
                  }
                >
                  <option value="">Select Role</option>
                  {/* {role?.map((role) => {
                                        return (
                                        <option key={role._id} value={role._id}>
                                            {role.name}
                                        </option>
                                        )
                                    })} */}
                  {Array.isArray(role) &&
                    role.map((role) => (
                      <option key={role._id} value={role._id}>
                        {role.name}
                      </option>
                    ))}
                </Select>
              </div>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              <Button color="success" onClick={editUser}>
                save
              </Button>
              <Button color="gray" onClick={() => setEditModalOpen(false)}>
                cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Create User Modal */}
      <Modal
        theme={modalTheme}
        position={"center"}
        show={createModalOpen}
        size="md"
        onClose={() => setCreateModalOpen(false)}
        popup
      >
        <Modal.Header className="justify-center">Add User</Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <div className="flex flex-col gap-4">
              <div>
                <Label htmlFor="newName" value="name" />
                <TextInput
                  id="newName"
                  type="text"
                  value={newUser.name || ""}
                  onChange={(e) =>
                    setNewUser({
                      ...newUser,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="newEmail" value="email" />
                <TextInput
                  id="newEmail"
                  type="email"
                  value={newUser.email || ""}
                  onChange={(e) =>
                    setNewUser({
                      ...newUser,
                      email: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="newUsername" value="username" />
                <TextInput
                  id="newUsername"
                  type="text"
                  value={newUser.username || ""}
                  onChange={(e) =>
                    setNewUser({
                      ...newUser,
                      username: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <Label htmlFor="role" value="role" />
                <Select
                  id="role"
                  value={newUser?.role?._id || ""}
                  onChange={(e) =>
                    setNewUser({
                      ...newUser,
                      role: e.target.value,
                    })
                  }
                >
                  <option value="">Select Role</option>
                  {/* {role?.map((role) => {
                                        return (
                                        <option key={role._id} value={role._id}>
                                            {role.name}
                                        </option>
                                        )
                                    })} */}
                  {Array.isArray(role) &&
                    role.map((role) => (
                      <option key={role._id} value={role._id}>
                        {role.name}
                      </option>
                    ))}
                </Select>
              </div>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              <Button color="success" onClick={createUser}>
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
  );
};
export default UserList;
