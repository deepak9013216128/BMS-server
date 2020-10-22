const express = require('express');
const { body } = require('express-validator')

const bookmarkController = require('../controllers/bookmark');
const Bookmark = require('../models/bookmark');
const Category = require('../models/category');

const router = express.Router();

router.get('/', bookmarkController.getBookmarks)

router.get('/:bookmarkId', bookmarkController.getBookmark)

router.post('/', [
  body('title')
    .isString()
    .trim()
    .isLength({ min: 3 })
    .withMessage('Title must be minimum of 3 charcater')
    .custom((value, { req }) => {
      return Bookmark.findOne({ title: value })
        .then(bookmark => {
          if (bookmark) {
            return Promise.reject('Bookmark already exists.')
          }
          return true;
        })
    }),
  body('url')
    .isURL()
    .withMessage('invalid url.'),
  body('tags')
    .isArray({ min: 1 })
    .withMessage('minimim one tag is required!'),
], bookmarkController.createBookmark);

router.delete('/:bookmarkId', bookmarkController.deleteBookmark)


module.exports = router;