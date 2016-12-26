const uid = require('uid-safe').sync;
const Store  = require('./mysql-store');
const ClientSession  = require('./client');

/*
  Session({
    db: {
      host:  'xxx',
      schema: {
        tableName: 'user_sessions',
        columnNames: {
          session_id: 'session_id',
          expires: 'expires_time',
          data: 'session_info'
        }
      }
    }
  })
*/

class Session {
  constructor (args) {
    this.options = args;
    this.store = Store(this.options.db)
  }

  // ready(cb) {
  //   this.mysql.ready((err, pool) => {
  //     this.pool = pool;
  //     cb(err, this);
  //   });
  // }

  middleware () {
    return (req, res, next) => {
      let clientSession = ClientSession(req);
      if(!clientSession){
        clientSession = uid(128);
      }
      req.sessionID = clientSession;
      this.store.get(clientSession, (err, dbSession) => {
        if(err){
          console.log(err);
        }
        if(!dbSession){
          req._isNewSession = true;
        }
        req.session = dbSession;
        this.wrapMethod(req, res)
        return next();
      })
    }
  }

  wrapMethod (req, res) {
    let _end = res.end.bind(res);
    res.end = (msg) => {
      if(req._isNewSession){
        this.store.set(req.sessionID, req.session, (err) => {
          if(err){
            console.log(err);
          }
          _end(msg)
        })
      }else{
        this.store.touch(req.sessionID, req.session, (err) => {
          if(err){
            console.log(err);
          }
          _end(msg)
        })
      }
    }
  }
}
module.exports = function(args) {
  return new Session(args);
};