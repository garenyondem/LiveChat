var app = require('./app'),
    http = require('http').createServer(app),
    io = require('socket.io')(http),
    threadsCollection = require('./db/threadsCollection'),
    messagesCollection = require('./db/messagesCollection'),
    db = require('./db/db'),
    async = require('neo-async'),
    is = require('is_js');

const port = 4085;

var threads = {};

//connect, message, disconnect, reconnect, ping, join, leave
io.sockets.on('connection', (socket) => { // each user has its own socket
    console.log('a user connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('a user has disconnected:', socket.id);
        var threadKey = threads[socket.id];
        socket.broadcast.to(threadKey).emit('message_sent', {
            userId: socket.id,
            message: ' has disconnected from channel.'
        });
    });

    socket.on('new_message', (data) => {
        try { data = JSON.parse(data); }
        catch (err) { }
        if (is.existy(data.threadId)) {
            async.parallel([
                (waterfallCb) => threadsCollection.getThreadKeyByThreadId(data.threadId, waterfallCb),
                (waterfallCb) => messagesCollection.add(data.threadId, data.message, data.userId, undefined, waterfallCb) // TODO: withId is needed
            ], function (err, results) {
                if (!err) {
                    var threadKey = results[0];
                    // replacing userId with socket.id because client side authentication is not available atm
                    data.userId = socket.id;
                    io.in(threadKey).emit('message_sent', data);
                } else {
                    data.message = 'Error happened while delivering your message.';
                    console.dir(err);
                }
            });
        } else {
        }
    });

    socket.on('subscribe', (threadKey) => {
        // joining to channel
        socket.join(threadKey);
        threads[socket.id] = threadKey;
        console.log(socket.id + 'has joined to ' + threadKey);
        // notify others in channel about this join event
        socket.broadcast.to(threadKey).emit('message_sent', {
            userId: socket.id,
            message: 'has joined to channel.'
        });
        // check if this channel has a threadId
        threadsCollection.getByThreadKey(threadKey, (err, thread) => {
            if (!err && thread) {
                io.emit('thread_data', thread._id.toString());
            } else {
                // new channel save to db and generate a threadId
                threadsCollection.add(threadKey, (err, threadId) => {
                    console.log('Thread added. Your threadId is:', threadId);
                    io.emit('thread_data', threadId);
                });
            }
        });
    });
});

async.series([
    (seriesCb) => {
        console.log('Initializing DB Connection');
        db.init(seriesCb)
    },
    (seriesCb) => http.listen(port, () => seriesCb(null))
], function (err, results) {
    if (!err) {
        console.log('listening on port', port);
    } else {
        console.log('ERROR Initializing DB Conn');
    }
});