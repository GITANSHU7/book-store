const Book = require('../models/bookModels');

//add book 
exports.addBook = async (req, res) => {
    try {
        const { name, description, author, published_by, rating, price } = req.body;

        if (!name || !description || !author || !published_by || !rating || !price) {
            return res.status(400).json({ error: "All fields are required" });
        }
        if(rating > 5){
            return res.status(400).json({ error: "Rating should be less than or equal to 5" });
        }
        const book = new Book({
            name,
            description,
            author,
            published_by,
            rating,
            price
        });
        await book.save();
        res.json({ message: 'Book added successfully', data: book });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ err: err.message });
    }
}

// book listing
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
                .sort({ createdAt: -1 })
                .skip(startIndex)
                .limit(perPageRecordInt);
        } else {
            books = await Book.find().sort({ createdAt: -1 });
            total = books.length;
        }

        return res.json({
            message: "Book list retrieved successfully",
            data: books,
            total: total,
            success: true,
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }

}

// edit book by id
exports.editBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        // req body
        const { name, description, author, published_by, rating, price } = req.body;
        if (!book) {
            return res.status(404).json({ error: "Book not found" });
        }
        // update book only if different from existing
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
        if (rating && rating !== book.rating) {
            book.rating = rating;
            isUpdated = true;
        }
        if (price && price !== book.price) {
            book.price = price;
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