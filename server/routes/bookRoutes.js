const express = require('express');
const router = express.Router();

const bookController = require('../controller/bookController');
const isAuthenticated = require('../middleware/middleware');
const upload = require('../middleware/multerConfig');

router.post('/', isAuthenticated, bookController.bookList);
router.post('/create', isAuthenticated,upload.single('image'), bookController.addBook);
router.put('/update/:id', isAuthenticated,upload.single('image'), bookController.editBook);
router.post('/delete/:id',isAuthenticated,  bookController.deleteBook);
router.delete('/:id', isAuthenticated, bookController.deleteBook);
router.post('/:bookId/like', isAuthenticated, bookController.likeBook);
router.post('/:bookId/unlike', isAuthenticated, bookController.unLikeBook);


module.exports = router;
