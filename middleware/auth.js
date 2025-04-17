const express = require('express');
const session = require('express-session');

// Set up session middleware
const sessionMiddleware = session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
});

// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
  if (req.session.isAuthenticated) {
    return next();
  } else {
    res.redirect('/login');
  }
}

module.exports = {
  sessionMiddleware,
  isAuthenticated
};