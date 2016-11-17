var db = require('./db'),
    ObjectId = require('mongodb').ObjectID,
    is = require('is_js'),
    Enums = require('../enums/enums');

function add(threadKey, callback) {
    var Ids = threadKey.split('-'), //userId-orderId
        userId = Ids[0],
        orderId = Ids[1];

    var newThread = {
        _id: new ObjectId(),
        userId: userId,
        orderId: orderId,
        threadKey: threadKey
    }
    db.client.collection(Enums.Collections.Threads, (err, collection) => {
        collection.insert(newThread, (err) => {
            callback(err, newThread._id.toString());
        });
    });
}

function getThreadKeyByThreadId(threadId, callback) {
    var query = {
        _id: is.string(threadId) ? ObjectId(threadId) : threadId
    }
    var projection = { fields: ({ threadKey: 1 }) };
    db.client.collection(Enums.Collections.Threads, (err, collection) => {
        collection.find(query, projection).limit(1).next((err, item) => {
            callback(err, item.threadKey);
        });
    });
}

function getByThreadKey(threadKey, callback) {
    var query = {
        threadKey: threadKey
    }
    db.client.collection(Enums.Collections.Threads, (err, collection) => {
        collection.find(query).limit(1).next(callback);
    });
}

module.exports = {
    add: add,
    getThreadKeyByThreadId: getThreadKeyByThreadId,
    getByThreadKey: getByThreadKey
}