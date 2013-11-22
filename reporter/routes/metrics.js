var reporter = require('../reporter');

exports.metrics = function(req, res) {
	var workerId   = req.params.workerId; 
	var metricId   = req.params.metricId; 
	var timeWindow = req.params.timeWindow;

	reporter.getMetric(workerId, metricId, timeWindow, function(err, values) {
		if (err) res.send(500, 'Error getting metric ' + metricId + ' for worker ' + workerId);
		res.json(values);
	});
};

exports.hosts = function(req, res) {
	reporter.getHosts(function(err, hosts) {
		if (err) res.send(500, 'Error getting list of hosts');
		res.json(hosts);
	});
}

exports.hostsAndMetrics = function(req, res) {
	reporter.getHostsAndMetricTypes(function(err, metrics) {
		if (err) res.send(500, 'Error getting list of hosts and metrics');
		res.json(metrics);
	});
}
