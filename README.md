WRRS-JS is WRRS JavaScript Client

WRRS &mdash; Web Raw Raster Service
-----------------------------------
New network protocol based on WebSocket and Google Protocol Buffers for **source (raw) raster data** delivery to Web browsers.

![WRRS &mdash; Web Raw Raster Service](http://www.wikience.org/wrrs/WRRS.png)


Motivation
----------
Web applications are increasingly gaining popularity, especially in domains rich for raster data like climate reanalysis and remote sensing. To date, raster manipulations in web browsers are limited only to imagery display rendered at server side. Even trivial tasks like tuning image color palette force extensive client-server interaction. This increases network traffic, response times and negatively impacts user experience. Existing protocols deliver raster data over HTTP in file formats that are too complex for JavaScript (e.g., NetCDF) or too large when they carry raster data (e.g., CSV). However, modern JavaScript has enough technologies for efficient raw raster data rendering, transmission and processing. WRRS delivers source (raw) raster data to browser-based JavaScript web clients. It leverages WebSocket for tight binary data exchange with web browsers and Google Protocol Buffers for structured storage of diverse raster data types. WRRS will facilitate migrating traditional raster operations from desktop software to web browsers and their execution without server interaction (e.g., display source values for given area, build isolines, scatterplots, apply map algebra, resampling, binning, etc.).
 
WRRS in Action
--------------

Web Climate Wikience http://climate.wikience.org visualizes gridded data in 3D and demonstrates some benefits of using WRRS.

![Web Climate Wikience](http://www.wikience.org/wrrs/Figure9.png)
<p align="center">3D visualization of NASA MERRA2 air temperature for 10.01.1981 00:00 GMT+00:00</p>

Try dragging color gradient controls to see immediate repainting of the picture with new colors and without any server interaction and network traffic.

Documentation
-------------
Paper to be published. 

WRRS Sample Server
------------------
Sample Java WRRS Server is available at https://github.com/Wikience/RServer

Include into HTML
-----------------
When including WRRS-JS into an HTML page, be sure to include libraries in correct order.
 For example:

```
<script src="/WRRS/bson.js"></script>
<script src="/WRRS/long.min.js"></script>
<script src="/WRRS/bytebuffer.min.js"></script>
<script src="/WRRS/protobuf.min.js"></script>
<script src="/WRRS/WRRS.proto.js"></script>
<script src="/WRRS/WRRS.js"></script>
```

Tests
-----
Karma-Mocha-Chai are used to test WRRS-JS, see "test" folder and "karma.conf.js".
Before running tests, launch sample WRRS Java Server (see above).

The output should look like this:

```
WRRS: WebSocket connection established
WRRS: Successful client-server handshake with datasets tree
{"group":{"name":"merra","group":[{"name":"tavg1_2d_rad_Nx","group":{"missingdate":{"start":"26.12.1980","end":"29.12.1980"},"name":["T","Temperature"],"icon":"temperature.png","dates":{"start":"20.12.1980","end":"10.01.1981"}}},{"name":"tavg1_2d_slv_Nx","group":{"name":["T10M","Temperature"],"icon":"temperature.png","dates":{"start":"01.01.1980","end":"30.04.1980"}}},{"name":"tavg1_2d_slv_Nx","group":{"missingdate":{"start":"16.07.2009","end":"18.07.2009"},"name":["T2M","Temperature"],"icon":"temperature.png","dates":{"start":"01.07.2009","end":"22.07.2009"}}},{"name":"tavg1_2d_rad_Nx","group":{"name":["QV","Precipitation"],"icon":"precipitation.png","dates":{"start":"01.01.2005","end":"10.01.2005"}}},{"name":"tavg1_2d_rad_Nx","group":{"missingdate":{"start":"26.01.2000","end":"29.01.2000"},"name":["O3","Ozone"],"icon":"ozone.png","dates":{"start":"15.01.2000","end":"09.02.2000"}}},{"name":"tavg1_2d_rad_Nx","group":{"missingdate":{"start":"22.09.2000","end":"22.09.2000"},"name":["PS","Pressure"],"icon":"pressure.png","dates":{"start":"20.09.2000","end":"10.10.2000"}}},{"name":"tavg1_2d_rad_Nx","group":{"name":["U","Wind"],"icon":"wind.png","dates":{"start":"01.01.2005","end":"10.01.2005"}}}]}}
[{"id":"merra.tavg1_2d_rad_Nx.T","name":"Temperature","icon":"temperature.png","date":{"start":"20.12.1980","end":"10.01.1981"},"missingdates":[["26.12.1980","29.12.1980"]]},{"id":"merra.tavg1_2d_slv_Nx.T10M","name":"Temperature","icon":"temperature.png","date":{"start":"01.01.1980","end":"30.04.1980"},"missingdates":[]},{"id":"merra.tavg1_2d_slv_Nx.T2M","name":"Temperature","icon":"temperature.png","date":{"start":"01.07.2009","end":"22.07.2009"},"missingdates":[["16.07.2009","18.07.2009"]]},{"id":"merra.tavg1_2d_rad_Nx.QV","name":"Precipitation","icon":"precipitation.png","date":{"start":"01.01.2005","end":"10.01.2005"},"missingdates":[]},{"id":"merra.tavg1_2d_rad_Nx.O3","name":"Ozone","icon":"ozone.png","date":{"start":"15.01.2000","end":"09.02.2000"},"missingdates":[["26.01.2000","29.01.2000"]]},{"id":"merra.tavg1_2d_rad_Nx.PS","name":"Pressure","icon":"pressure.png","date":{"start":"20.09.2000","end":"10.10.2000"},"missingdates":[["22.09.2000","22.09.2000"]]},{"id":"merra.tavg1_2d_rad_Nx.U","name":"Wind","icon":"wind.png","date":{"start":"01.01.2005","end":"10.01.2005"},"missingdates":[]}]
SUCCESS WRRS HANDSHAKE tests Should receive datasets tree
WRRS: WebSocket connection established
WRRS: Successful client-server handshake without datasets tree
SUCCESS WRRS HANDSHAKE tests Should *not* receive datasets tree
WRRS: WebSocket connection established
WRRS: ERROR client and server versions do not coincide
SUCCESS WRRS HANDSHAKE tests Should receive version error
WRRS: WebSocket connection established
SUCCESS WRRS HANDSHAKE tests Should timeout
WRRS: WebSocket connection established
WRRS: ERROR Datasets tree corrupted, possible version mismatch; Error: corrupt bson message
SUCCESS WRRS HANDSHAKE tests Should return corrupted datasets tree
SUCCESS WRRS Query Pool tests Should create and register query
SUCCESS WRRS Query Pool tests Should convert query to protobuf RasterRequest
WRRS: WebSocket connection established
WRRS: Successful client-server handshake with datasets tree
WRRS:  sending request: {"datasetId":"merra.tavg1_2d_rad_Nx.T","datetime":347932800000,"requestId":1,"STATES":{"CREATED":0,"SENT":1,"RESPONDED":2,"TIMEOUT":3,"TIMEOUT_RESPONSE":4},"STATE":0}
Received response
SUCCESS WRRS Request I/O tests Should receive raster data
Parsing [1,2,3,4,5,6]
Result: [[1,2],[3,4],[5,6]]
Parsing [1,2,3,4,5,6]
Result: [[[1,2]],[[3,4]],[[5,6]]]
Parsing [1,2,3,4,5,6]
Result: [[[1],[2]],[[3],[4]],[[5],[6]]]
Parsing [1,2,3,4,5,6]
Result: [1,2,3,4,5,6]
Parsing [1,2,3,4,5,6]
OK (error caught)
SUCCESS WRRS nD array parser tests Should parse 2D array
Skipped 0 tests
```

Author
------
[Antonio Rodriges](http://www.wikience.org/rodriges/) (developer & maintainer).

**License:** [Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0.html)