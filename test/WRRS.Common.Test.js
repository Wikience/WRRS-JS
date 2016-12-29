/** (c) 2016 by Antonio Rodriges, rodriges@wikience.org */

var assert = chai.assert;
var expect = chai.expect;
var testServerURL = "ws://127.0.0.1:8081/websocket";

/* For testing purposes */
var PTEST = {};

// Used during connection
PTEST.INVALID_VERSION = 1000;
PTEST.TIMEOUT_VERSION = 2000;
PTEST.CORRUPT_BSON_VERSION = 3000;

// Used during request
PTEST.COMPRESS_TEST = 4000;