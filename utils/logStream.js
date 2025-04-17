const { PassThrough } = require('stream');

const logStream = new PassThrough();

module.exports = {
    logStream,
};
