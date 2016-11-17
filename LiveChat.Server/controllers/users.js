var usersCollection = require('../db/usersCollection'),
    is = require('is_js');

function auth(req, res, next) {
    var token = req.headers.token;

    function responseHandler(success, reason) {
        res.send({
            status: {
                success: success,
                reason: reason
            }
        });
    }

    if (is.not.existy(token) || is.not.string(token)) {
        return responseHandler(false, 'token not found');
    }
    usersCollection.getByToken(token, (err, user) => {
        if (!err && user) {
            req.token = token;
            next();
        } else {
            responseHandler(!err, 'invalid token');
        }
    });
}

function login(req, res) {
    var body = req.body,
        name = body.name,
        password = body.password;

    function responseHandler(success, token, reason) {
        res.send({
            status: {
                success: success,
                reason: reason || ''
            },
            token: token || ''
        });
    }
    console.log(name, password);
    usersCollection.getByNameAndPassword(name, password, (err, user) => {
        if (!err && user) {
            responseHandler(!err, user.token);
        } else {
            responseHandler(!err, undefined, 'wrong password or name');
        }
    });
}

function getUser(req, res) {
    var token = req.token;

    usersCollection.getByToken(token, (err, user) => {
        res.send({
            status: {
                success: !err,
                reason: ''
            },
            user: user || []
        });
    });
}

module.exports = {
    auth: auth,
    login: login,
    getUser: getUser
}