const Book = require('../models/bookModels');

//add book 
// exports.addBook = async (req, res) => {
//     try {
//         const { name, description, author, published_by, price } = req.body;

//         if (!name || !description || !author || !published_by  || !price) {
//             return res.status(400).json({ error: "All fields are required" });
//         }
        

//         const book = new Book({
//             name,
//             description,
//             author,
//             published_by,
//             price
//         });
//         await book.save();
//         res.json({ message: 'Book added successfully', data: book });
//     } catch (err) {
//         console.log(err);
//         return res.status(500).json({ err: err.message });
//     }
// }
exports.addBook = async (req, res) => {
    try {
        const { name, description, author, published_by, price } = req.body;

        if (!name || !description || !author || !published_by || !price || !req.file) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const imageUrl = req.file.path;

        const book = new Book({
            name,
            description,
            author,
            published_by,
            price,
            imageUrl
        });

        await book.save();
        res.json({ message: 'Book added successfully', data: book });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ err: err.message });
    }
}

exports.bookList = async (req, res) => {
    try {
        const page = parseInt(req.query.page);
        const per_page_record = parseInt(req.query.per_page_record);

        let books;
        let total;

        if (page && per_page_record) {
            const pageInt = parseInt(page);
            const perPageRecordInt = parseInt(per_page_record);
            const startIndex = (pageInt - 1) * perPageRecordInt;
            total = await Book.countDocuments();
            books = await Book.find()
                .populate('likes')
                .populate('unlikes')
                .sort({ createdAt: -1 })
                .skip(startIndex)
                .limit(perPageRecordInt);
        } else {
            books = await Book.find().populate('likes').populate('unlikes').sort({ createdAt: -1 });
            total = books.length;
        }

        const booksWithCounts = books.map(book => ({
            ...book._doc,
            likeCount: book.likes.length,
            unlikeCount: book.unlikes.length,
          }));

        return res.json({
            message: "Book list retrieved successfully",
            data: booksWithCounts,
            total: total,
            success: true,
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}




exports.editBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ error: "Book not found" });
        }

        // req body
        const { name, description, author, published_by, price } = req.body;
        const image = req.file ? req.file.path : null;

        // Update book fields only if different from existing
        let isUpdated = false;
        if (name && name !== book.name) {
            book.name = name;
            isUpdated = true;
        }
        if (description && description !== book.description) {
            book.description = description;
            isUpdated = true;
        }
        if (author && author !== book.author) {
            book.author = author;
            isUpdated = true;
        }
        if (published_by && published_by !== book.published_by) {
            book.published_by = published_by;
            isUpdated = true;
        }
        if (price && price !== book.price) {
            book.price = price;
            isUpdated = true;
        }
        if (image) {
            book.imageUrl = image;
            isUpdated = true;
        }

        if (isUpdated) {
            const saveBooks = await book.save();
            return res.json({
                message: "Book updated successfully",
                success: true,
                data: saveBooks,
            });
        } else {
            return res.json({
                message: "No changes detected",
                success: true,
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
}

// delete book by id
exports.deleteBook = async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) {
            return res.status(404).json({ error: "Book not found" });
        }
        return res.json({ message: "Book deleted successfully" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

// get book by id

exports.getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ error: "Book not found" });
        }
        
        return res.json({ message: "Book retrieved successfully", data: book });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

// liked book
exports.likeBook = async (req, res) => {
    try {
        const bookId = req.params.bookId;
        const userId = req.user._id; 

        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Check if the user has already liked the book
        if (book.likes.includes(userId)) {
            return res.status(400).json({ message: 'You have already liked this book' });
        }

        book.likes.push(userId);
        await book.save();

        res.status(200).json({ message: 'Yayy! You got the create choice', likesCount: book.likes.length });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

// unlike book
exports.unLikeBook = async (req, res) => {
    try {
        const bookId = req.params.bookId;
        const userId = req.user._id; 

        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Check if the user has already liked the book
        if (book.unlikes.includes(userId)) {
            return res.status(400).json({ message: 'You have already un-liked this book' });
        }

        book.unlikes.push(userId);
        await book.save();

        res.status(200).json({ message: 'Yayy! You got the create choice', unlikesCount: book.unlikes.length });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

  