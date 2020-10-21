const { validationResult } = require('express-validator');

const Tab = require('../models/tab');
const User = require('../models/user');

exports.getTabs = (req, res, next) => {

  Tab.find()
    .then(tabs => {
      res.status(200).json({
        message: 'Fetch tabs successfully',
        tabs: tabs
      })
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      next(err)
    })
}

exports.getTab = (req, res, next) => {
  const { tabId } = req.params;
  Tab.findById(tabId)
    .then(tab => {
      if (!tab) {
        const error = new Error('Could not find tab');
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({
        message: 'Fetch tab successfully',
        tab: tab
      })
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      next(err)
    })
}

exports.createTab = (req, res, next) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error(errors.array()[0].msg)
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const { title } = req.body;
  const tab = new Tab({
    title: title
  })
  tab.save()
    // .then(() => {
    //   return User.findById(req.userId)
    // })
    // .then(user => {
    //   creator = user;
    //   user.tabs.push(tab);
    //   return user.save();
    // })
    .then(result => {
      return res.status(201).json({
        message: 'tab created successfully!',
        tab: tab,
      })
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      next(err)
    })
}