const express = require('express');
const { body } = require('express-validator')

const tabController = require('../controllers/tab');
const Tab = require('../models/tab');

const router = express.Router();

router.get('/', tabController.getTabs)

router.post('/', [
  body('title')
    .isString()
    .trim()
    .isLength({ min: 3 })
    .withMessage('Title must be minimum of 3 charcater')
    .custom((value, { req }) => {
      return Tab.findOne({ title: value })
        .then(tab => {
          if (tab) {
            return Promise.reject('Tab already exists.')
          }
          return true;
        })
    })
], tabController.createTab)


module.exports = router;