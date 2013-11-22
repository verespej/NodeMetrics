var ci = require('./metricsModules/cpuInfo.js');
var cpuInfo = new ci.CpuInfo();

var nano = require('nano')('https://nodemetrics:msopentechhackathon@nodemetrics.cloudant.com')
   , db_name = "workerdata"
   , db      = nano.use(db_name);


//get ipaddress... assume first non-internal ipv4 address...?
var os = require('os')
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
var myid = myadd+'p'+mypid;

setInterval(function() {
	var cpuUsage = cpuInfo.usage();
	var totalPercentUsage = 0;
	for (var i = 0; i < cpuUsage.length; i++) {
		totalPercentUsage += cpuUsage[i].percentUsage;
	}

  var now = new Date();
  doc = {
    _id: myid + ':' + now.toISOString(),
    worker_id: myid,
    ipaddress: addresses[0],
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
    type: 'interval',
    metrics: [
      {
        name: 'CPU',
        val: totalPercentUsage / cpuUsage.length,
        unit: '%'
      }
    ]
  }
  db.insert(doc, function (error, body, headers) {
    
    if(error) { 
      return console.log(error); 
    }
    console.log("Insert Doc Successful");
    console.log(doc);
  });

	
}, 2000);

