var usersCollection = require('../db/usersCollection'),
    is = require('is_js');

function create(req, res) {
    var body = req.body,
        name = body.name,
        password = body.password;

    if (is.not.existy(name) || is.not.existy(password) || is.not.string(name) || is.not.string(password)) {
        return res.send({
            status: {
                success: false,
                reason: 'invalid data type of name or password'
            },
        });
    }
    usersCollection.add(name, password, (err, token) => {
        res.send({
            status: {
                success: !err,
                reason: ''
            },
            token: token
        });
    });
}

module.exports = {
    create: create
}