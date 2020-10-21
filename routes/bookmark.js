const express = require('express');

const bookmarkController = require('../controllers/bookmark')

const router = express.Router();

router.get('/', bookmarkController.getBookmarks)


module.exports = router;