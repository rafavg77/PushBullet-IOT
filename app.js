var PushBullet = require('pushbullet');
var pusher = new PushBullet('API_KEY');
var request = require("request");
var stream = pusher.stream();
var device = 'Domotic Pi';
var url = 'http://192.168.0.250:3000/api/red/';
var exec = require('child_process').exec, child;


function notify(pusher,device,message){
  pusher.note('', device, message, function(error, response) {
    if (error) {
      console.log(error);
    }else{
      logger('Mensaje Enviado');
    }
  });
};

function requester(request,url){
  request(url,function(error, response, body){
    if (!error && response.statusCode == 200) {
     console.log(body); 
    }
  });
};

function dater(){
  var today = new Date();
  var date = today.getFullYear().toString() + '/'+ (today.getMonth()+1).toString() + '/'+ today.getDate().toString() +' '+  today.toLocaleTimeString();
  return date;
};

function logger(message2log,online){
  if(online){
    child = exec('logger_api " '+ message2log +' " > /dev/null 2>&1',
    function (error, stdout, stderr) {
      console.log(dater() + " stdout: " + stdout);
      console.log(dater() + " Success Notify Online");
      if (error !== null) {
        console.log(dater() + 'exec error: ' + error);
      }
    });
  }else{
    console.log(dater() + ' - ' + message2log);  
  }
};

function connect(stream){
  stream.connect();
};

stream.on('connect', function() {
    //logger('Conectado a PushBullet');
    notify(pusher,device,'IoT is UP');
    logger('IoT is UP',true);
});

stream.on('close', function() {
  logger('Desconectado de PushBullet');
  connect(stream);
});

stream.on('error', function(error) {
   console.log(dater() + ' Ocurrio un error '+ error);
});

stream.on('push', function(push) {
  console.log(push);
   if(push.title == 'command'){
    if (push.body == 'apagar') {
//      requester(request,url + 'on');
      logger('Se apago el Foco');
    }
    if (push.body == 'encender') {
//      requester(request,url + 'off');
      logger('Se encendio el Foco'); 
    }}
});

stream.on('message', function(message) {
    // message received
    logger('message received');
    console.log(message); 
});

stream.on('nop', function() {
    // nop message received
    logger('nop message received'); 
});

stream.on('tickle', function(type) {
    // tickle message received 
    logger('tickle message received');
    console.log(type);
});

connect(stream);
