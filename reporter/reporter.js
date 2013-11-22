var dbConfig = require('./db_config.json');
var db       = require('nano')(generateDbUrl(dbConfig));

function generateDbUrl(config) {
	var url = config.scheme + '://' 
		+ config.credentials.username + ':' 
		+ config.credentials.password + '@'
		+ config.credentials.username + '.' + config.service;

	if (config.database) url += '/' + config.database;

	return url;
}

var getMetrics = exports.getMetrics = function (params, callback) {
	if (!callback) {
		callback = params;
		params = null;
	}

	db.view('metrics', 'byworker_metric_time_withval_stats', 
		{ limit: 10, reduce: false }, 
		function(err, body) {
			if (err) return err;
			callback(body.rows);
	});
}
