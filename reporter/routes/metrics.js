var reporter = require('../reporter');

/*
 * GET users listing.
 */

exports.list = function(req, res) {
	reporter.getMetrics(function(rows) {
		res.json(rows);
	});
};
