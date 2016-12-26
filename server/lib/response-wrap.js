"use strict";

const config       = require('./arguments');
const Log = require('./common/log');

const log = Log('http', config);

const doError = function(err) {
  let result = {
    success: false,
    errmsg: err.message
  }
  log.error(err);
  this.statusCode = 500;
  this.end(JSON.stringify(result));
}

const doSuccess = function(data) {
  let result = {
    success: true,
    data
  }
  this.statusCode = 200;
  this.end(JSON.stringify(result));
}

const autoEnd = function(err, data) {
  if(err){
    doError.call(this, err)
  }else{
    doSuccess.call(this, data)
  }
}

const doOrigError = function(err) {
  log.error(err);
  this.statusCode = 500;
  this.end(err.message);
}

const doOrigSuccess = function(data) {
  this.statusCode = 200;
  this.end(JSON.stringify(data));
}

const autoOrigEnd = function(err, data) {
  if(err){
    doOrigError.call(this, err)
  }else{
    doOrigSuccess.call(this, data)
  }
}

class Wrap {
  constructor () {
  }

  middleware () {
    return (req, res, next) => {
      res.error = doError.bind(res)
      res.success = doSuccess.bind(res)
      res.autoEnd = autoEnd.bind(res)
      next();
    }
  }

  origMiddleware () {
    return (req, res, next) => {
      res.error = doOrigError.bind(res)
      res.success = doOrigSuccess.bind(res)
      res.autoEnd = autoOrigEnd.bind(res)
      next();
    }
  }

}
module.exports = function() {
  return new Wrap();
};
