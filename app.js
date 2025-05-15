// Built-in modules
const path = require('path');
const fs = require('fs');
const http = require('http');
const https = require('https');

// Third-party modules
const express = require('express');
const expressWs = require('express-ws');
const morgan = require('morgan');
require('dotenv').config();

// Local modules
const { morganMiddleware, format } = require('./middleware/morgan');
const { logStream } = require('./utils/logStream');
const { getCertificateFromKeyVault } = require('./utils/keyVaultUtils');
const generateDownloadFiles = require('./utils/generateDownloads');
const bodyParserMiddleware = require('./middleware/bodyparser');
const versionMiddleware = require('./middleware/version');
const { sessionMiddleware } = require('./middleware/auth');
const router = require('./routes/router');
const logRoute = require('./routes/admincenter/log-route');
const faviconMiddleware = require('./middleware/favicon');

// Constants
const HTTPPORT = process.env.HTTPPORT || 8080;
const HTTPSPORT = process.env.HTTPSPORT || 8443;
const USE_KEYVAULT = process.env.USE_KEYVAULT?.toLowerCase() === 'true';

// Initialize Express app
const app = express();

// Generate download files at startup
generateDownloadFiles();

// Set EJS as the template engine
app.set('view engine', 'ejs');

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Serve favicons for any path containing "/favicon/"
app.use(faviconMiddleware);

// Middleware setup
bodyParserMiddleware(app);
app.use(morganMiddleware);
app.use(morgan(format, { stream: logStream }));
app.use(versionMiddleware);
app.use(sessionMiddleware);

// Route setup
app.use('/', router);
app.use('/admincenter/log', logRoute);

// HTTP server setup
const httpServer = http.createServer(app);
expressWs(app, httpServer);
httpServer.listen(HTTPPORT, () => {
  console.log(`HTTP Server is running on port ${HTTPPORT}`);
});

// HTTPS server setup
(async function initializeHttpsServer() {
  try {
    let credentials;

    if (USE_KEYVAULT) {
      // Fetch certificate from Azure Key Vault
      credentials = await getCertificateFromKeyVault();
    } else {
      // Use manually uploaded certificate
      const pfxPath = path.join(__dirname, 'certs/certificate.pfx');
      const password = process.env.PFX_PASSWORD;
      const pfx = fs.readFileSync(pfxPath);
      credentials = { pfx, passphrase: password };
    }

    const httpsServer = https.createServer(credentials, app);
    expressWs(app, httpsServer);

    httpsServer.listen(HTTPSPORT, () => {
      console.log(`HTTPS Server is running on port ${HTTPSPORT}`);
    });
  } catch (error) {
    console.error('Could not start HTTPS server:', error.message);
  }
})();