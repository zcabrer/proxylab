const { DefaultAzureCredential } = require('@azure/identity');
const { SecretClient } = require('@azure/keyvault-secrets');
const express = require('express');
const expressWs = require('express-ws'); // websocket support for live log tool
const { morganMiddleware, format } = require('./middleware/morgan');
const { logStream } = require('./utils/logStream'); // log stream utility for live log tool
const app = express();
const path = require('path');
const router = require('./routes/router');
const https = require('https');
const fs = require('fs');
const http = require('http');
require('dotenv').config();
const morgan = require('morgan');

// Set EJS as the template engine
app.set('view engine', 'ejs');

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Import bodyparser middleware for parsing incoming request bodies
const bodyParserMiddleware = require('./middleware/bodyparser');
bodyParserMiddleware(app);

// Use Morgan with the custom format for console logging
app.use(morganMiddleware);

// Use Morgan with the custom format for logStream
app.use(morgan(format, { stream: logStream }));

// Set up authentication session middleware
const { sessionMiddleware } = require('./middleware/auth');
app.use(sessionMiddleware);

// Import the router module
app.use('/', router);

const logRoute = require('./routes/config/log-route');
app.use('/config/log', logRoute);

// Initialize WebSocket for HTTP server
const httpServer = http.createServer(app);
expressWs(app, httpServer);

// Function to fetch certificate from Azure Key Vault
async function getCertificateFromKeyVault() {
  const keyVaultName = process.env.KEYVAULT_NAME;
  const certificateName = process.env.KEYVAULT_CERTIFICATE_NAME;

  if (!keyVaultName || !certificateName) {
    throw new Error('KeyVault name or certificate name is not specified in environment variables.');
  }

  const keyVaultUrl = `https://${keyVaultName}.vault.azure.net`;
  const credential = new DefaultAzureCredential();
  const secretClient = new SecretClient(keyVaultUrl, credential);

  console.log(`Fetching certificate '${certificateName}' from Azure Key Vault...`);
  const certificateSecret = await secretClient.getSecret(certificateName);

  // The secret value contains the PFX certificate
  const pfx = Buffer.from(certificateSecret.value, 'base64');

  return {
    pfx: pfx
  };
}

// Initialize WebSocket for HTTPS server
let httpsServer;
(async () => {
  try {
    let credentials;

    if (process.env.USE_KEYVAULT === 'true' || process.env.USE_KEYVAULT === 'True') {
      // Fetch certificate from Azure Key Vault
      credentials = await getCertificateFromKeyVault();
    } else {
      // Use manually uploaded certificate
      const pfxPath = path.join(__dirname, 'certs/certificate.pfx');
      const password = process.env.PFX_PASSWORD;
      const pfx = fs.readFileSync(pfxPath);
      credentials = { pfx: pfx, passphrase: password };
    }

    const httpsport = process.env.HTTPSPORT || 8443;
    httpsServer = https.createServer(credentials, app);
    expressWs(app, httpsServer);

    httpsServer.listen(httpsport, () => {
      console.log(`HTTPS Server is running on port ${httpsport}`);
    });
  } catch (error) {
    console.error('Could not start HTTPS server:', error.message);
  }
})();

// Start the HTTP server
const httpport = process.env.HTTPPORT || 8080;
httpServer.listen(httpport, () => {
  console.log(`HTTP Server is running on port ${httpport}`);
});