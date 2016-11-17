var db = require('./db'),
    ObjectId = require('mongodb').ObjectID,
    cuid = require('cuid'),
    crypto = require('crypto-js'),
    moment = require('moment'),
    Enums = require('../enums/enums');

function add(name, password, callback) {
    var newUser = {
        token: cuid(),
        creationDate: moment()._d,
        name: name,
        password: crypto.MD5(password).toString()
    }
    db.client.collection(Enums.Collections.Users, (err, collection) => {
        collection.insert(newUser, (err) => {
            callback(err, newUser.token);
        });
    });
}

function update() { }

function remove() { }

function getByToken(token, callback) {
    var query = { token: token }
    var projection = { fields: ({ password: 0 }) };
    db.client.collection(Enums.Collections.Users, (err, collection) => {
        collection.find(query, projection).limit(1).next(callback);
    });
}

function getByNameAndPassword(name, password, callback) {
    var query = {
        name: name,
        password: crypto.MD5(password).toString()
    }
    var projection = { fields: ({ password: 0 }) };
    db.client.collection(Enums.Collections.Users, (err, collection) => {
        collection.find(query).limit(1).next(callback);
    });
}

module.exports = {
    add: add,
    update: update,
    remove: remove,
    getByToken: getByToken,
    getByNameAndPassword: getByNameAndPassword
}