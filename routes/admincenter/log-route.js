const express = require('express');
const router = express.Router();
const expressWs = require('express-ws'); // Import express-ws
const { isAuthenticated } = require('../../middleware/auth');
const path = require('path');
const { logStream } = require('../../utils/logStream'); // Import the log stream utility

// Initialize express-ws
expressWs(router);

router.get('/', isAuthenticated, (req, res) => {
    res.render('admincenter/log', { title: 'Proxy Lab | Admin Center', logActive: true });
});

// WebSocket endpoint for streaming logs
router.ws('/stream', (ws, req) => {
    logStream.on('data', (log) => {
        if (ws.readyState === ws.OPEN) {
            ws.send(log);
        }
    });

    ws.on('close', () => {
        logStream.removeAllListeners('data');
    });
});

module.exports = router;