var dbConfig = require('./db_config.json');
var db       = require('nano')(generateDbUrl(dbConfig));
var _        = require('underscore');

// TODO Externalize
var DESIGN         = 'metrics';
var VIEW           = 'byworker_metric_time_withval_stats';

var Units = {
	ms:      { multiplier: 1,         groupBy: 9 },
	sec:     { multiplier: 1e3,       groupBy: 8 },
	min:     { multiplier: 6e4,       groupBy: 7 },
	hours:   { multiplier: 60*6e4,    groupBy: 6 },
	days:    { multiplier: 24*60*6e4, groupBy: 5 }   
};

// Provide aliases
Units.seconds = Units.s = Units.sec;
Units.minutes = Units.m = Units.min;
Units.hr      = Units.hours;
Units.d       = Units.days;

var Defaults = {
	units:      Units.seconds,
	timeWindow: 30
};

function generateDbUrl(config) {
	var url = config.scheme + '://' 
		+ config.credentials.username + ':' 
		+ config.credentials.password + '@'
		+ config.credentials.username + '.' + config.host;

	if (config.database) url += '/' + config.database;

	return url;
}

var getMetric = exports.getMetric = function (host, metric, options, callback) {
	if (!callback) {
		callback = options;
		options  = {};
	}

	if (options.units && !Units[options.units]) {
		return callback(new Error('No such unit ' + options.units));
	}

	var units      = Units[options.units] || Defaults.units;
	var timeWindow = options.timeWindow || Defaults.timeWindow;

	var interval  = timeWindow * units.multiplier;
	var endTime   = new Date;
	var startTime = new Date(endTime);

	startTime.setTime(startTime.getTime() - interval);

	console.log({ 
		host: host, 
		metric: metric, 
		timeWindow: timeWindow, 
		units: units,
		interval: interval,
		startTime: startTime,
		endTime: endTime 
	});

	db.view(DESIGN, VIEW, 
		{	stale: 'ok',
			group_level: units.groupBy,
			startkey: [host, metric, 
				startTime.getUTCFullYear(), startTime.getUTCMonth(), startTime.getUTCDate(),
				startTime.getUTCHours(), startTime.getUTCMinutes(), 
				startTime.getUTCSeconds(), startTime.getUTCMilliseconds() ],
			endkey: [host, metric, 
				endTime.getUTCFullYear(), endTime.getUTCMonth(), endTime.getUTCDate(),
				endTime.getUTCHours(), endTime.getUTCMinutes(), 
				endTime.getUTCSeconds(), endTime.getUTCMilliseconds() ],

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
getMetric('worker1', 'CPU', console.log)

