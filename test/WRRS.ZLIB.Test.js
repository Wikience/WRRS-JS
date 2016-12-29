/** (c) 2016 by Antonio Rodriges, rodriges@wikience.org */

describe('Test pako ZLIB', function () {
    it('Should pack/unpack data', function (done) {
        var R = new WRRS();
        var data = new R.PROTOBUF.RasterData();
        var arr = new Uint8Array([1, 2, 3]);
        var output = pako.deflate(arr, {level: 9});
        data.setDataCompressed(output);
        console.log(data);

        var packed = data.toArrayBuffer();
        var decodeDataMsg = R.PROTOBUF.RasterData.decode(packed);
        var decArr = new Uint8Array(decodeDataMsg.getDataCompressed().toBuffer());
        var decompressed = pako.inflate(decArr);
        console.log(decArr.length);
        console.log(decompressed.length);

        done();
    });

    it('Should receive compressed data', function (done) {
        var R = new WRRS();

        var callback = function (state) {
            if (state === R.NWSTATES.SUCCESS_CONNECT_WITH_DATASETSTREE) {
                var Q = R.newRequest({datasetId: "no", datetime: 0});
                Q.setFlag(PTEST.COMPRESS_TEST);
                Q.setNDarrayParseFlag(false);
                Q.setUserCallback(function () {
                    var arrStr = JSON.stringify(Q.response.rasterData);
                    console.log("Received response: " + arrStr);
                    // expect(arrStr).to.equal("[1,2,3]");
                    expect(arrStr).to.equal("{\"0\":1,\"1\":2,\"2\":3}");
                    done();
                });
                R.sendRequest(Q);
            } else {
                done("Connect should be successful " + state);
            }
        };

        try {
            R.connect(testServerURL, callback);
        } catch (err) {
            done(err);
        }
    });
});