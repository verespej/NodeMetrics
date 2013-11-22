var ci = require('./cpuInfo.js');
var cpuInfo = new ci.CpuInfo();

setInterval(function() {
	var cpuUsage = cpuInfo.usage();
	var totalPercentUsage = 0;
	for (var i = 0; i < cpuUsage.length; i++) {
		totalPercentUsage += cpuUsage[i].percentUsage;
	}

	console.log({
		id: 'worker1:2013112117400000',
		worker_id: 'worker1',
		timestamp: [2013, 11, 21, 17, 40, 00, 000],
		type: 'interval',
		metrics: [
			{
				name: 'CPU',
				val: totalPercentUsage / cpuUsage.length,
				unit: '%'
			}
		]
	});
}, 2000);

