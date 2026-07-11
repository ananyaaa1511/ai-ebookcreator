const Book = require("../models/Book");

// @desc    Create a new book
// @route   POST /api/books
const createBook = async (req, res) => {
    try {
        const { title, author, subtitle, chapters, description } = req.body;
        if (!title || !author || !description) {
            return res.status(400).json({ message: "Please provide a title, author, and description" });
        }

        const book = await Book.create({
            userId: req.user._id,
            title,
            author,
            subtitle,
            description,
            chapters
        });
        res.status(201).json(book);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// @desc    Get all books for logged-in user
// @route   GET /api/books
const getBooks = async (req, res) => {
    try {
        const books = await Book.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(books);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Get a single book by ID
// @route   GET /api/books/:id
const getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        if (book.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Not authorized to view this book" });
        }

        res.status(200).json(book);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Update book details (text fields only)
// @route   PUT /api/books/:id
const updateBook = async (req, res) => {
    try {
        let book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        if (book.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Not authorized to update this book" });
        }

        const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
            returnDocument: 'after',
        });

        res.status(200).json(updatedBook);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// @desc    Delete a book
// @route   DELETE /api/books/:id
const deleteBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        if (book.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Not authorized to delete this book" });
        }

        await book.deleteOne();
        res.status(200).json({ message: "Book successfully deleted" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    createBook,
    getBooks,
    getBookById,
    updateBook,
    deleteBook,
};