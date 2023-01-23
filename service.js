var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
  name:'Pisco-ServicioContable',
  description: 'Servicio Contable De Pagos De Aplicativo Pisco a Plataforma De Visionamos',
  script: './app.js',
  nodeOptions: [
    '--harmony',
    '--max_old_space_size=6144'
  ]
  //, workingDirectory: '...'
  //, allowServiceLogon: true
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});

svc.install();