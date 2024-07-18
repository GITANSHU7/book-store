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

const BookList = () => {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState(null);
    const [userToEdit, setUserToEdit] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newUser, setNewUser] = useState({ name: "", email: "", username: "", role:"" });
    const [searchQuery, setSearchQuery] = useState("");
    const [role, setRole] = useState("");

    
    const bookDetails = async () => {
        try {
            const store = JSON.parse(localStorage.getItem("userData") || "{}");
            const apiToken = store?.data?.token;
            console.log(apiToken);
            if (!apiToken) {
                throw new Error("Missing authorization token");
            }

            const response = await axios.post(
                "http://localhost:8000/book",
                null,
                // {
                //     headers: {
                //         Authorization: `Bearer ${apiToken}`,
                //     },
                // }
            );
            setLoading(false);
            setData(response?.data?.data);
        } catch (error) {
            console.error(error.message || "Error fetching user details");
            throw error;
        }
    };

    useEffect(() => {
        // const checkAuth = async () => {
        //     try {
        //         await bookDetails();
               

        //     } catch (error) {
        //         console.error(error?.message || "Error in authentication check");
        //     }
        // };

        // checkAuth();
        bookDetails();
    }, []);

    const deleteBook = async () => {
        if (!userIdToDelete) return;

        try {
            const store = JSON.parse(localStorage.getItem("userData") || "{}");
            const apiToken = store?.data?.token;

            if (!apiToken) {
                throw new Error("Missing authorization token");
            }

            await axios.delete(`http://localhost:8000/book/${userIdToDelete}`, {
                headers: {
                    Authorization: `Bearer ${apiToken}`,
                },
            });
            await userDetails();
            toast.success("Book deleted successfully");
            setDeleteModalOpen(false);
            setUserIdToDelete(null);
        } catch (error) {
            console.error(error.message || "Error deleting user");
            toast.error("Failed to delete user");
        }
    };

    const editBook = async () => {
        if (!userToEdit) return;

        try {
            const store = JSON.parse(localStorage.getItem("userData") || "{}");
            const apiToken = store?.data?.token;

            if (!apiToken) {
                throw new Error("Missing authorization token");
            }

            await axios.put(`http://localhost:8000/book/update/${userToEdit._id}`, userToEdit, {
                headers: {
                    Authorization: `Bearer ${apiToken}`,
                },
            });
            await userDetails();
            toast.success("Book updated successfully");
            setEditModalOpen(false);
            setUserToEdit(null);
        } catch (error) {
            console.error(error.message || "Error updating user");
            toast.error("Failed to update book");
        }
    };

    const createBook = async () => {
        try {
            const store = JSON.parse(localStorage.getItem("userData") || "{}");
            const apiToken = store?.data?.token;
            if (!apiToken) {
                throw new Error("Missing authorization token");
            }

            await axios.post(`http://localhost:8000/book/create`, newUser, {
                headers: {
                    Authorization: `Bearer ${apiToken}`,
                },
            });
            await userDetails();
            toast.success("Book created successfully");
            setCreateModalOpen(false);
            setNewUser({ name: "", email: "", username: "" });
        } catch (error) {
            console.error(error.message || "Error creating book");
            toast.error("Failed to create book");
        }

    }

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

        return (
            <>
            
            </>
        )

}

export default BookList