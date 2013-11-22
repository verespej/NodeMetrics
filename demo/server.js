var http = require('http');
var mh = require('../metricsModules/monitoredHttp.js').MonitoredHttp(http);
var ci = require('../metricsModules/cpuInfo.js').CpuInfo();
var bm = require('../metricsModules/baseMetric.js');
var nano = require('nano')('https://nodemetrics:msopentechhackathon@nodemetrics.cloudant.com')
   , db_name = "workerdata"
   , db      = nano.use(db_name);

var server = http.createServer(function(req, res) {
	setTimeout(function() {
		res.writeHeader(200, { 'Content-Type': 'text/plain' });
		res.write('Test output!');
		res.end();
	}, 2000);
}).listen(8123);

setInterval(function() {
	var docs = [];

	// CPU
	var cpuUsage = ci.usage();
	var totalPercentUsage = 0;
	for (var i = 0; i < cpuUsage.length; i++) {
		totalPercentUsage += cpuUsage[i].percentUsage;
	}
	docs.push(bm.createMetricsDoc('interval',
    [{
			name: 'CPU',
			val: totalPercentUsage / cpuUsage.length,
			unit: '%'
		}]
	));

	// Requests
	var log = mh.getAndClearLog().requestLog;
	for (var i = 0; i < log.length; i++) {
		docs.push(bm.createMetricsDoc(
			'event',
			[log[i]]
		));
	}

	// Add to DB
	if (docs.length > 0) {
		db.bulk({ docs: docs }, function (error, body, headers) {
			if (error) { 
				console.log('ERROR inserting docs: ' + error); 
			} else {
				console.log('Insert Doc Successful', docs);
			}
		});
	}

}, 5000);

console.log('Runnning server at http://127.0.0.1:8123');

