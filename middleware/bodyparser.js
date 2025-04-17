const express = require('express');
const bodyParser = require('body-parser');

module.exports = (app) => {
  // Middleware to parse JSON
  app.use(express.json());

  // Middleware to parse URL-encoded data
  app.use(express.urlencoded({ extended: true }));

  // Middleware to parse text/plain
  app.use(bodyParser.text({ type: 'text/plain' }));

  // Middleware to parse application/xml
  app.use(bodyParser.text({ type: 'application/xml' }));

  // Middleware to parse text/csv
  app.use(bodyParser.text({ type: 'text/csv' }));

  // Middleware to parse text/javascript
  app.use(bodyParser.text({ type: 'text/javascript' }));

  // Middleware to parse text/html
  app.use(bodyParser.text({ type: 'text/html' }));

  // Middleware to parse text/css
  app.use(bodyParser.text({ type: 'text/css' }));

  // Middleware to parse image/png, image/jpeg, image/gif
  app.use(bodyParser.raw({ type: ['image/png', 'image/jpeg', 'image/gif'] }));

  // Middleware to parse video/mp4, video/mpeg
  app.use(bodyParser.raw({ type: ['video/mp4', 'video/mpeg'] }));

  // Middleware to parse application/pdf
  app.use(bodyParser.raw({ type: 'application/pdf' }));

  // Middleware to parse application/xhtml+xml
  app.use(bodyParser.text({ type: 'application/xhtml+xml' }));

  // Middleware to parse multipart/mixed
  app.use(bodyParser.raw({ type: 'multipart/mixed' }));
};