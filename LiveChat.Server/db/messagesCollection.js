var db = require('./db'),
    ObjectId = require('mongodb').ObjectID,
    is = require('is_js'),
    Enums = require('../enums/enums');

function add(threadId, message, userId, withId, callback) {
    var newMessage = {
        threadId: is.string(threadId) ? ObjectId(threadId) : threadId,
        userId: userId,
        withId: withId,
        message: message
    }
    db.client.collection(Enums.Collections.Messages, (err, collection) => {
        collection.insert(newMessage, callback);
    });
}

module.exports = {
    add: add
}