// Karma configuration

module.exports = function (config) {
    config.set({
        client: {
            mocha: {
                timeout: 3600000 // for debug purposes
            }
        },

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['mocha'],


        // list of files / patterns to load in the browser
        files: [
            'node_modules/chai/chai.js',
            
            // correct order of libs
            'node_modules/bson/browser_build/bson.js',
            'node_modules/long/dist/long.min.js',
            'node_modules/protobufjs/node_modules/bytebuffer/dist/bytebuffer.min.js',
            'node_modules/protobufjs/dist/protobuf.min.js',

            // alternative way to upload the protocol:
            // {pattern: 'protocol/WRRS.proto', included: false},

            'protocol/WRRS.proto.js',
            'src/*.js',

            // correct order of libs
            'test/WRRS.Common.Test.js',
            'test/WRRS.Handshake.Test.js',
            'test/WRRS.QPool.Test.js',
            'test/WRRS.Request.Test.js',
            'test/WRRS.NDparse.Test.js'
        ],

        // list of files to exclude
        exclude: [],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {},


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Firefox'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity
    })
}
