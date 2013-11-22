function MonitoredHttp() {
	this.log = [];
	this.timeOfLastCheck = new Date().getTime();
}

MonitoredHttp.prototype.monitor = function(http) {
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
					id: 'worker1:2013112117400000',
					worker_id: 'worker1',
					timestamp: [2013, 11, 21, 17, 40, 00, 000],
					type: 'event',
					metrics: [
						{
							name: 'request',
							val: endTime - req.startTime,
							unit: 'ms'
						}
					]
				});
			};
			callback(req, res);
		});
	};
};

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

exports.MonitoredHttp = MonitoredHttp;

