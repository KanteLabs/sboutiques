const ApiHelper = {};
const path = require('path')
const { client, redis } = require('../db/config');
const allowedFiles = {
    ".png": ".png",
    ".gif": ".gif",
    ".jpeg": ".jpeg",
    ".jpg": ".jpg"
}

ApiHelper.checkForValidFiles = (files) => {
    let count = 0;
    files.map((file, i) => {
        return allowedFiles[path.extname(file.originalname).toLowerCase()] ? count++ : null;
    })
    return( count === files.length);
};

ApiHelper.checkFileAmount = (files) => {
    return (files.length <= 6);
}

ApiHelper.isGreaterThanZero = (body) => {
    return (body.price > 0)
}

ApiHelper.checkCache = (req, res, next) => {
    client.get('recent_uploads', function(err, data) {
        if (err) throw err;

        if (data) {
            res.send(data);
        } else {
            next();
        }
    })
}

module.exports = ApiHelper;