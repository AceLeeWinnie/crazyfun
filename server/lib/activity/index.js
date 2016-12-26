"use strict";
const qs = require('querystring');
const async = require('async');
const mysql = require('../common/mysql');
const Log = require('../common/log');

const QUERY_PUBLISH_LIST = 'SELECT * FROM activity WHERE publisher_id = ? ORDER BY create_time desc'
const ADD_ACTIVITY = 'INSERT INTO activity(publisher_id,activity_name,activity_time,activity_desc,expect_num,actual_num,background_url,update_time,create_time) \
                      VALUES(?, ?, ?, ?, ?, ?, ?, now(), now())'
const QUERY_WECHAT = 'SELECT * FROM wechat_account WHERE wechat_id = ?'
const UPDATE_WECHAT = 'UPDATE wechat_account SET wechat_name = ? WHERE wechat_id = ?'
const ADD_WECHAT = 'INSERT INTO wechat_account(wechat_id, wechat_name, update_time, create_time)\
                      VALUES(?, ?, now(), now())'
const QUERY_ID_ACCOUNT = 'SELECT * FROM id_account WHERE IDCard = ?'
const UPDATE_ID_ACCOUNT = 'UPDATE id_account SET telephone = ?, name = ?, payName = ? WHERE IDCard = ?'
const ADD_ID_ACCOUNT = 'INSERT INTO id_account(IDCard, telephone, name, payName, update_time, create_time)\
                      VALUES(?, ?, ?, ?, now(), now())'
const QUERY_ATTEND = 'select a1.*, \
                                wechat_account.wechat_id, \
                               wechat_account.wechat_name \
                          from( \
                        select attend.*, id_account.IDCard, id_account.telephone, id_account.name, id_account.payName \
                          from attend JOIN id_account on attend.participant_id= id_account.IDCard \
                           and attend.activity_id= ? \
                           and attend.isAttend= 0) as a1 join wechat_account on a1.apply_id= wechat_account.wechat_id \
                         ORDER BY a1.create_time desc'
const ADD_ATTEND = 'INSERT INTO attend(activity_id, participant_id, isAttend, apply_id, update_time, create_time)\
                      VALUES(?, ?, 0, ?, now(), now())'
const MY_ACTIVITY = 'select a2.*, id_account.name as apply_name from ( \
                      select a1.*, wechat_account.wechat_name as publisher_name from ( \
                          select activity.*, attend.participant_id, attend.apply_id from attend join activity on attend.activity_id = activity.id and attend.apply_id = ? and attend.isAttend = 0 ORDER by activity.create_time desc \
                      ) as a1 join wechat_account where a1.publisher_id = wechat_account.wechat_id \
                    ) as a2 join id_account where a2.participant_id = id_account.IDCard'
const MY_ACTIVITY_ID_CARD = 'select id_account.*, attend.activity_id from attend join id_account on attend.participant_id = id_account.IDCard and attend.apply_id = ? and attend.activity_id = ? and attend.isAttend = 0'
const CANCEL_ATTEND = 'update attend set isAttend = 1, update_time = now() WHERE activity_id = ? and participant_id = ? and apply_id = ?'
const QUERY_CONTACT = 'SELECT * FROM contact WHERE wechat_id = ?'
const ADD_CONTACT = 'INSERT INTO contact(wechat_id, IDCard, update_time, create_time)\
                      VALUES(?, ?, now(), now())'

class Activity {
  constructor (args) {
    this.options = args;
    this.log = Log('service', args);
    this.mysql = mysql(this.options.db);
    this.pool = null;
  }

  ready(cb) {
    this.mysql.ready((err, pool) => {
      this.pool = pool;
      cb(err, this);
    });
  }

  publishlist () {
    return (req, res, next) => {
      this._publishlist({
        wechatId: req.param('wechatId')
      }, res.autoEnd)
    }
  }

  publishActivity () {
    return (req, res, next) => {
      this._publishActivity(req.body, res.autoEnd)
    }
  }

  applyList () {
    return (req, res, next) => {
      this._applyList({
        activityid: req.param('activityid'),
        publisherId: req.param('publisherId'),
      }, res.autoEnd)
    }
  }

  applyActivity () {
    return (req, res, next) => {
      this._applyActivity(Object.assign({}, req.body, {
        activityid: req.param('activityid')
      }), res.autoEnd)
    }
  }

  applyActivityList () {
    return (req, res, next) => {
      this._applyActivityList({
        wechatId: req.param('wechatId')
      }, res.autoEnd)
    }
  }

  getMyActivityIdCardList () {
    return (req, res, next) => {
      this._getMyActivityIdCardList({
        activityid: req.param('activityid'),
        wechatId: req.param('wechatId'),
      }, res.autoEnd)
    }
  }

  cancelattend () {
    return (req, res, next) => {
      this._cancelattend({
        activityid: req.param('activityid'),
        wechatId: req.param('wechatId'),
        participantId: req.param('participantId'),
      }, res.autoEnd)
    }
  }

  queryContact () {
    return (req, res, next) => {
      this._queryContact({
        wechatId: req.param('wechatId')
      }, res.autoEnd)
    }
  }

  _publishlist (param, cb) {
    this.pool.query(QUERY_PUBLISH_LIST, [param.wechatId], (err, rows) => {
      if(err){
        return cb(err);
      }
      return cb(null, rows);
    })
  }

