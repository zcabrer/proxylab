const express = require('express');
const path = require('path');
const router = express.Router();

router.get('/', (req, res) => {
    const queryString = req.originalUrl.split('?')[1] || '';
    const status = res.statusCode;
    res.render('tools/querystring', { 
        title: 'Proxy Lab | Tools', 
        querystringActive: true, 
        queryString,
        status
    });
});

module.exports = router;