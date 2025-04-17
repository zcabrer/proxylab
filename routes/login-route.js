const { error } = require('console');
const express = require('express');
const router = express.Router();
const path = require('path');
require('dotenv').config();
const { body } = require('express-validator');

// Read in username and password from environment variables
const USER = process.env.USER;
const PASSWORD = process.env.PASSWORD;

// Login route
router.get('/', (req, res) => {
  res.render('login', { title: 'Login', error: null });
});

router.post('/', [
  body('username').trim().escape(),
  body('password').trim().escape(),
], (req, res) => {
  const { username, password } = req.body;
  if (username === USER && password === PASSWORD) {
    req.session.isAuthenticated = true;
    res.redirect('/config');
  } else {
    res.render('login', { title: 'Login', error: 'Invalid username or password' });
  }
});

module.exports = router;