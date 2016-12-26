"use strict";

const mysql = require('mysql');

class Mysql {
  constructor (dbConfig) {
    this.dbConfig = dbConfig;
    this.pool = mysql.createPool(dbConfig);
    this._ready = false;
    this.retry = 0;
  }

  ready (cb) {
    if(this._ready){
      return cb(null, this.pool);
    }
    if(this.retry++ === 10){
      return cb(new Error(`mysql connect timeout after retry 10`));
    }
    this.pool.query('show tables', (err, rows) => {
      if(err){
        console.error('[%s] [worker:%s] mysql:%s %s init error: %s', Date(), process.pid, this.dbConfig.host, this.dbConfig.database, err);
        return setTimeout(() => {
          this.ready(cb)
        }, 10000)
      }
      console.log('[%s] [worker:%s] mysql:%s ready.', Date(), process.pid, this.dbConfig.host, this.dbConfig.database);
      this._ready = true;
      cb(null, this.pool);
    })
  }
}

let insts = {}

module.exports = function(args) {
  let key = `${args.host}-${args.database}`
  if(!insts[key]){
    insts[key] = new Mysql(args);
  }
  return insts[key];
};
