var os = require('os');

function CpuInfo() {
	this.lastCpus = os.cpus();
	this.currCpus = os.cpus();
	this.timeOfLastCheck = new Date().getTime();
}

CpuInfo.prototype.usage = function() {
	var lastCpus = this.currCpus;
	this.currCpus = os.cpus();
	var currCpus = this.currCpus;

	var currCheckTime = new Date().getTime();
	var timeInterval = currCheckTime - this.timeOfLastCheck;
	this.timeOfLastCheck = currCheckTime;

	var result = [];
	for (var i = 0; i < currCpus.length; i++) {
		var totalTime = 0;
		for (var prop in currCpus[i].times) {
			totalTime += currCpus[i].times[prop] - lastCpus[i].times[prop];
		}
		var idleTime = currCpus[i].times.idle - lastCpus[i].times.idle;
		var percentUsage = totalTime <= 0 ? 0 : 100 * (totalTime - idleTime) / totalTime;

		result.push({
			timespan: timeInterval,
			timeTotal: totalTime,
			timeIdle: idleTime,
			percentUsage: percentUsage
		});
	}

	return result;
};

exports.CpuInfo = function() {
	return new CpuInfo();
}

