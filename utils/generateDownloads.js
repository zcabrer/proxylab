const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function generateDownloadFiles() {
    // Directory and file paths
    const downloadsDir = path.join(__dirname, '..', 'public', 'downloads');
    const files = [
      { name: '1GB.txt', size: 1000 * 1024 * 1024 }, // 1GB
      { name: '100MB.txt', size: 100 * 1024 * 1024 }, // 100MB
      { name: '10MB.txt', size: 10 * 1024 * 1024 }, // 10MB
      { name: '1MB.txt', size: 1 * 1024 * 1024 }, // 1MB
    ];
  
    // Ensure the downloads directory exists
    if (!fs.existsSync(downloadsDir)) {
      fs.mkdirSync(downloadsDir, { recursive: true });
    }
  
    // Check and create files if they don't exist
    files.forEach(file => {
      const filePath = path.join(downloadsDir, file.name);
      if (!fs.existsSync(filePath)) {
        execSync(`dd if=/dev/zero of=${filePath} bs=1M count=${file.size / (1024 * 1024)} > /dev/null 2>&1`);
      }
    });
  }
  
  module.exports = generateDownloadFiles;