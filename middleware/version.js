const packageJson = require('../package.json'); // Import package.json to get the version

// Middleware to add the version to the response locals
const versionMiddleware = (req, res, next) => {
    res.locals.version = packageJson.version; // Pass the version to EJS templates
    next();
};

module.exports = versionMiddleware;