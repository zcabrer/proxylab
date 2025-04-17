const express = require('express');
const path = require('path');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('tools/timeout', { title: 'Proxy Lab | Tools', timeoutActive: true });
});

router.get('/submit', (req, res) => {
    const seconds = parseInt(req.query.seconds, 10);
    if (isNaN(seconds) || seconds < 1 || seconds > 86400) {
        return res.status(400).send('Invalid seconds parameter');
    }

    setTimeout(() => {
        res.sendFile(path.join(__dirname, '../../public/images/timeout.jpeg'));
    }, seconds * 1000);
});

module.exports = router;