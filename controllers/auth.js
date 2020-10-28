const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Tab = require('../models/tab');
const Bookmark = require('../models/bookmark');
const Category = require('../models/category');
const User = require('../models/user');

exports.signup = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.')
    error.statusCode = 422;
    error.data = errors.array()
    throw error;
  }

  const { email, name, password } = req.body;

  return bcrypt.hash(password, 12)
    .then(hashedPassword => {
      const user = new User({ name, email, password: hashedPassword })
      return user.save();
    })
    .then(result => {
      return res.status(201).json({ message: 'User created!', userId: result._id })
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      next(err)
    })
}

exports.login = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.')
    error.statusCode = 422;
    error.data = errors.array()
    throw error;
  }

  const { email, password } = req.body;
  let loadedUser;
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        const error = new Error('A user with this email is not Found!')
        error.statusCode = 401;
        throw error;
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then(isEqual => {
      if (!isEqual) {
        const error = new Error('Wrong email address and password!')
        error.statusCode = 401;
        throw error;
      }
      const token = jwt.sign(
        {
          email: loadedUser.email,
          userId: loadedUser._id.toString()
        },
        'my secret key is deepak',
        { expiresIn: '1h' }
      )
      res.status(200).json({ token: token, userId: loadedUser._id, isAdmin: loadedUser.isAdmin })
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      next(err)
    })
}

exports.changePassword = (req, res, next) => {
  res.send(200).json({ message: 'change password' })
}

exports.getUsers = (req, res, next) => {

  User.findById(req.userId)
    .then(user => {
      console.log(user)
      if (!user) {
        const error = new Error('User not Found!')
        error.statusCode = 404;
        throw error;
      }
      if (!user.isAdmin) {
        const error = new Error('Not authorized!')
        error.statusCode = 403;
        throw error;
      }
      return User.find({ _id: { $ne: user._id } })
        .then(users => users.map(u => ({
          isAdmin: u.isAdmin,
          tabs: u.tabs,
          _id: u._id,
          name: u.name,
          email: u.email
        })))
    })
    .then(users => {
      return res.status(200).json({ users: users, message: 'User fetch successfully' })
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      next(err)
    })
}