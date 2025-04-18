const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../../middleware/auth');
const { exec } = require('child_process');
const path = require('path');
const { spawn } = require('child_process');


router.get('/', isAuthenticated, (req, res) => {
    res.render('config/pcap', { title: 'Proxy Lab | Config', pcapActive: true });
});


let tcpdumpProcess = null;
let isCapturing = false;
const captureFilePath = path.join(__dirname, '../../captures/capture.pcap');

router.post('/start', isAuthenticated, (req, res) => {
    if (isCapturing) {
        return res.status(400).json({ status: 'error', message: 'Capture is already running.' });
    }

    console.log('Starting tcpdump...');
    tcpdumpProcess = spawn('tcpdump', ['-i', 'any', '-nvvv', '-w', captureFilePath, '-Z', 'root']);

    tcpdumpProcess.stdout.on('data', (data) => {
        console.log(`tcpdump stdout: ${data}`);
    });

    tcpdumpProcess.stderr.on('data', (data) => {
        console.error(`tcpdump stderr: ${data}`);
    });

    tcpdumpProcess.on('error', (err) => {
        console.error('Error starting tcpdump:', err.message);
        return res.status(500).json({ status: 'error', message: 'Failed to start capture.' });
    });

    tcpdumpProcess.on('close', (code) => {
        console.log(`tcpdump process exited with code ${code}`);
        if (code !== 0) {
            isCapturing = false;
        }
    });

    isCapturing = true;
    res.json({ status: 'success', message: 'Packet capture started.' });
});

router.post('/stop', isAuthenticated, (req, res) => {
    if (!isCapturing || !tcpdumpProcess) {
        return res.status(400).json({ status: 'error', message: 'No capture is running.' });
    }

    console.log('Stopping tcpdump...');
    tcpdumpProcess.kill('SIGINT'); // Gracefully stop the process
    tcpdumpProcess = null;
    isCapturing = false;

    setTimeout(() => {
        res.json({ status: 'success', message: 'Packet capture stopped. File is ready for download.' });
    }, 1000); // 1-second delay to ensure the file is written
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