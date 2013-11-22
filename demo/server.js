var http = require('http');
var mh = new require('../metricsModules/monitoredHttp.js');
var monitoredHttp = new mh.MonitoredHttp();
monitoredHttp.monitor(http);

var server = http.createServer(function(req, res) {
	setTimeout(function() {
		res.writeHeader(200, { 'Content-Type': 'text/plain' });
		res.write('Test output!');
		res.end();
	}, 2000);
}).listen(8123);

setInterval(function() {
	console.log(monitoredHttp.getAndClearLog());
}, 5000);

console.log('Runnning server at http://127.0.0.1:8123');

