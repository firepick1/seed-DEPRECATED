var Service = require('node-windows').Service;

var appPath = process.cwd() + '\\server.js';
console.log(appPath);

var SEED_APP = process.env.SEED_APP || '.';
console.log(SEED_APP);

// Create a new service object
var svc = new Service({
  name:'SEED_APP',
  description: 'SEED_APP Windows Service.',
  script: appPath,
  env: {
    name: "SEED_APP",
	value: SEED_APP
  }
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});

svc.install();

