var wrrsprotobuf = dcodeIO.ProtoBuf.newBuilder({})['import']({
    "package": "org.wikience.wrrs.wrrsprotobuf",
    "options": {
        "java_outer_classname": "RProtocol"
    },
    "messages": [
        {
            "name": "ConnectRequest",
            "fields": [
                {
                    "rule": "optional",
                    "type": "int32",
                    "name": "clientID",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "int32",
                    "name": "protocolVersion",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "retrieveDatasetTree",
                    "id": 3
                }
            ]
        },
        {
            "name": "RasterRequest",
            "fields": [
                {
                    "rule": "optional",
                    "type": "RequestResponseMeta",
                    "name": "requestResponseMeta",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "IncludeRequestMeta",
                    "name": "includeRequestMeta",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "RequestParams",
                    "name": "requestParams",
                    "id": 3
                }
            ]
        },
        {
            "name": "RasterResponse",
            "fields": [
                {
                    "rule": "optional",
                    "type": "ResponseStatus",
                    "name": "responseStatus",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "RequestResponseMeta",
                    "name": "requestResponseMeta",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "RequestParams",
                    "name": "requestParams",
                    "id": 3
                },
                {
                    "rule": "optional",
                    "type": "RasterAttributes",
                    "name": "rasterAttributes",
                    "id": 4
                },
                {
                    "rule": "optional",
                    "type": "RasterDimensions",
                    "name": "rasterDimensions",
                    "id": 5
                },
                {
                    "rule": "optional",
                    "type": "RasterData",
                    "name": "rasterData",
                    "id": 6
                },
                {
                    "rule": "optional",
                    "type": "ResponseStatistics",
                    "name": "statistics",
                    "id": 7
                }
            ]
        },
        {
            "name": "RequestResponseMeta",
            "fields": [
                {
                    "rule": "optional",
                    "type": "int32",
                    "name": "requestId",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "int32",
                    "name": "flag",
                    "id": 2
                }
            ]
        },
        {
            "name": "IncludeRequestMeta",
            "fields": [
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "includeParams",
                    "id": 1,
                    "options": {
                        "default": false
                    }
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "includeAttributes",
                    "id": 2,
                    "options": {
                        "default": true
                    }
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "includeDimensions",
                    "id": 3,
                    "options": {
                        "default": true
                    }
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "includeRasterData",
                    "id": 4,
                    "options": {
                        "default": true
                    }
                }
            ]
        },
        {
            "name": "ResponseStatus",
            "fields": [
                {
                    "rule": "optional",
                    "type": "int32",
                    "name": "code",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "message",
                    "id": 2
                }
            ]
        },
        {
            "name": "RequestParams",
            "fields": [
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "datasetId",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "TTimeInterval",
                    "name": "timeInterval",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "int32",
                    "name": "zoom",
                    "id": 3,
                    "options": {
                        "default": 0
                    }
                },
                {
                    "rule": "optional",
                    "type": "TLatLonBox",
                    "name": "latlonBox",
                    "id": 4
                }
            ]
        },
        {
            "name": "RasterAttributes",
            "fields": [
                {
                    "rule": "optional",
                    "type": "double",
                    "name": "missingValue",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "double",
                    "name": "addOffset",
                    "id": 2,
                    "options": {
                        "default": 0
                    }
                },
                {
                    "rule": "optional",
                    "type": "double",
                    "name": "scaleFactor",
                    "id": 3,
                    "options": {
                        "default": 1
                    }
                },
                {
                    "rule": "optional",
                    "type": "double",
                    "name": "minValue",
                    "id": 4
                },
                {
                    "rule": "optional",
                    "type": "double",
                    "name": "maxValue",
                    "id": 5
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "units",
                    "id": 6
                }
            ]
        },
        {
            "name": "RasterDimensions",
            "fields": [
                {
                    "rule": "optional",
                    "type": "Dimension1D",
                    "name": "lat",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "Dimension1D",
                    "name": "lon",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "Dimension1Int",
                    "name": "time",
                    "id": 3
                },
                {
                    "rule": "optional",
                    "type": "Dimension1D",
                    "name": "level",
                    "id": 4
                },
                {
                    "rule": "optional",
                    "type": "Dimension2D",
                    "name": "latlon",
                    "id": 5
                }
            ]
        },
        {
            "name": "TLatLonBox",
            "fields": [
                {
                    "rule": "optional",
                    "type": "double",
                    "name": "latitudeNorth",
                    "id": 1,
                    "options": {
                        "default": -90
                    }
                },
                {
                    "rule": "optional",
                    "type": "double",
                    "name": "latitudeSouth",
                    "id": 2,
                    "options": {
                        "default": 90
                    }
                },
                {
                    "rule": "optional",
                    "type": "double",
                    "name": "longitudeEast",
                    "id": 3,
                    "options": {
                        "default": -180
                    }
                },
                {
                    "rule": "optional",
                    "type": "double",
                    "name": "longitudeWest",
                    "id": 4,
                    "options": {
                        "default": 180
                    }
                }
            ]
        },
        {
            "name": "TTimeInterval",
            "fields": [
                {
                    "rule": "optional",
                    "type": "int64",
                    "name": "timeStartMillis",
                    "id": 1,
                    "options": {
                        "default": 0
                    }
                },
                {
                    "rule": "optional",
                    "type": "int64",
                    "name": "timeEndMillis",
                    "id": 2,
                    "options": {
                        "default": 0
                    }
                }
            ]
        },
        {
            "name": "RasterData",
            "fields": [
                {
                    "rule": "optional",
                    "type": "COMPRESSION_METHOD",
                    "name": "compressionMethod",
                    "id": 1,
                    "options": {
                        "default": "NO_COMPRESSION"
                    }
                },
                {
                    "rule": "optional",
                    "type": "int32",
                    "name": "bytesPerElement",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "dataCompressed",
                    "id": 3
                },
                {
                    "rule": "repeated",
                    "type": "double",
                    "name": "data",
                    "id": 4
                }
            ],
            "enums": [
                {
                    "name": "COMPRESSION_METHOD",
                    "values": [
                        {
                            "name": "NO_COMPRESSION",
                            "id": 0
                        },
                        {
                            "name": "ZLIB",
                            "id": 1
                        }
                    ]
                }
            ]
        },
        {
            "name": "ResponseStatistics",
            "fields": [
                {
                    "rule": "optional",
                    "type": "int64",
                    "name": "fileRead_ms",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "int64",
                    "name": "toRGB_ms",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "int64",
                    "name": "toPNG_ms",
                    "id": 3
                },
                {
                    "rule": "optional",
                    "type": "int64",
                    "name": "toZIP_ms",
                    "id": 4
                }
            ]
        },
        {
            "name": "Dimension1D",
            "fields": [
                {
                    "rule": "optional",
                    "type": "int32",
                    "name": "index",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "double",
                    "name": "start",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "double",
                    "name": "step",
                    "id": 3
                },
                {
                    "rule": "optional",
                    "type": "double",
                    "name": "end",
                    "id": 4
                },
                {
                    "rule": "repeated",
                    "type": "double",
                    "name": "values",
                    "id": 5
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "fullname",
                    "id": 6
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "units",
                    "id": 7
                }
            ]
        },
        {
            "name": "Dimension1Int",
            "fields": [
                {
                    "rule": "optional",
                    "type": "int32",
                    "name": "index",
                    "id": 1,
                    "options": {
                        "default": 0
                    }
                },
                {
                    "rule": "optional",
                    "type": "int64",
                    "name": "base",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "int64",
                    "name": "start",
                    "id": 3
                },
                {
                    "rule": "optional",
                    "type": "int64",
                    "name": "step",
                    "id": 4
                },
                {
                    "rule": "optional",
                    "type": "int64",
                    "name": "end",
                    "id": 5
                },
                {
                    "rule": "repeated",
                    "type": "int64",
                    "name": "values",
                    "id": 6
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "units",
                    "id": 7
                }
            ]
        },
        {
            "name": "Dimension2D",
            "fields": [
                {
                    "rule": "repeated",
                    "type": "Point2D",
                    "name": "point2D",
                    "id": 1
                }
            ]
        },
        {
            "name": "Point2D",
            "fields": [
                {
                    "rule": "optional",
                    "type": "double",
                    "name": "lat",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "double",
                    "name": "lon",
                    "id": 2
                }
            ]
        }
    ]
}).build(["org","wikience","wrrs","wrrsprotobuf"]);