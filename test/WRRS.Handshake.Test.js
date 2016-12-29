/** (c) 2016 by Antonio Rodriges, rodriges@wikience.org */

describe('WRRS HANDSHAKE tests', function () {
    it('Should receive datasets tree', function (done) {
        var R = new WRRS();
        var callback = function (state) {
            if (state === R.NWSTATES.SUCCESS_CONNECT_WITH_DATASETSTREE) {
                console.log(JSON.stringify(R.datasets));
                console.log(JSON.stringify(R.layers));
                done();
            } else {
                done("Versions should be valid; " + state);
            }
        };

        try {
            R.connect(testServerURL, callback);
        } catch (err) {
            done(err);
        }
    });

    it('Should *not* receive datasets tree', function (done) {
        try {
            var R = new WRRS();
            R.RETRIEVE_DATASETS_TREE = false;

            var callback = function (state) {
                if (state === R.NWSTATES.SUCCESS_CONNECT_WITHOUT_DATASETSTREE ) {
                    done();
                } else {
                    done("We must not have datasets tree" + state);
                }
            };

            R.connect(testServerURL, callback);

        } catch (err) {
            done(err);
        }
    });

    it('Should receive version error', function (done) {
        try {
            var R = new WRRS();
            R.VERSION = PTEST.INVALID_VERSION;

            var callback = function (state) {
                if (state === R.NWSTATES.ERROR_INVALID_VERSIONS) {
                    done();
                } else {
                    done("Versions should be invalid; " + state);
                }
            };

            R.connect(testServerURL, callback);
        } catch (err) {
            done(err);
        }
    });

    it('Should timeout', function (done) {
        try {
            var R = new WRRS();
            R.VERSION = PTEST.TIMEOUT_VERSION;

            var callback = function (state) {
                if (state === R.NWSTATES.CONNECT_TIMEOUT) {
                    done();
                } else {
                    done("should timeout; " + state);
                }
            };

            R.connect(testServerURL, callback);
        } catch (err) {
            done(err);
        }
    });

    it('Should return corrupted datasets tree', function (done) {
        try {
            var R = new WRRS();
            R.VERSION = PTEST.CORRUPT_BSON_VERSION;

            var callback = function (state) {
                if (state === R.NWSTATES.ERROR_CORRUPTED_DATASETS_TREE) {
                    done();
                } else {
                    done("datasets tree should be corrupted; " + state);
                }
            };

            R.connect(testServerURL, callback);
        } catch (err) {
            done(err);
        }
    });
});