  _publishActivity (param, cb) {
    async.series([
      this._addActivity.bind(this, param),
      this._autoUpdateWechat.bind(this, param),
    ], (err) => {
      cb(err);
    })
  }

  _addActivity (param, cb) {
    let querys = [
      param.wechatId,
      param.data.name,
      param.data.time,
      param.data.desc,
      param.data.expectnum,
      0,
      '',
    ]
    this.pool.query(ADD_ACTIVITY, querys, (err, rows) => {
      if(err){
        return cb(err);
      }
      return cb(null, rows);
    })
  }

  _autoUpdateWechat (param, cb) {
    async.waterfall([
      (cb) => {
        this._queryWechat(param, cb)
      }, (wechat, cb) => {
        if(wechat && wechat.length > 0){
          this._updateWechat(param, cb)
        }else{
          this._addWechat(param, cb)
        }
      }
    ], cb)
  }

  _queryWechat (param, cb) {
    this.pool.query(QUERY_WECHAT, [param.wechatId], (err, rows) => {
      if(err){
        return cb(err);
      }
      return cb(null, rows);
    })
  }

  _updateWechat (param, cb) {
    this.pool.query(UPDATE_WECHAT, [param.wechatName, param.wechatId], (err, rows) => {
      if(err){
        return cb(err);
      }
      return cb(null, rows);
    })
  }

  _addWechat (param, cb) {
    this.pool.query(ADD_WECHAT, [param.wechatId, param.wechatName], (err, rows) => {
      if(err){
        return cb(err);
      }
      return cb(null, rows);
    })
  }

  _applyList (param, cb) {
    this.pool.query(QUERY_ATTEND, [param.activityid], (err, rows) => {
      if(err){
        return cb(err);
      }
      return cb(null, rows);
    })
  }

  _applyActivity (param, cb) {
    async.series([
      this._addEttend.bind(this, param),
      this._autoUpdateWechat.bind(this, param),
      this._autoUpdateIdAccount.bind(this, param),
      this._autoUpdateContact.bind(this, param),
    ], (err) => {
      cb(err)
    })
  }

  _addEttend (param, cb) {
    this.pool.query(ADD_ATTEND, [param.activityid, param.idCard, param.wechatId], (err, rows) => {
      if(err){
        return cb(err);
      }
      return cb(null, rows);
    })
  }

  _autoUpdateIdAccount (param, cb) {
    async.waterfall([
      (cb) => {
        this._queryIdAccount(param, cb)
      }, (idCard, cb) => {
        if(idCard && idCard.length > 0){
          this._updateIdAccount(param, cb)
        }else{
          this._addIdAccount(param, cb)
        }
      }
    ], cb)
  }

  _queryIdAccount (param, cb) {
    this.pool.query(QUERY_ID_ACCOUNT, [param.idCard], (err, rows) => {
      if(err){
        return cb(err);
      }
      return cb(null, rows);
    })
  }

  _updateIdAccount (param, cb) {
    this.pool.query(UPDATE_ID_ACCOUNT, [param.tel, param.name, param.paymentId, param.idCard], (err, rows) => {
      if(err){
        return cb(err);
      }
      return cb(null, rows);
    })
  }

  _addIdAccount (param, cb) {
    this.pool.query(ADD_ID_ACCOUNT, [param.idCard, param.tel, param.name, param.paymentId], (err, rows) => {
      if(err){
        return cb(err);
      }
      return cb(null, rows);
    })
  }

  _applyActivityList (param, cb) {
    this.pool.query(MY_ACTIVITY, [param.wechatId], (err, rows) => {
      if(err){
        return cb(err);
      }
      return cb(null, this._mergeIdCardInOneActivity(rows));
    })
  }

  _getMyActivityIdCardList (param, cb) {
    this.pool.query(MY_ACTIVITY_ID_CARD, [param.wechatId, param.activityid], (err, rows) => {
      if(err){
        return cb(err);
      }
      return cb(null, rows);
    })
  }

  _mergeIdCardInOneActivity (rows) {
    let applyGroups = {};
    rows.map((item) => {
      let apply_id = item.apply_id;
      if(!applyGroups[apply_id]){
        applyGroups[apply_id] = Object.assign(item, {
          paticipant: []
        })
      }
      applyGroups[apply_id].paticipant.push({
        id: item.participant_id,
        name: item.apply_name
      })
    })
    let applyGroupArr = []
    for(let key in applyGroups){
      applyGroupArr.push(applyGroups[key]);
    }
    return applyGroupArr;
  }

  _cancelattend (param, cb) {
    this.pool.query(CANCEL_ATTEND, [param.activityid, param.participantId, param.wechatId], (err, rows) => {
      if(err){
        return cb(err);
      }
      return cb(null);
    })
  }

  _autoUpdateContact (param, cb) {
    async.waterfall([
      (cb) => {
        this._queryContact(param, cb)
      }, (idCard, cb) => {
        if(idCard && idCard.length > 0){
          cb()
        }else{
          this._addContact(param, cb)
        }
      }
    ], cb)
  }

  _queryContact (param, cb) {
    this.pool.query(QUERY_CONTACT, [param.wechatId], (err, rows) => {
      if(err){
        return cb(err);
      }
      return cb(null, rows);
    })
  }

  _addContact (param, cb) {
    this.pool.query(ADD_CONTACT, [param.wechatId, param.idCard], (err, rows) => {
      if(err){
        return cb(err);
      }
      return cb(null, rows);
    })
  }

}
module.exports = function(args) {
  return new Activity(args);
};
