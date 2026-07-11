const express = require("express");
const router = express.Router();
const {
    createBook,
    getBooks,
    getBookById,
    updateBook,
    deleteBook,
} = require("../controllers/bookController");
const { protect } = require("../middlewares/authMiddleware");

router.use(protect);

router.route("/").post(createBook).get(getBooks);
router.route("/:id").get(getBookById).put(updateBook).delete(deleteBook);

module.exports = router;