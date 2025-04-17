const morgan = require('morgan');

// Define custom tokens
morgan.token('protocol', (req) => req.protocol);
morgan.token('src-port', (req) => req.connection.remotePort);
morgan.token('dst-port', (req) => req.connection.localPort);
morgan.token('x-forwarded-for', (req) => req.headers['x-forwarded-for'] || req.headers['X-Forwarded-For'] || '-');
morgan.token('x-forwarded-proto', (req) => req.headers['X-Forwarded-Proto'] || req.headers['X-Forwarded-Proto'] || '-');

// Define a custom format string using the custom tokens
const customFormat = ':date[iso] :remote-addr :status :method :protocol :req[host] :url :src-port -> :dst-port xff=:x-forwarded-for xfproto=:x-forwarded-proto :user-agent :req[content-length] :response-time';

// Define the Morgan middleware configuration
const morganMiddleware = morgan(customFormat);

module.exports = {
    morganMiddleware,
    format: customFormat, // Export the custom format
};