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
import { useAuth } from "../Context/AuthContext";
import { useSelector } from "react-redux";
import { hasMenuAccess } from "../utils/hasMenuAccess";
import { useNavigate } from "react-router-dom";

const truncateText = (text, limit = 40) => {
  if (text.length > limit) {
    return text.substring(0, limit) + "...";
  }
  return text;
};

const BookList = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [bookIdToDelete, setBookIdToDelete] = useState(null);
  const [bookToEdit, setBookToEdit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newBook, setNewBook] = useState({
    name: "",
    description: "",
    author: "",
    published_by: "",
    price: "",
    image: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [role, setRole] = useState("");
  const navigation = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const apiToken = user?.data?.token;
  const userRole = user?.data?.user?.role;

  // get login user data from AuthContext
  const { authenticated, setUserDetails } = useAuth();

  // not authorized
  useEffect(() => {
    if (!hasMenuAccess("Book Management", userRole)) {
      navigation("/not-authorized");
    }
  }, []);

  const bookDetails = async () => {
    try {
      if (!apiToken) {
        throw new Error("Missing authorization token");
      }

      const response = await axios.post("http://localhost:8000/book", null, {
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      });
      setLoading(false);
      setData(response?.data?.data);
    } catch (error) {
      console.error(error.message || "Error fetching book details");
      throw error;
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await bookDetails();
      } catch (error) {
        console.error(error?.message || "Error in authentication check");
      }
    };

    checkAuth();
  }, []);

  const deleteBook = async () => {
    if (!bookIdToDelete) return;

    try {
      const store = JSON.parse(localStorage.getItem("userData") || "{}");
      const apiToken = store?.data?.token;

      if (!apiToken) {
        throw new Error("Missing authorization token");
      }

      await axios.delete(`http://localhost:8000/book/${bookIdToDelete}`, {
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      });
      await bookDetails();
      toast.success("Book deleted successfully");
      setDeleteModalOpen(false);
      setBookIdToDelete(null);
    } catch (error) {
      console.error(error.message || "Error deleting book");
      toast.error("Failed to delete book");
    }
  };

  const editBook = async () => {
    if (!bookToEdit) return;
    const formData = new FormData();
    formData.append("name", bookToEdit.name);
    formData.append("description", bookToEdit.description);
    formData.append("author", bookToEdit.author);
    formData.append("published_by", bookToEdit.published_by);
    formData.append("price", bookToEdit.price);
    if (bookToEdit.image) {
      formData.append("image", bookToEdit.image);
    }
    try {
      const store = JSON.parse(localStorage.getItem("userData") || "{}");
      const apiToken = store?.data?.token;

      if (!apiToken) {
        throw new Error("Missing authorization token");
      }

      await axios.put(
        `http://localhost:8000/book/update/${bookToEdit._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${apiToken}`,
          },
        }
      );
      await bookDetails();
      toast.success("Book updated successfully");
      setEditModalOpen(false);
      setBookToEdit(null);
    } catch (error) {
      console.error(error.message || "Error updating book");
      toast.error("Failed to update book");
    }
  };

  const createBook = async () => {
    const formData = new FormData();
    formData.append("name", newBook.name);
    formData.append("description", newBook.description);
    formData.append("author", newBook.author);
    formData.append("published_by", newBook.published_by);
    formData.append("price", newBook.price);
    if (newBook.image) {
      formData.append("image", newBook.image);
    }
    try {
      const store = JSON.parse(localStorage.getItem("userData") || "{}");
      const apiToken = store?.data?.token;
      if (!apiToken) {
        throw new Error("Missing authorization token");
      }

      await axios.post(`http://localhost:8000/book/create`, formData, {
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      });
      await bookDetails();
      toast.success("Book created successfully");
      setCreateModalOpen(false);
      setNewBook({
        name: "",
        description: "",
        author: "",
        published_by: "",
        price: "",
        image: "",
      });
      console.log(newBook);
    } catch (error) {
      console.error(error.message || "Error creating book");
      toast.error("Failed to create book");
    }
  };

  // Get current data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const filteredData = Array.isArray(data)
    ? data.filter(
        (book) =>
          book.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.published_by.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const serialNumber = indexOfFirstItem + 1;

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle delete button click
  const handleDeleteClick = (id) => {
    setBookIdToDelete(id);
    setDeleteModalOpen(true);
  };

  // Handle edit button click
  const handleEditClick = (book) => {
    setBookToEdit(book);
    setEditModalOpen(true);
  };

  // Handle create button click
  const handleCreateClick = () => {
    setCreateModalOpen(true);
  };

  const isFormValidEdit = () => {
    return (
      bookToEdit?.name &&
      bookToEdit?.description &&
      bookToEdit?.author &&
      bookToEdit?.published_by &&
      bookToEdit?.price 
    );
  };
  const isFormValidNew = () => {
    return (
      newBook?.name &&
      newBook?.description &&
      newBook?.author &&
      newBook?.published_by &&
      newBook?.price 
    );
  };

  return (
    <>
      <div>
        <div className="p-4">
          <h1 className="my-10 ml-7 text-xl font-semibold dark:text-white ">
            Book List
            <div className="float-right rtl:float-left">
              <div className="flex space-x-2 rtl:space-x-reverse">
                <Button color="gray" onClick={handleCreateClick}>
                  <HiPlusCircle className="mr-2 h-5 w-5" />
                  Add Book
                </Button>
                <Button
                  color="gray"
                  onClick={() => {
                    bookDetails();
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
                <Table.HeadCell>image</Table.HeadCell>
                <Table.HeadCell>name</Table.HeadCell>
                <Table.HeadCell>description</Table.HeadCell>
                <Table.HeadCell>author</Table.HeadCell>
                <Table.HeadCell>published by</Table.HeadCell>
                <Table.HeadCell>price</Table.HeadCell>
                <Table.HeadCell>liked by</Table.HeadCell>
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
                  : currentData.map((book, index) => (
                      <Table.Row
                        key={index}
                        className="bg-white dark:bg-gray-800"
                      >
                        <Table.Cell>{serialNumber + index}</Table.Cell>
                        <Table.Cell>
                          <img
                            src={
                              `http://localhost:8000/${book.imageUrl}` ??
                              "No image"
                            }
                            alt={book.name}
                            className="h-12 w-12 object-cover"
                          />
                        </Table.Cell>

                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white ">
                          {book.name ?? "N/A"}
                        </Table.Cell>
                        <Table.Cell className="truncate"> {truncateText(book?.description)}</Table.Cell>
                        <Table.Cell>{book.author ?? "N/A"}</Table.Cell>
                        <Table.Cell>{book?.published_by ?? "N/A"}</Table.Cell>
                        <Table.Cell>{book?.price ?? "N/A"}</Table.Cell>
                        <Table.Cell>{book?.likeCount ?? "N/A"}</Table.Cell>
                        <Table.Cell className="flex flex-wrap gap-2">
                          <Button
                            color="blue"
                            pill
                            onClick={() => handleEditClick(book)}
                            size={"sm"}
                          >
                            <FaEdit size={"sm"} className="mr-2 h-5 w-5" />
                            edit
                          </Button>
                          <Button
                            color="failure"
                            pill
                            onClick={() => handleDeleteClick(book._id)}
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

      {/* Delete book Modal */}
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
              Are you sure? You want to delete this book
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={deleteBook}>
                Yes I'm sure
              </Button>
              <Button color="gray" onClick={() => setDeleteModalOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Edit book Modal */}
      <Modal
        theme={modalTheme}
        position={"center"}
        show={editModalOpen}
        size="md"
        onClose={() => setEditModalOpen(false)}
        popup
      >
        <Modal.Header className="justify-center">Edit Book</Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <div className="flex flex-col gap-4">
              <div className="flex justify-center items-center mt-4">
                {bookToEdit?.imageUrl && (
                  <img
                    src={
                      typeof bookToEdit.image === "object"
                        ? URL.createObjectURL(bookToEdit.image)
                        : `http://localhost:8000/${bookToEdit.imageUrl}`
                    }
                    alt="Preview"
                    className="h-32 w-32 object-cover"
                  />
                )}
              </div>

              <div>
                <input
                  id="newImage"
                  type="file"
                 
                  accept="image/*"
                  onChange={(e) =>
                    setBookToEdit({
                      ...bookToEdit,
                      image: e.target.files[0],
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="newBook" value="name" />
                <TextInput
                  id="name"
                  type="text"
                  value={bookToEdit?.name || ""}
                  onChange={(e) =>
                    setBookToEdit({
                      ...bookToEdit,
                      name: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <Label htmlFor="newDescription" value="description" />
                <TextInput
                  id="description"
                  type="text"
                  value={bookToEdit?.description || ""}
                  onChange={(e) =>
                    setBookToEdit({
                      ...bookToEdit,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="newAuthor" value="author" />
                <TextInput
                  id="author"
                  type="text"
                  value={bookToEdit?.author || ""}
                  onChange={(e) =>
                    setBookToEdit({
                      ...bookToEdit,
                      author: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <Label htmlFor="newPublished_by" value="Published By" />
                <TextInput
                  id="published_by"
                  type="text"
                  value={bookToEdit?.published_by || ""}
                  onChange={(e) =>
                    setBookToEdit({
                      ...bookToEdit,
                      published_by: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <Label htmlFor="newPrice" value="price" />
                <TextInput
                  id="price"
                  type="number"
                  value={bookToEdit?.price || ""}
                  onChange={(e) =>
                    setBookToEdit({
                      ...bookToEdit,
                      price: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="flex justify-center gap-4 mt-4">
              <Button color="success" disabled={!isFormValidEdit()} onClick={editBook}>
                save
              </Button>
              <Button color="gray" onClick={() => setEditModalOpen(false)}>
                cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Create Book Modal */}
      <Modal
        theme={modalTheme}
        position={"center"}
        show={createModalOpen}
        size="md"
        onClose={() => setCreateModalOpen(false)}
        popup
      >
        <Modal.Header className="justify-center">Add Book</Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <div className="flex flex-col gap-4">
            <div>
               {/* Image preview */}
            {newBook.image && (
             <div className="flex justify-center items-center mt-4">
                <img
                  src={URL.createObjectURL(newBook.image)}
                  alt="Preview"
                  className="h-32 w-32 object-cover"
                />
              </div>
            )}
              <input
                id="newImage"
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setNewBook({
                    ...newBook,
                    image: e.target.files[0],
                  })
                }
              />
            </div>
           
              <div>
                <Label htmlFor="newBook" value="name" />
                <TextInput
                  id="newBook"
                  type="text"
                  value={newBook.name || ""}
                  onChange={(e) =>
                    setNewBook({
                      ...newBook,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="newDescription" value="description" />
                <TextInput
                  id="newDescription"
                  type="text"
                  value={newBook.description || ""}
                  onChange={(e) =>
                    setNewBook({
                      ...newBook,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="newAuthor" value="author" />
                <TextInput
                  id="newAuthor"
                  type="text"
                  value={newBook.author || ""}
                  onChange={(e) =>
                    setNewBook({
                      ...newBook,
                      author: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <Label htmlFor="newPublished_by" value="published_by" />
                <TextInput
                  id="newPublished_by"
                  type="text"
                  value={newBook.published_by || ""}
                  onChange={(e) =>
                    setNewBook({
                      ...newBook,
                      published_by: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <Label htmlFor="newPrice" value="price" />
                <TextInput
                  id="newPrice"
                  type="number"
                  value={newBook.price || ""}
                  onChange={(e) =>
                    setNewBook({
                      ...newBook,
                      price: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            

            <div className="flex justify-center gap-4 mt-4">
              <Button color="success" disabled={!isFormValidNew()} onClick={createBook}>
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

export default BookList;
