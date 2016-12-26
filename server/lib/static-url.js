"use strict";

let serviceOnline = true;

process.on('message', getMessage)

function getMessage(msg) {
  if(msg.type === 'service-offline'){
    serviceOnline = false;
  }else if(msg.type === 'service-online'){
    serviceOnline = true;
  }
}

class StaticUrl {
  notFound () {
    return function(req, res, next) {
      res.statusCode = 404;
      res.end('not found');
    }
  }

  status () {
    return function(req, res, next) {
      if(serviceOnline){
        res.statusCode = 200;
        res.end('success');
      }else{
        res.statusCode = 500;
        res.end('offline');
      }
    }
  }
}
module.exports = function(args) {
  return new StaticUrl(args);
};
