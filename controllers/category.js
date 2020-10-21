const { validationResult } = require('express-validator');

const Category = require('../models/category');
const Tab = require('../models/tab');
const User = require('../models/user');

exports.getCategories = (req, res, next) => {
  Category.find()
    .then(categories => {
      return res.status(200).json({
        message: 'Fetch category successfully',
        categories: categories
      })
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      next(err)
    })
}

exports.getCategory = (req, res, next) => {
  const { categoryId } = req.params;
  Category.findById(categoryId)
    .then(category => {
      if (!category) {
        const error = new Error('Could not find category');
        error.statusCode = 404;
        throw error;
      }
      return res.status(200).json({
        message: 'Fetch category successfully',
        category: category
      })
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      next(err)
    })
}

exports.createCategory = (req, res, next) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error(errors.array()[0].msg)
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const { title } = req.body;
  const category = new Category({
    title: title
  })
  category.save()
    .then(() => {
      return Tab.findById(req.body._id)
    })
    .then(tab => {
      if (!tab) {
        const error = new Error('invalid tab id.');
        error.statusCode = 404;
        throw error;
      }
      tab.categories.push(category);
      return tab.save();
    })
    .then(result => {
      return res.status(201).json({
        message: 'category created successfully!',
        category: category,
      })
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      next(err)
    })
}

