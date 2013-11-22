var os = require('os');

exports.createMetricsDoc = function(metricType, metrics) {
	if (arguments.length > 0) {
		if (typeof(metricType) !== 'string') {
			console.log('ERROR: Parameter "metricType" must be a string');
			return;
		}
		if (arguments.length > 1) {
			if (!(metrics instanceof Array)) {
				console.log('ERROR: Parameter "metrics" must be an array');
				return;
			}
		} else {
			metrics = [];
		}
	} else {
		metricType = 'unknown';
		metrics = [];
	}

	var interfaces = os.networkInterfaces();
	var addresses = [];
	for (k in interfaces) {
			for (k2 in interfaces[k]) {
					var address = interfaces[k][k2];
					if (address.family == 'IPv4' && !address.internal) {
							addresses.push(address.address)
					}
			}
	}

	var myadd = addresses[0];
	var mypid = process.pid;
	var myid = myadd + 'p' + mypid;
  var now = new Date();

	return {
		_id: myid + ':' + now.toISOString(),
		instance_id: myid,
    ipaddress: myadd,
    pid: mypid,
    timestamp: [
      now.getUTCFullYear(), 
      now.getUTCMonth(), 
      now.getUTCDate(),
      now.getUTCHours(), 
      now.getUTCMinutes(),
      now.getUTCSeconds(), 
      now.getUTCMilliseconds()
    ],
    type: metricType,
    metrics: metrics
	};
};

