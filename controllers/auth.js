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
      res.status(200).json({ token: token, userId: loadedUser._id })
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