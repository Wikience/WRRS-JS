/** (c) 2016 by Antonio Rodriges, rodriges@wikience.org */

describe('WRRS nD array parser tests', function () {
    it('Should parse 2D array', function () {
        var R = new WRRS();

        var _1Darr = [1, 2, 3, 4, 5, 6];

        var dims = {
            lat:{
                index: 0,
                values: [0, 1, 2]
            },
            lon:{
                index: 1,
                values: [0, 1]
            }
        };

        prepare(R, dims, _1Darr, "[[1,2],[3,4],[5,6]]");

        var dims = {
            lat:{
                index: 0,
                values: [0, 1, 2]
            },
            lon:{
                index: 1,
                values: [0]
            },
            z: {
                index: 2,
                values: [0, 1]
            }
        };

        prepare(R, dims, _1Darr, "[[[1,2]],[[3,4]],[[5,6]]]");

        var dims = {
            lat:{
                index: 0,
                values: [0, 1, 2]
            },
            lon:{
                index: 1,
                values: [0, 1]
            },
            z: {
                index: 2,
                values: [0]
            }
        };

        prepare(R, dims, _1Darr, "[[[1],[2]],[[3],[4]],[[5],[6]]]");

        var dims = {
            lat:{
                index: 0,
                values: [0, 1, 2, 3, 4, 5]
            },
        };

        prepare(R, dims, _1Darr, "[1,2,3,4,5,6]");

        var dims = {
            lat:{
                index: 0,
                values: [0, 1, 2, 3, 4, 5]
            },

            lon:{
                index: 0,
                values: [0, 1, 2, 3, 4, 5]
            },
        };

        try {
            prepare(R, dims, _1Darr, "");
            throw new Error("Should throw error");
        } catch(err) {
            console.log("OK (error caught)");
        }
    });
});

function prepare(R, dims, arr, json_result) {
    console.log("Parsing " + JSON.stringify(arr));

    var result = R.parseNDarray(dims, arr);
    var json = JSON.stringify(result);
    console.log("Result: " + json);

    expect(json).to.equal(json_result);
}