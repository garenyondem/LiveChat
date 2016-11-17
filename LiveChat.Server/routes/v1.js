var express = require('express'),
    router = express.Router(),
    newUser = require('../controllers/newUser'),
    users = require('../controllers/users');

router.post('/createUser', newUser.create);
router.post('/login', users.login);
router.get('/getUser', users.auth, users.getUser);

router.get('/', (req, res) => {
    res.render('index', { title: 'Express' });
});

router.get('/socket', (req, res) => {
    res.render('index.html');
});

module.exports = router;