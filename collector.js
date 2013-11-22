var ci = require('./cpuInfo.js');
var cpuInfo = new ci.CpuInfo(2000);

setInterval(function() {
	var result = cpuInfo.usage();
	console.log(result);
}, 2000);

