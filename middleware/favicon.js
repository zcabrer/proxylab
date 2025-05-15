const path = require('path');

const faviconMiddleware = (req, res, next) => {
    const faviconPath = path.join(__dirname, '../public/favicon');
    const faviconIndex = req.path.indexOf('/favicon/');
    if (faviconIndex !== -1) {
        const filePath = req.path.substring(faviconIndex + '/favicon/'.length);
        const fullPath = path.join(faviconPath, filePath);
        res.sendFile(fullPath, {
            dotfiles: 'deny',
            fallthrough: false
        }, err => {
            if (err) {
                res.status(err.statusCode || 404).end();
            }
        });
    } else {
        next();
    }
};

module.exports = faviconMiddleware;
