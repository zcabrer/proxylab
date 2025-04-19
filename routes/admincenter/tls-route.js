const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { isAuthenticated } = require('../../middleware/auth');

router.get('/', isAuthenticated, (req, res) => {
  res.render('admincenter/tls', { title: 'Proxy Lab | Admin Center', tlsActive: true });
});

// Configure Certificate storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'certs/'); // Specify the directory to save the uploaded files
  },
  filename: function (req, file, cb) {
    if (file.fieldname === 'pfx') {
      cb(null, 'certificate.pfx'); // Save the pfx file as certificate.pfx
    }
  }
});

// File filter to ensure only .pfx files are uploaded
const fileFilter = (req, file, cb) => {
  if (!file.originalname.endsWith('.pfx')) {
    return cb(new Error('Only .pfx files are allowed!'), false);
  }
  cb(null, true);
};

// Initialize Multer with the storage configuration and file filter
const upload = multer({ storage: storage, fileFilter: fileFilter }).single('pfx');

// Upload certificates
router.post('/certificateupload', isAuthenticated, (req, res) => {
  upload(req, res, function (err) {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    const pfxFile = req.file; // Access the uploaded pfx file
    const password = req.body.password; // Access the password

    if (!pfxFile || !password) {
      return res.status(400).json({ message: 'PFX file and password are required.' });
    }

    // Update the .env file with the new password
    const envPath = path.join(__dirname, '../../.env');
    fs.readFile(envPath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to read .env file.' });
      }

      const updatedEnv = data.replace(/PFX_PASSWORD=.*/, `PFX_PASSWORD=${password}`);
      fs.writeFile(envPath, updatedEnv, 'utf8', (err) => {
        if (err) {
          return res.status(500).json({ message: 'Failed to update .env file.' });
        }

        const response = { message: 'Certificate uploaded successfully. Restart the server for changes to take effect. HTTPS available on port 8443' };
        res.json(response);
      });
    });
  });
});

module.exports = router;