const express = require('express');
const router = express.Router();

// Import route handlers
const home = require('./home-route');
const tools = require('./tools/tools-route');
const admincenter = require('./admincenter/admincenter-route');
const login = require('./login-route');
const logout = require('./logout-route');

// Use route handlers
router.use('/', home);
router.use('/tools', tools);
router.use('/admincenter', admincenter);
router.use('/login', login);
router.use('/logout', logout);

module.exports = router;