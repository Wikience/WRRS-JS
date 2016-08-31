/** (c) 2016 by Antonio Rodriges, rodriges@wikience.org */

describe('WRRS Request I/O tests', function () {
    it('Should receive raster data', function (done) {
        var R = new WRRS();

        var callback = function (state) {
            if (state === R.NWSTATES.SUCCESS_CONNECT_WITH_DATASETSTREE) {
                var Q = R.newRequest({datasetId: "merra.tavg1_2d_rad_Nx.T", datetime: 347932800000});
                Q.setUserCallback(function () {
                    console.log("Received response");
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