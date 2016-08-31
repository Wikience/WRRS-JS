"use strict";

/** (c) 2016 by Antonio Rodriges, rodriges@wikience.org
 *
 * WRRS JavaScript Client (Web Raw Raster Service)
 * 
 * Simple network protocol for raw (source) raster data
 * exchange between browser-based JavaScript Web clients
 * and WebSocket or other TCP/IP-based servers.
 *
 * This implementation is based on WebSocket,
 * Google Protocol Buffers, Binary JSON.
 * */

//window.R = new WRRS();

/* Constructor */
function WRRS() {
    var self = this;

    /* Major version of this JavaScript protocol implementation*/
    self.VERSION = 1;

    /*
     Received from server instead of datasets tree
     1) when self.VERSION and Server version do not coincide
     2) when self.RETRIEVE_DATASETS_TREE is false, but versions coincide */
    self.VERSION_ERR_STR = "$ERROR"; // 1)
    self.VERSION_SUCC_STR = "$SUCCESS"; // 2)

    /* Whether to request a datasets tree*/
    self.RETRIEVE_DATASETS_TREE = true;
    
    /* JSON Tree of datasets received from server */
    self.datasets = {};

    /* self.datasets converted to a more convenient representation for GUI */
    self.layers = {};

    /* Protocol Buffers object*/
    self.PROTOBUF = wrrsprotobuf;

    /* Server connect timeout */
    self.CONNECT_TIMEOUT_THRESHOULD = 3000;

    /* Timeout before receiving RasterResponse */
    self.IO_TIMEOUT_THRESHOULD = 3000;

    /* Protocol networking state; it also passed to user callback */
    /* User may call helper functions "onInvalidProtocolVersion" or "reconnect" */
    self.NWSTATES = {
        /* Connection-specific states during handshake phase */
        CREATED: -3,
        CONNECTING: -2,
        CONNECT_TIMEOUT: -1,
        SUCCESS_CONNECT_WITH_DATASETSTREE: 0,
        SUCCESS_CONNECT_WITHOUT_DATASETSTREE: 1,
        ERROR_INVALID_VERSIONS: 2,
        ERROR_CORRUPTED_DATASETS_TREE: 3,

        /* WebSocket state */
        ERROR_SOCKET_CLOSED: 4,
        NORMAL_SOCKET_CLOSE: 5,
        NETWORK_ERROR: 6
    };

    self.STATE = self.NWSTATES.CREATED;

    /* States related to RasterRequest (client-server I/O) */
    self.IOSTATES = {
        ON_SUCCESS_RESPONSE: 1,         // received response, success flag
        ON_ERROR_DECODE_RESPONSE: 2,    // received response, error while deserializing
        ON_RESPONSE_TIMEOUT: 3,         // response time out
        ON_SERVER_ERROR: 4,             // received response with error flag
        ON_NO_RESPONSE_HANDLER: 5,      // received response without "requestId"
        ON_NO_REQUEST_IN_POOL: 6,       // Could not locate request in pool with given "requestId"
        ON_ERROR_PARSING_NDARRAY: 7     // errors while restoring received nD array
    };

    /* Should accept object with {state, RasterResponse, Request} */
    self.IOUSERCALLBACK = undefined;

    self.setIOCallback = function (iousercallback) {
        self.IOUSERCALLBACK = iousercallback;
    };

    self.log = function (msg) {
        console.log("WRRS: " + msg);
    };

    self.logErr = function (msg) {
        self.log("ERROR " + msg)
    };

    /*
     URL: server URL
     callback: function (STATE) - single argument
     */
    self.connect = function (URL, callback) {
        if (self.STATE === self.NWSTATES.CONNECTING) {
            // already connecting
            return;
        }

        if (URL === undefined) {
            throw new Error("URL not defined");
        }

        self.URL = URL; // save to reconnect

        if (callback === undefined) {
            callback = function (State) {
                self.log(State);
            }
        }
        self.USERCALLBACK = callback;

        self.STATE = self.NWSTATES.CONNECTING;

        self.socket = new WebSocket(URL);
        self.socket.binaryType = "blob";

        self.socket.onopen = self.onSocketOpenCallback;
        self.socket.onclose = self.onSocketCloseCallback;
        self.socket.onerror = self.onSocketError;
    };

    self.alterState = function (newState) {
        self.STATE = newState;
        if (self.USERCALLBACK) {
            self.USERCALLBACK(newState);
        }
    };

    /* params = {state, RasterResponse, Request} */
    self.alterIOState = function (params) {
        // No state saving unlike "alterState"
        if (self.IOUSERCALLBACK) {
            self.IOUSERCALLBACK(params);
        }
    };

    self.acceptRasterResponses = function () {
        self.socket.onmessage = self.onRasterResponse;
    };

    /* Protocol undergoes several fixed-order client-server interchange messages
     * before user may send queries; these are handled here */
    self.onSocketOpenCallback = function () {
        self.log("WebSocket connection established");

        var connectRequest = new self.PROTOBUF.ConnectRequest();
        connectRequest.setProtocolVersion(self.VERSION);
        connectRequest.setRetrieveDatasetTree(self.RETRIEVE_DATASETS_TREE);

        self.socket.onmessage = self.onDatasetsTreeOrVersionError;
        self.socket.send(connectRequest.toArrayBuffer());

        // Watch for timeout
        setTimeout(function () {
            if (self.STATE === self.NWSTATES.CONNECTING) {
                self.socket.onmessage = function () {
                    // Stop receiving messages after time out
                };

                self.alterState(self.NWSTATES.CONNECT_TIMEOUT);
            }
        }, self.CONNECT_TIMEOUT_THRESHOULD);
    };

    /*
     Is called when server successfully replies on ConnectRequest
     either with 
     1) "$ERROR" - versions do not coincide
     2) tree of datasets
     3) "$SUCESS" - versions coincide, but datasets tree has not been requested 
     */
    self.onDatasetsTreeOrVersionError = function (event) {
        var reader = new FileReader();

        reader.onload = function () {
            var uint8Array = new Uint8Array(this.result);
            var potentialErrorMsg = new TextEncoder("utf-8").encode(self.VERSION_ERR_STR);
            if (self.uint8cmp(uint8Array, potentialErrorMsg)) {
                self.logErr("client and server versions do not coincide");
                self.alterState(self.NWSTATES.ERROR_INVALID_VERSIONS);
            } else {
                if (!self.RETRIEVE_DATASETS_TREE) {
                    var potentialSuccessMsg = new TextEncoder("utf-8").encode(self.VERSION_SUCC_STR);

                    if (self.uint8cmp(uint8Array, potentialSuccessMsg)) {
                        self.log("Successful client-server handshake without datasets tree");
                        self.alterState(self.NWSTATES.SUCCESS_CONNECT_WITHOUT_DATASETSTREE);
                        self.acceptRasterResponses();
                    } else {
                        self.logErr("Unexpected message, possible versions mismatch");
                        self.alterState(self.NWSTATES.ERROR_INVALID_VERSIONS);
                    }
                } else {
                    var BSON = bson().BSON;
                    try {
                        self.datasets = BSON.deserialize(uint8Array);
                        self.layers = self.convertDatasetsTreeToLayers(self.datasets);
                        self.log("Successful client-server handshake with datasets tree");
                        self.alterState(self.NWSTATES.SUCCESS_CONNECT_WITH_DATASETSTREE);
                        self.acceptRasterResponses();
                    } catch (error) {
                        self.logErr("Datasets tree corrupted, possible version mismatch; " + error);
                        self.alterState(self.NWSTATES.ERROR_CORRUPTED_DATASETS_TREE);
                    }
                }
            }
        };

        reader.readAsArrayBuffer(event.data);
    };

    self.convertDatasetsTreeToLayers = function (jsonDatasets) {
        var group1 = jsonDatasets.group;
        var layers = [];

        if (!(group1 instanceof Array)) {
            group1 = [group1];
        }

        for (var i = 0; i < group1.length; i++) {
            var level1 = group1[i];
            var group2 = level1.group;

            if (!(group2 instanceof Array)) {
                group2 = [group2];
            }

            for (var j = 0; j < group2.length; j++) {
                var level2 = group2[j];
                var group3 = level2.group;

                if (!(group3 instanceof Array)) {
                    group3 = [group3];
                }

                for (var k = 0; k < group3.length; k++) {
                    var level3 = group3[k];
                    var missings = level3.missingdate;
                    var missingsFormatted = [];
                    if (missings != null) {
                        if (missings.length != null) {
                            for (var z = 0; z < missings.length; z++) {
                                missingsFormatted.push([missings[z].start, missings[z].end]);
                            }
                        } else {
                            missingsFormatted.push([missings.start, missings.end]);
                        }
                    }

                    var layer = {
                        id: level1.name + "." + level2.name + "." + level3.name[0],
                        name: level3.name[1],
                        icon: level3.icon,
                        date: level3.dates,
                        missingdates: missingsFormatted
                    };

                    layers.push(layer);
                }
            }
        }

        return layers;
    };

    self.onSocketCloseCallback = function (event) {
        var suf = ' (code: ' + event.code + ' reason: ' + event.reason + ')';
        if (event.wasClean) {
            self.log('WebSocket closed' + suf);
            self.alterState(self.NWSTATES.NORMAL_SOCKET_CLOSE);
        } else {
            self.logErr('WebSocket abrupt disconnect' + suf);
            self.alterState(self.NWSTATES.ERROR_SOCKET_CLOSED);
        }
    };

    self.onSocketError = function (error) {
        self.logErr("WebSocket error " + error.message);
        self.alterState(self.NWSTATES.NETWORK_ERROR);
    };

    /* Compare UInt8 arrays */
    self.uint8cmp = function (uint8arr1, uint8arr2) {
        if (uint8arr1.length != uint8arr2.length) return false;

        for (var i = 0; i != uint8arr1.byteLength; i++) {
            if (uint8arr1[i] != uint8arr2[i]) return false;
        }

        return true;
    };

    /* Helper functions that may be used in the user callback */
    // ----- {
    self.RECONNECTING = 0;
    self.reconnect = function () {
        if (self.RECONNECTING === 0 && self.STATE !== self.NWSTATES.CONNECTING) {
            self.RECONNECTING++;

            var msReconn = 5000;
            alert("Server connection failed/broken, reconnecting in "
                + msReconn / 1000 + " seconds");

            // Try to reconnect
            setTimeout(function () {
                self.RECONNECTING = 0;
                self.connect(self.URL, self.USERCALLBACK);
            }, msReconn);
        }
    };

    self.onInvalidProtocolVersion = function () {
        // Send message with error
        alert("Please update WRRS version - simply refreshing this page may help (F5)");

        // Reload page
        setTimeout(function () {
            window.location.reload(true);
        }, 3000);
    };

    /* Example of possible callback */
    self.sampleCallback = function (R, successCallback) {
        if (R.STATE === R.NWSTATES.CONNECT_TIMEOUT) {
            R.reconnect();
        } else if (R.STATE === R.NWSTATES.SUCCESS_CONNECT_WITH_DATASETSTREE) {
            successCallback();
        } else if (R.STATE === R.NWSTATES.SUCCESS_CONNECT_WITHOUT_DATASETSTREE) {
            successCallback();
        } else if (R.STATE === R.NWSTATES.ERROR_INVALID_VERSIONS) {
            R.onInvalidProtocolVersion();
        } else if (R.STATE === R.NWSTATES.ERROR_CORRUPTED_DATASETS_TREE) {
            R.onInvalidProtocolVersion();
        } else if (R.STATE === R.NWSTATES.ERROR_SOCKET_CLOSED) {
            R.reconnect();
        } else if (R.STATE === R.NWSTATES.NORMAL_SOCKET_CLOSE) {
            // OK
        } else if (R.STATE === R.NWSTATES.NETWORK_ERROR) {
            R.reconnect();
        }
    };
    // } -----

    /*   Queries sent to server and waiting for reply.

     Query id is generated automatically to guarantee
     conflicts in future (passing same ID for distinct queries).
     It is only possible to retrieve a query by a given ID, not to
     add a query with given ID.
     */
    self.QueryPool = new function () {
        var queries = {};
        var queryId = 0;

        this.addQuery = function (query) {
            queryId++;
            query.requestId = queryId;
            queries[queryId] = query;
            return queryId;
        };

        this.getQueryById = function (id) {
            return queries[id];
        };

        this.removeQuery = function (id) {
            delete queries[id];
        }
    };

    self.newRequest = function (params) {
        if (params === undefined) {
            throw new Error("Cannot create request without parameters");
        }

        if (params.datasetId === undefined) {
            throw new Error("No dataset specified");
        }

        if (params.datetime === undefined) {
            throw new Error("No datetime specified");
        }

        var Q = new self.Request(params);

        return Q;
    };

    self.Request = function (params) {
        var self = this;

        self.datasetId = params.datasetId;
        self.datetime = params.datetime;

        /* Assigned by QueryPool */
        self.requestId = undefined;

        /* Resulting response */
        self.response = undefined;

        /* Invoked only when reponse was matched with query pool request */
        self.usercallback = undefined;

        self.STATES = {
            CREATED: 0,
            SENT: 1,            // sent to server
            RESPONDED: 2,       // received response from server
            TIMEOUT: 3,         // no response from server in given threshould
            TIMEOUT_RESPONSE: 4 // received, but after timeout
        };

        self.STATE = self.STATES.CREATED;

        self.toProtoBuf = function (R) {
            if (self.requestId === undefined) {
                throw new Error("Query ID not assigned, use QueryPool before");
            }

            var RasterRequest = new R.PROTOBUF.RasterRequest();
            var RequestResponseMeta = new R.PROTOBUF.RequestResponseMeta();
            var RequestParams = new R.PROTOBUF.RequestParams();
            var TimeInterval = new R.PROTOBUF.TTimeInterval();

            RequestResponseMeta.setRequestId(self.requestId);
            RasterRequest.setRequestResponseMeta(RequestResponseMeta);

            TimeInterval.setTimeStartMillis(params.datetime);
            TimeInterval.setTimeEndMillis(params.datetime);
            RequestParams.setTimeInterval(TimeInterval);
            RequestParams.setDatasetId(self.datasetId);
            RasterRequest.setRequestParams(RequestParams);

            return RasterRequest;
        };

        self.setUserCallback = function (callback) {
            self.usercallback = callback;
        }

        /* params = {State, RasterResponse} */
        self.onResponse = function (params) {
            if (self.usercallback) {
                self.usercallback(params);
            }
        }
    };

    self.sendRequest = function (Query) {
        if ( self.STATE !== self.NWSTATES.SUCCESS_CONNECT_WITH_DATASETSTREE &&
             self.STATE !== self.NWSTATES.SUCCESS_CONNECT_WITHOUT_DATASETSTREE ) {
            throw new Error("Cannot send request, inappropriate state: " + self.STATE);
        }

        self.QueryPool.addQuery(Query);
        var PB = Query.toProtoBuf(self);

        self.log(" sending request: " + JSON.stringify(Query));

        self.socket.send(PB.toArrayBuffer());
        Query.STATE = Query.STATES.SENT;

        /* Timeout */
        setTimeout(function () {
            if (Query.STATE === Query.STATES.SENT) {
                Query.STATE = Query.STATES.TIMEOUT;
                Query.onResponse({
                    State: self.IOSTATES.ON_RESPONSE_TIMEOUT
                });
            }
        }, self.IO_TIMEOUT_THRESHOULD);
    };

    self.onRasterResponse = function (event) {
        var reader = new FileReader();

        reader.onload = function () {
            var uint8Array = new Uint8Array(this.result);
            var response = {};
            try {
                response = self.PROTOBUF.RasterResponse.decode(uint8Array);
            } catch (err) {
                self.logErr("Corrupted protobuf, possibly client and server versions are different; " + err);
                self.alterState(self.IOSTATES.ON_ERROR_DECODE_RESPONSE);
                return;
            }

            var Q = {};
            if (response.getRequestResponseMeta() != null) {
                var requestId = response.getRequestResponseMeta().getRequestId();
                Q = self.QueryPool.getQueryById(requestId);
                if (Q) {
                } else {
                    self.logErr("Cannot match RasterResponse with handler");
                    self.alterIOState({
                        state: self.IOSTATES.ON_NO_REQUEST_IN_POOL,
                        RasterResponse: response
                    });
                    return;
                }
            } else {
                self.logErr("Response without 'requestId'");
                self.alterIOState({
                    state: self.IOSTATES.ON_NO_RESPONSE_HANDLER,
                    RasterResponse: response
                });
                return;
            }

            if (Q.STATE === Q.STATES.TIMEOUT) {
                Q.STATE = Q.STATES.TIMEOUT_RESPONSE;
            } else {
                Q.STATE = Q.STATES.RESPONDED;
            }

            var responseStatus = null;
            var rasterAttributes = response.rasterAttributes;
            var rasterDimensions = response.rasterDimensions;
            var rasterData = null;

            if (response.getResponseStatus() != null) {
                responseStatus = {};

                var code = response.getResponseStatus().getCode();
                if (code !== 0) {
                    Q.onResponse({
                        State: self.IOSTATES.ON_SERVER_ERROR,
                        RasterResponse: response
                    });
                    return;
                }

                responseStatus.status = code;
            }

            if (response.rasterData != null && response.rasterDimensions != null) {
                try {
                    rasterData =
                        self.parseNDarray(
                            response.rasterDimensions,
                            response.rasterData.data);
                } catch (err) {
                    Q.onResponse({
                        State: self.IOSTATES.ON_ERROR_PARSING_NDARRAY,
                        RasterResponse: response,
                        Error: err
                    });
                }
            }

            Q.response = {
                responseStatus: responseStatus,
                rasterData: rasterData,
                rasterDimensions: rasterDimensions,
                rasterAttributes: rasterAttributes
            };

            self.QueryPool.removeQuery(Q.requestId);

            Q.onResponse({
                State: self.IOSTATES.ON_SUCCESS_RESPONSE,
                RasterResponse: response
            });
        };

        reader.readAsArrayBuffer(event.data);
    };

    self.parseNDarray = function (dimensions, array) {
        var dims = Object.keys(dimensions);
        var shape = [];
        try {
            dims.forEach(function (key, index) {
                var dim = dimensions[key];
                if (dim) {
                    if (dim.index == null || dim.values == null) {
                        throw new Error("'index' or 'values' not defined");
                    } else if (isNumeric(dim.index) && dim.index >= 0) {
                        if (shape[dim.index] !== undefined) {
                            throw new Error("Already have dim with index " + dim.index);
                        } else {
                            shape[dim.index] = dim.values.length;
                        }
                    } else {
                        throw new Error("'index' or 'values' not numeric: " +
                            dim.index + " " + dim.values);
                    }
                }
            });
        } catch (err) {
            throw new Error("Some dimensions are improperly formed: " +
                err + " " +
                JSON.stringify(dimensions));
        }

        var number = 1;
        for (var i = 0; i < shape.length; i++) {
            try {
                if (!isNumeric(shape[i])) {
                    throw new Error("Incorrect shape: " +
                        JSON.stringify(shape) + " " +
                        JSON.stringify(dimensions));
                }

                number = number * shape[i];
            } catch (err) {
                throw new Error("Incorrect shape: " +
                    JSON.stringify(shape) + " " +
                    JSON.stringify(dimensions));
            }
        }

        function isNumeric(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        }

        if (number !== array.length) {
            throw new Error("Incorrect length: " + number + " VS " + array.length);
        }

        var idx = 0;
        var nDarr = recursivelyCreate(undefined, array, 0);

        return nDarr;

        function recursivelyCreate(dst, src, si) {
            if (dst === undefined) {
                dst = new Array(shape[si]);
            }

            if (si < shape.length - 1) {
                for (var i = 0; i < shape[si]; i++) {
                    dst[i] = new Array(shape[si + 1]);
                    recursivelyCreate(dst[i], src, si + 1);
                }

                return dst;
            } else {
                for (var i = 0; i < shape[si]; i++) {
                    dst[i] = src[idx];
                    idx++;
                }

                return dst;
            }
        }
    }
}