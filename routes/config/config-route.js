const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../../middleware/auth');

// Tools catalogue
router.get('/', isAuthenticated, (req, res) => {
    res.render('config/config', { title: 'Proxy Lab | Config'});
});

// Import tool route handlers
const tls = require('./tls-route');
const pcap = require('./pcap-route');
const log = require('./log-route');

// Use tool route handlers
router.use('/tls', tls);
router.use('/pcap', pcap);
router.use('/log', log);

module.exports = router;