var dbConfig = require('./db_config.json');
var db       = require('nano')(generateDbUrl(dbConfig));
var _        = require('underscore');

// TODO Externalize
var DESIGN   = 'metrics';
var VIEW     = 'byworker_metric_time_withval_stats';

function generateDbUrl(config) {
	var url = config.scheme + '://' 
		+ config.credentials.username + ':' 
		+ config.credentials.password + '@'
		+ config.credentials.username + '.' + config.host;

	if (config.database) url += '/' + config.database;

	return url;
}

var getMetrics = exports.getMetrics = function (params, callback) {
	if (!callback) {
		callback = params;
		params = null;
	}

	// generate start key
	// generate stop key (?)

	db.view(DESIGN, VIEW, 
		{ limit: 10, 
			group_level: 5
		//	reduce: false 
		}, 
		function(err, body) {
			callback(err, body.rows);
		}
	);
};

var getHostsAndMetricTypes = exports.getHostsAndMetricTypes = function(callback) {
	db.view(DESIGN, VIEW, 
		{ group_level: 2 },
		function(err, body) {
			var i
			  , metrics = {};
			
			if (err) return callback(err);

			body.rows.forEach(function(row) {
				var host   = row.key[0];
				var metric = row.key[1];

				if (!metrics[host]) {
					metrics[host] = [metric];
				} else {
					metrics[host].push(metric);
				}
			});

			callback(null, metrics);
		}
	);
};

var getHosts = exports.getHosts = exports.getHosts = function(callback) {
	getHostsAndMetricTypes(function(err, metrics) {
		if (err) return callback(err);
		callback(null, _.keys(metrics));
	})
}
