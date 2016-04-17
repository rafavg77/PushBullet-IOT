var PushBullet = require('pushbullet');
var pusher = new PushBullet('');
var request = require("request");
var stream = pusher.stream();
var device = 'Domotic Pi';
var url = 'http://192.168.0.250:3000/api/red/';


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

function logger(message2log){
  console.log(dater() + ' - ' + message2log);
};

function connect(stream){
  stream.connect();
};

stream.on('connect', function() {
    logger('Conectado a PushBullet');
    notify(pusher,device,'IOT is UP');
});

stream.on('close', function() {
  logger('Desconectado de PushBullet');
  connect(stream);
});

stream.on('error', function(error) {
   console.log(dater() + ' Ocurrio un error '+ error);
});

stream.on('push', function(push) {
   if(push.title == 'command'){
    if (push.body == 'apagar') {
      requester(request,url + 'on');
      logger('Se apago el Foco');
    }
    if (push.body == 'encender') {
      requester(request,url + 'off');
      logger('Se encendio el Foco'); 
    }}
});

connect(stream);