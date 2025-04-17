const express = require('express');
const bodyparser = require('../../middleware/bodyparser');
const multer = require('multer');
const router = express.Router();

// Initialize Multer with memory storage
const upload = multer({ storage: multer.memoryStorage() });
// const upload = multer({ dest: 'file/' });

router.get('/', (req, res) => {
    res.render('tools/post', { title: 'Proxy Lab | Tools', postActive: true });
});
router.post('/', upload.any(), (req, res) => {
    // Extract the content type and body content from the request
    const contentType = req.headers['content-type'];
    const bodyContent = req.body;

    // Extract the content-length header
    const contentLength = req.headers['content-length'];

    // Respond with the received data and additional information
    res.status(200).json({
        message: 'POST request received successfully',
        contentType: contentType,
        contentLength: contentLength,
        bodyContent: bodyContent
    });
});


module.exports = router;