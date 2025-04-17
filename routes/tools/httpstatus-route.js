const express = require('express');
const path = require('path');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('tools/httpstatus', { title: 'Proxy Lab | Tools', httpstatusActive: true });
});

// Handle POST request to generate HTTP status code
router.post('/', (req, res) => {
    const statusCode = parseInt(req.body.statusCode, 10);

    if (isNaN(statusCode) || statusCode < 100 || statusCode > 599) {
        return res.status(400).send('Invalid HTTP status code.');
    }

    res.status(statusCode).send(`Response with HTTP status code: ${statusCode}`);
});

// Handle GET request to generate HTTP status code
router.get('/generate', (req, res) => {
    const statusCode = parseInt(req.query.statusCode, 10);

    if (isNaN(statusCode) || statusCode < 100 || statusCode > 599) {
        return res.status(400).send('Invalid HTTP status code.');
    }

    res.status(statusCode).send(`Response with HTTP status code: ${statusCode}`);
});

module.exports = router;