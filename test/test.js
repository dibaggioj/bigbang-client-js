describe('client', function () {

    describe('#connect', function () {
        it('should connect successfuly', function (done) {
            var bb = new BigBang.Client();
            bb.connect('http://demo.bigbang.io', function (err) {
                assert.equal(err, null);
                done();
            })
        })
    });

    describe('#connect', function () {
        it('should should fail gracefully', function (done) {
            var bb = new BigBang.Client();
            bb.connect('http://hugenondexistintdomainthingfoobar.bigbang.io', function (err) {
                assert(err);
                done();
            })
        })
    });

    describe('#connect', function () {
        it('should connect successfuly via https', function (done) {
            var bb = new BigBang.Client();
            bb.connect('https://demo.bigbang.io', function (err) {
                assert.equal(err, null);
                done();
            })
        })
    });

    describe('#connect', function () {
        it('should should subscribe', function (done) {
            var bb = new BigBang.Client();
            bb.connect('http://demo.bigbang.io', function (err) {
                assert.equal(err, null);

                var channelName = randomstring(8);
                bb.subscribe(channelName, function (err, channel) {
                    assert(!err);
                    assert(channel);

                    var sent = {"foo": randomstring(), "bar": randomstring()};

                    channel.on('message', function (msg) {
                        var json = msg.payload.getBytesAsJSON();

                        assert(json);
                        assert.deepEqual(json, sent);
                        done();
                    });

                    channel.publish(sent);
                });

            })
        })
    });

    describe('#connect', function () {
        it('should should subscribe and unsubscribe', function (done) {
            var bb = new BigBang.Client();

            bb.connect('http://demo.bigbang.io', function (err) {
                assert.equal(err, null);

                var channelName = randomstring(8);
                bb.subscribe(channelName, function (err, channel) {
                    assert(!err);
                    assert(channel);

                    channel.on('join', function (joined) {
                        assert.equal(bb.getClientId(), joined);
                    });

                    channel.unsubscribe( function() {
                        done();
                    });
                })
            })
        })
    });

    describe('#channelData', function () {
        it('should do awesome channelData stuff ', function (done) {

            clientOnChannel(randomstring(), function (client, channel) {

                var ks = randomstring();
                var thekey = randomstring();
                var obj = {foo: randomstring(), bar: randomstring() };

                channel.getChannelData(ks).on('add', function (key, value) {
                    assert.equal(key, thekey);
                    assert.deepEqual(value, obj);
                    assert.ok( channel.getNamespaces().indexOf(ks) != -1);

                });

                channel.getChannelData(ks).on('remove', function (key) {
                    assert.equal(key, thekey);
                    //TODO can't yet assert this here, timing..
                    //assert.ok( channel.getNamespaces().indexOf(ks) == -1);
                    done();
                });

                channel.getChannelData(ks).put(thekey, obj);
                channel.getChannelData(ks).remove(thekey);

            });
        });
    })
});


function clientOnChannel(name, callback) {
    var bb = new BigBang.Client();
    bb.connect('http://demo.bigbang.io', function (err) {
        assert.equal(err, null);

        bb.subscribe(name, function (err, channel) {
            assert(!err);
            assert(channel);
            callback(bb, channel);
        });

    });
}


var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghiklmnopqrstuvwxyz';

function randomstring(length) {
    length = length ? length : 32;

    var string = '';

    for (var i = 0; i < length; i++) {
        var randomNumber = Math.floor(Math.random() * chars.length);
        string += chars.substring(randomNumber, randomNumber + 1);
    }

    return string;
}

