/** (c) 2016 by Antonio Rodriges, rodriges@wikience.org */

describe('WRRS Query Pool tests', function () {
    it('Should create and register query', function () {
        var R = new WRRS();

        var Q = new R.newRequest({datasetId: "merra.tavg1_2d_rad_Nx.T", datetime: 0});

        R.QueryPool.addQuery(Q);

        expect(Q.requestId).to.equal(1);
        expect(Q.datasetId).to.equal("merra.tavg1_2d_rad_Nx.T");
        expect(Q.datetime).to.equal(0);
    });

    it('Should convert query to protobuf RasterRequest', function () {
        var R = new WRRS();

        var Q = R.newRequest({datasetId: "merra.tavg1_2d_rad_Nx.T", datetime: 0});

        R.QueryPool.addQuery(Q);
        var B = Q.toProtoBuf(R);

        expect(B.getRequestResponseMeta().getRequestId()).to.equal(1);
        expect(B.getRequestParams().getDatasetId()).to.equal("merra.tavg1_2d_rad_Nx.T");

        var start = B.getRequestParams().getTimeInterval().getTimeStartMillis();
        var end = B.getRequestParams().getTimeInterval().getTimeEndMillis();

        expect(dcodeIO.Long.fromValue(0).compare(start)).to.equal(0);
        expect(dcodeIO.Long.fromValue(0).compare(end)).to.equal(0);
    });
});
