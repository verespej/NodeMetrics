var ci = require('./cpuInfo.js');
var cpuInfo = new ci.CpuInfo();

var nano = require('nano')('https://nodemetrics:msopentechhackathon@nodemetrics.cloudant.com')
   , db_name = "workerdata"
   , db      = nano.use(db_name);

var myid = 'worker1';


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

