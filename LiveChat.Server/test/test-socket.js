var should = require('should'),
    io = require('socket.io-client'),
    server = require('../start');

const socketServerURL = 'http://127.0.0.1:4085';

const options = {
    transports: ['websocket'],
    'force new connection': true
};

const userId = 'garenUserId';
const orderId = 'laptopOrderId';
const threadKey = userId + '-' + orderId;
const message = 'Sup?';

// This can't be arrow func. because mocha doesn't support timeout with arrow funcs. See: https://github.com/mochajs/mocha/issues/2018
describe("LiveChat.Server", function () {
    this.timeout(10000);

    it('Should subscribe to a channel and receive threadId', (done) => {
        var client = io.connect(socketServerURL, options);
        client.on('connect', () => {
            client.emit('subscribe', threadKey);
        });
        client.on('thread_data', (_threadId) => {
            _threadId.should.be.type('string');
            client.disconnect();
            done();
        });
    });

    it('Should broadcast new user to all users in same channel', (done) => {
        var client1 = io.connect(socketServerURL, options);
        var client2 = io.connect(socketServerURL, options);
        var client3;
        client1.emit('subscribe', threadKey);
        client2.emit('subscribe', threadKey);
        client2.on('connect', () => {
            client3 = io.connect(socketServerURL, options);
            client3.emit('subscribe', threadKey);
        });
        var numberOfTriggers = 0;
        function checkHandler(client) {
            client.on('message_sent', (data) => {
                var message = data.message;
                numberOfTriggers++;
                message.should.equal('has joined to channel.');
                if (numberOfTriggers > 2) {
                    client1.disconnect();
                    client2.disconnect();
                    client3.disconnect();
                    done();
                }
            });
        }
        checkHandler(client1);
        checkHandler(client2);
    });

    it('Should broadcast disconnected user to all users in same channel', (done) => {
        var client1 = io.connect(socketServerURL, options);
        var client2 = io.connect(socketServerURL, options);
        client1.on('connect', () => {
            client1.emit('subscribe', threadKey);
        });
        client2.on('connect', (data) => {
            client2.emit('subscribe', threadKey);
            client2.disconnect();
        });
        var numberOfTriggers = 0;
        client1.on('message_sent', (data) => {
            numberOfTriggers++;
            // first trigger is for client2 connection
            // we need the second trigger which is client2 disconnection
            if (numberOfTriggers > 1) {
                var message = data.message;
                message.should.equal(' has disconnected from channel.');
                client1.disconnect();
                done();
            }
        });
    });

    it('Should be able to broadcast messages to all users in same channel', (done) => {
        var client1 = io.connect(socketServerURL, options);
        var client2 = io.connect(socketServerURL, options);
        var client3 = io.connect(socketServerURL, options);
        var threadId;
        function connectToChannel(client) {
            client.emit('subscribe', threadKey);
        }
        connectToChannel(client1);
        connectToChannel(client2);
        connectToChannel(client3);
        client1.on('thread_data', (_threadId) => {
            _threadId.should.be.type('string');
            threadId = _threadId;
            client1.emit('new_message', {
                'threadId': threadId,
                'message': message,
                'userId': userId,
                'orderId': orderId
            });
        });
        var numberOfTriggers = 0;
        function checkHandler(client) {
            client.on('message_sent', (data) => {
                var message = data.message;
                numberOfTriggers++;
                // skipping 'joined to channel' messages before assertion
                if (numberOfTriggers > 3) {
                    message.should.equal(message);
                    if (numberOfTriggers > 4) {
                        client1.disconnect();
                        client2.disconnect();
                        client3.disconnect();
                        done();
                    }
                }
            });
        }
        checkHandler(client1);
        checkHandler(client2);
        checkHandler(client3);
    });
});