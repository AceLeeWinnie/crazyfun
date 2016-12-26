"use strict";
const justlog = require('justlog');
const ErrorUtil = require('./err');

class Log {
  constructor (fileName, logConfig) {
    this.infoLog = justlog({
      file: {
        level : justlog.ERROR | justlog.INFO | justlog.WARN,
        path : `[${logConfig.logs_dir}/${fileName}-info-]YYYY-MM-DD[.log]`,
        pattern : "{fulltime} [{levelTrim}] {msg}"
      }
    })
    this.errorLog = justlog({
      file: {
        level : justlog.ERROR | justlog.INFO | justlog.WARN,
        path : `[${logConfig.logs_dir}/${fileName}-error-]YYYY-MM-DD[.log]`,
        pattern : "{fulltime} [{levelTrim}] {msg}"
      }
    })
  }

  error (msg) {
    this.errorLog.error(ErrorUtil.toString(msg));
  }

  info (msg) {
    this.infoLog.info(ErrorUtil.toString(msg));
  }
}
module.exports = function(fileName, args) {
  return new Log(fileName, args);
};
