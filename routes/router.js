const express = require('express');
const path = require('path');
const router = express.Router();

// Set faviconBasePath for all routes based on the current path
router.use((req, res, next) => {
    // Use originalUrl to get the full path, strip query/hash, and trailing slash
    let basePath = req.originalUrl.split('?')[0].split('#')[0];
    if (basePath.endsWith('/')) basePath = basePath.slice(0, -1);
    // Remove /favicon and anything after it if present
    basePath = basePath.replace(/\/favicon.*/, '');
    // If root, fallback to /favicon
    res.locals.faviconBasePath = basePath ? `${basePath}/favicon` : '/favicon';
    next();
});

// Serve /tools/*.js from public/js
router.get('/tools/:jsfile.js', (req, res, next) => {
    const fs = require('fs');
    const jsFile = req.params.jsfile;
    const filePath = path.join(__dirname, '../public/js', `${jsFile}.js`);
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) return next();
        res.sendFile(filePath, err => {
            if (err) {
                console.error(`Error sending ${jsFile}.js:`, err);
                res.status(500).send(`Error sending ${jsFile}.js`);
            }
        });
    });
});

// Serve /admincenter/*.js from public/js
router.get('/admincenter/:jsfile.js', (req, res, next) => {
    const fs = require('fs');
    const jsFile = req.params.jsfile;
    const filePath = path.join(__dirname, '../public/js', `${jsFile}.js`);
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) return next();
        res.sendFile(filePath, err => {
            if (err) {
                console.error(`Error sending ${jsFile}.js:`, err);
                res.status(500).send(`Error sending ${jsFile}.js`);
            }
        });
    });
});

// Import route handlers
const home = require('./home-route');
const tools = require('./tools/tools-route');
const admincenter = require('./admincenter/admincenter-route');
const docs = require('./docs-route');
const login = require('./login-route');
const logout = require('./logout-route');

// Use route handlers
router.use('/', home);
router.use('/tools', tools);
router.use('/admincenter', admincenter);
router.use('/docs', docs);
router.use('/login', login);
router.use('/logout', logout);

module.exports = router;