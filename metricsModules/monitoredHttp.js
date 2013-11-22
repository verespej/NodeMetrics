function MonitoredHttp(http) {
	this.log = [];
	this.timeOfLastCheck = new Date().getTime();

	var origEntry = http.createServer;
	var monitor = this;
	http.createServer = function(callback) {
		return origEntry.call(this, function(req, res) {
			req.startTime = new Date().getTime();
			var origEnd = res.end;
			res.end = function() {
				origEnd.call(this);
				var endTime = new Date().getTime();
				monitor.log.push({
					name: 'request',
					val: endTime - req.startTime,
					unit: 'ms'
				});
			};
			callback(req, res);
		});
	};
}

MonitoredHttp.prototype.getAndClearLog = function() {
	var requestLog = this.log;
	this.log = [];

	var currCheckTime = new Date().getTime();
	var timeInterval = currCheckTime - this.timeOfLastCheck;
	this.timeOfLastCheck = currCheckTime;

	return {
		timespan: timeInterval,
		requestLog: requestLog
	};
}

exports.MonitoredHttp = function(http) {
	return new MonitoredHttp(http);
}

