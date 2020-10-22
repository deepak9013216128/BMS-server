const express = require('express');
const { body } = require('express-validator');

const categoryController = require('../controllers/category');
const Category = require('../models/category');
const Tab = require('../models/tab');

const router = express.Router();

router.get('/', categoryController.getCategories)

router.get('/:categoryId', categoryController.getCategory)

router.post('/', [
  body('title')
    .isString()
    .trim()
    .isLength({ min: 3 })
    .withMessage('Title must be minimum of 3 charcater')
    .custom((value, { req }) => {
      return Category.findOne({ title: value })
        .then(category => {
          if (category) {
            return Promise.reject('Category already exists.')
          }
          return true;
        })
    }),
], categoryController.createCategory);

router.delete('/:categoryId', categoryController.deleteCategory)


module.exports = router;