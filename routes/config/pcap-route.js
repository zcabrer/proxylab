const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../../middleware/auth');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

let isCapturing = false;
const captureFilePath = path.join(__dirname, '../../captures/capture.pcap');

router.get('/', isAuthenticated, (req, res) => {
    res.render('config/pcap', { title: 'Proxy Lab | Config', pcapActive: true });
});

router.post('/start', isAuthenticated, (req, res) => {
    if (isCapturing) {
        return res.status(400).json({ status: 'error', message: 'Capture is already running.' });
    }

    // Ensure the existing capture file is overwritten
    exec(`tcpdump -i any -nvvv -w ${captureFilePath} -Z root`, (err, stdout, stderr) => {
        if (err) {
            console.error('Error starting tcpdump:', err.message);
            return res.status(500).json({ status: 'error', message: 'Failed to start capture.' });
        } else if (stderr) {
            console.error('tcpdump stderr:', stderr);
            return res.status(500).json({ status: 'error', message: 'Error occurred during capture initialization.' });
        }
        console.log('tcpdump started successfully:', stdout);
        isCapturing = true;
        res.json({ status: 'success', message: 'Packet capture started.' });
    });
});

router.post('/stop', isAuthenticated, (req, res) => {
    if (!isCapturing) {
        return res.status(400).json({ status: 'error', message: 'No capture is running.' });
    }

    exec('pkill tcpdump', (err) => {
        if (err) {
            return res.status(500).json({ status: 'error', message: 'Failed to stop capture.' });
        }
        isCapturing = false;
        setTimeout(() => {
            res.json({ status: 'success', message: 'Packet capture stopped. File is ready for download.' });
        }, 1000); // 1-second delay to ensure the file is written
    });

});

router.get('/download', isAuthenticated, (req, res) => {
    const filePath = path.join(__dirname, '../../captures/capture.pcap');
    res.download(filePath, 'capture.pcap', (err) => {
        if (err) {
            console.error('Error downloading the file:', err);
            res.status(500).json({ status: 'error', message: 'Failed to download the file.' });
        }
    });
});

module.exports = router;