import React, { useEffect, useState } from "react";
import { Button, Card, Pagination } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { HiAdjustments, HiCloudDownload, HiUserCircle } from "react-icons/hi";
import { FaThumbsDown } from "react-icons/fa";
import { FaThumbsUp } from "react-icons/fa6";
import toast from "react-hot-toast";
const truncateText = (text, limit = 40) => {
  if (text.length > limit) {
    return text.substring(0, limit) + "...";
  }
  return text;
};

const Dashboard = () => {
  const [books, setBooks] = useState([]);
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);
  const apiToken = user?.data?.token;
  const [searchQuery, setSearchQuery] = useState("");

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
      setBooks(response?.data?.data);
    } catch (error) {
      console.error(error.message || "Error fetching book details");
      throw error;
    }
  };

  // api for like book

  const likeTheBook = async (bookId) => {
    try {
      if (!apiToken) {
        throw new Error("Missing authorization token");
      }

      const response = await axios.post(
        `http://localhost:8000/book/${bookId}/like`,
        null,
        {
          headers: {
            Authorization: `Bearer ${apiToken}`,
          },
        }
      );
      toast.success("Liked 💓💓💓");
      bookDetails();
    } catch (error) {
      console.error(error.message || "Error fetching book details");
      throw error;
    }
  };
  const unlikeTheBook = async (bookId) => {
    try {
      if (!apiToken) {
        throw new Error("Missing authorization token");
      }

      const response = await axios.post(
        `http://localhost:8000/book/${bookId}/unlike`,
        null,
        {
          headers: {
            Authorization: `Bearer ${apiToken}`,
          },
        }
      );
      toast.success("Unliked 💔💔💔");
      bookDetails();
    } catch (error) {
      console.error(error.message || "Error fetching book details");
      throw error;
    }
  };

  useEffect(() => {
    bookDetails();
  }, []);

  // Get current data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const filteredData = Array.isArray(books)
    ? books.filter(
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

  // disable the like button if the user has already liked the book
  const isLiked = (book) => {
    const likeIds = book?.likes?.map((like) => like?._id);
    console.log(likeIds, "Likes array");
    return likeIds?.includes(user?.data?.user?._id);
  };
  const isUnliked = (book) => {
    const unlikeIds = book?.unlikes?.map((unlike) => unlike?._id);
    return unlikeIds?.includes(user?.data?.user?._id);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {currentData.length > 0 ? (
          currentData?.map((book, index) => (
            <Card
              key={book.index}
              className="max-w-sm"
              imgSrc={`http://localhost:8000/${book.imageUrl}`}
              horizontal
            >
              <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {book?.name}
              </h5>
              <p className="font-normal text-gray-700 dark:text-gray-400">
                {truncateText(book?.description)}
              </p>
              <p className="font-normal text-gray-700 dark:text-gray-400">
                Author: {book?.author}
              </p>
              <p className="font-normal text-gray-700 dark:text-gray-400">
                Published By: {book?.published_by}
              </p>
              <p className="font-normal text-gray-700 dark:text-gray-400">
                Price: ₹{book?.price}
              </p>
              <div className="flex flex-wrap gap-2">
                <p className="font-normal text-gray-700 dark:text-gray-400">
                  💓{book?.likeCount}
                </p>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                  💔{book?.unlikeCount}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button.Group outline>
                  <Button
                    color="gray"
                    onClick={() => likeTheBook(book?._id)}
                    disabled={isLiked(book)}
                  >
                    <FaThumbsUp className="h-4 w-4 text-red-600" />
                  </Button>
                  <Button
                    color="gray"
                    onClick={() => unlikeTheBook(book?._id)}
                    disabled={isUnliked(book)}
                  >
                    <FaThumbsDown className="h-4 w-4 text-red-600" />
                  </Button>
                </Button.Group>
              </div>
            </Card>
          ))
        ) : (
          <div className="flex justify-center items-center h-screen text-5xl">
            Hey {user?.data?.user?.name}, Currently No Book is available Here!
          </div>
        )}
      </div>

      {currentData.length > 0 ? (
        <div className="flex justify-center mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={paginate}
          />
        </div>
      ) : null}
    </>
  );
};

export default Dashboard;
