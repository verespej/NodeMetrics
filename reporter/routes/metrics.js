var reporter = require('../reporter');

/*
 * GET users listing.
 */

exports.metrics = function(req, res) {
	reporter.getMetrics(function(err, rows) {
		if (err) res.send(500, 'Error getting metrics for host');
		res.json(rows);
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
