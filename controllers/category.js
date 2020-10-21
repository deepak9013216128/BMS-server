const { validationResult } = require('express-validator');
const category = require('../models/category');

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

exports.createCategory = (req, res, next) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error(errors.array()[0].msg)
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const { title } = req.body;
  let loadedTab;
  const category = new Category({
    title: title
  })
  category.save()
    .then(() => {
      return Tab.findById(req.body._id)
    })
    .then(tab => {
      loadedTab = tab;
      tab.categories.push(category);
      return tab.save();
    })
    .then(result => {
      return res.status(201).json({
        message: 'category created successfully!',
        category: category,
        // creater: { _id: creator._id, name: creator.name }
      })
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      next(err)
    })
}

