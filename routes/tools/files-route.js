const express = require('express');
const bodyparser = require('../../middleware/bodyparser');
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // Add this to handle file existence checks
const router = express.Router();

// Initialize Multer with memory storage
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', (req, res) => {
  res.render('tools/files', { title: 'Proxy Lab | Tools', filesActive: true });
});

// Handle file uploads
router.post('/', upload.array('files', 5), (req, res) => {
  let fileSizeB = 0;
  req.files.forEach(file => {
    fileSizeB += file.size;
  });

  const fileSizeKB = fileSizeB / 1024;
  const fileSizeMB = fileSizeKB / 1024;

  res.status(200).json({
    message: 'Files uploaded successfully',
    fileSizeB: fileSizeB,
    fileSizeKB: fileSizeKB,
    fileSizeMB: fileSizeMB
  });
});

// Serve download files
router.get('/downloads/:size', (req, res) => {
  const fileSize = req.params.size;
  const filePath = path.join(__dirname, '../../public/downloads', `${fileSize}.txt`);

  res.download(filePath, `${fileSize}.txt`, (err) => {
    if (err) {
      console.error('Error downloading the file:', err);
      res.status(500).send('Error downloading the file');
    }
  });
});

// Serve files.js
router.get('/files.js', (req, res) => {
  const filePath = path.join(__dirname, '../../public/js/files.js');
  res.sendFile(filePath, err => {
    if (err) {
      console.error('Error sending files.js:', err);
      res.status(500).send('Error sending files.js');
    }
  });
});

module.exports = router;