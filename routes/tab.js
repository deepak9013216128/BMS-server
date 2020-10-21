const express = require('express');

const tabController = require('../controllers/tab');

const router = express.Router();

router.get('/', tabController.getTabs)


module.exports = router;