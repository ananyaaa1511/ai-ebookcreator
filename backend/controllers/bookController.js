const Book = require("../models/Book");
const fs = require("fs");
const path = require("path"); // Added path import

// @desc    Create a new book
// @route   POST /api/books
const createBook = async (req, res) => {
    try {
        const { title, author, subtitle, chapters } = req.body;
        if (!title || !author) {
            return res.status(400).json({ message: "Please provide a title and author" });
        }

        const coverImage = req.body.coverImage ? req.body.coverImage : "";

        const book = await Book.create({
            userId: req.user._id,
            title,
            author,
            subtitle,
            chapters,
            coverImage
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

// @desc    Get a single book by ID (With Base64 Cover Image embedded)
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

        // --- IMAGE PROCESSING LOGIC ---
        let base64Image = null;

        if (book.coverImage) {
            // __dirname is current folder (controllers). '..' goes up to root, then we point to the image path.
            const imagePath = path.join(__dirname, "..", book.coverImage);

            console.log("Looking for file at:", imagePath);

            if (fs.existsSync(imagePath)) {
                const imageBuffer = fs.readFileSync(imagePath);
                base64Image = `data:image/png;base64,${imageBuffer.toString('base64')}`;
                console.log("File found and converted successfully!");
            } else {
                console.warn("Could not find image file at path:", imagePath);
            }
        }

        // Convert mongoose document to a plain object so we can append the base64 string safely
        const bookData = book.toObject();
        bookData.coverImageBase64 = base64Image;

        // Return the modified book object containing the base64 data
        res.status(200).json(bookData);

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

        // Fixed image unlinking path structure to match your project root
        if (book.coverImage) {
            const imagePath = path.join(__dirname, "..", book.coverImage);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await book.deleteOne();
        res.status(200).json({ message: "Book successfully deleted" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Update or upload book cover image
// @route   PUT /api/books/:id/cover
const updateBookCover = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        if (book.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Not authorized to update this book" });
        }

        if (req.file) {
            const rawPath = req.file.path.replace(/\\/g, "/");
            book.coverImage = rawPath.includes("uploads/")
                ? rawPath.substring(rawPath.indexOf("uploads/"))
                : `uploads/${req.file.filename}`;
        } else {
            return res.status(400).json({ message: "No image file provided" });
        }

        const updatedBook = await book.save();
        res.status(200).json(updatedBook);
    } catch (error) {
        console.error("Cover Upload Error:", error);
        res.status(500).json({ message: "Server error updating cover image" });
    }
};

module.exports = {
    createBook,
    getBooks,
    getBookById,
    updateBook,
    deleteBook,
    updateBookCover,
};