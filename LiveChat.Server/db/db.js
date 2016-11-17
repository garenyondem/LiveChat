var mongoClient = require('mongodb').MongoClient,
    config = require('../config');

function init(callback) {
    mongoClient.connect(config.dbConnectionUrl, (err, client) => {
        if (!err && client) {
            console.log('Connected successfully to server');
            module.exports.client = client;
        } else {
            console.log('Connected failed to server');
        }
        callback(err);
    });
}

module.exports.init = init;