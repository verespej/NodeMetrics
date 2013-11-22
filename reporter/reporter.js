var dbConfig = require('./db_config.json');
var db       = require('nano')(generateDbUrl(dbConfig));
var _        = require('underscore');

// TODO Externalize
var DESIGN         = 'metrics';
var VIEW           = 'byworker_metric_time_withval_stats';

var GROUP_LEVEL    = 8 // group by seconds; 
var DEFAULT_WINDOW = 30 // minutes

function generateDbUrl(config) {
	var url = config.scheme + '://' 
		+ config.credentials.username + ':' 
		+ config.credentials.password + '@'
		+ config.credentials.username + '.' + config.host;

	if (config.database) url += '/' + config.database;

	return url;
}

var getMetric = exports.getMetric = function (host, metric, timeWindow, params, callback) {
	if (!callback) {
		callback = params;
		params = null;
	}

	console.log({ host: host, metric: metric, timeWindow: timeWindow });
	var endTime   = new Date;
	var startTime = new Date(endTime);
	startTime.setMinutes(startTime.getMinutes() - (timeWindow || DEFAULT_WINDOW));

	db.view(DESIGN, VIEW, 
		{	stale: 'ok',
			group_level: GROUP_LEVEL,
			endkey: [host, metric, 
				endTime.getUTCFullYear(), endTime.getUTCMonth(), endTime.getUTCDate(),
				endTime.getUTCHours(), endTime.getUTCMinutes(), 
				endTime.getUTCSeconds(), endTime.getUTCMilliseconds() ],
			startkey: [host, metric, 
				startTime.getUTCFullYear(), startTime.getUTCMonth(), startTime.getUTCDate(),
				startTime.getUTCHours(), startTime.getUTCMinutes(), 
				startTime.getUTCSeconds(), startTime.getUTCMilliseconds() ]

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

// getMetric('10.104.212.7p52587', 'CPU', console.log)
// getMetric('worker1', 'CPU', console.log)

