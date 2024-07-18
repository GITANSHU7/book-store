const express = require('express');
const router = express.Router();

const bookController = require('../controller/bookController');
const isAuthenticated = require('../middleware/middleware');

router.post('/', isAuthenticated, bookController.bookList);
router.post('/create', isAuthenticated, bookController.addBook);
router.put('/update/:id', isAuthenticated, bookController.editBook);
router.post('/delete/:id',isAuthenticated,  bookController.deleteBook);
router.delete('/:id', isAuthenticated, bookController.deleteBook);

module.exports = router;
