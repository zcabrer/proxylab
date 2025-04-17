const express = require('express');
const router = express.Router();

// Tools catalogue
router.get('/', (req, res) => {
    res.render('tools/tools', { title: 'Proxy Lab | Tools'});
});

// Import tool route handlers
const headers = require('./headers-route');
const post = require('./post-route');
const files = require('./files-route');
const timeout = require('./timeout-route');
const querystring = require('./querystring-route');
const httpstatus = require('./httpstatus-route');

// Use tool route handlers
router.use('/headers', headers);
router.use('/post', post);
router.use('/files', files);
router.use('/timeout', timeout);
router.use('/querystring', querystring);
router.use('/httpstatus', httpstatus);

module.exports = router;