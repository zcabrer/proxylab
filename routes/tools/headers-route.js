const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    let reqHeaders = req.headers;

    // Check if there are query parameters
    const headers = req.query;
    if (Object.keys(headers).length > 0) {
        for (const [key, value] of Object.entries(headers)) {
            if (key.startsWith('response_')) {
                const headerName = key.replace('response_', '');
                res.setHeader(headerName, value);
            } else if (key.startsWith('request_')) {
                const headerName = key.replace('request_', '');
                reqHeaders[headerName] = value;
            }
        }
    }

    let respHeaders = res.getHeaders();

    try {
        res.status(200); // Set the status code to 200 (OK)
        res.render('tools/headers', { 
            title: 'Proxy Lab | Tools', 
            reqHeaders: reqHeaders, 
            respHeaders: respHeaders,
            method: req.method,
            url: req.protocol + "://" + reqHeaders.host + req.originalUrl,
            remoteAddress: res.req._remoteAddress,
            status: res.statusCode,
            headerActive: true,
            query: req.query // Pass query parameters to the template
        });
    } catch (error) {
        console.error('Error rendering the response:', error);
        res.status(500).send('Internal Server Error'); // Set the status code to 500 (Internal Server Error)
    }
    
});

module.exports = router;