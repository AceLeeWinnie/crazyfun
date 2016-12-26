"use strict";
require('coffee-script').register()

const async        = require('async');
const express = require('express')
const bodyParser = require('body-parser')

const StaticUrl    = require('./static-url');
const config       = require('./arguments');
const ResponseWrap = require('./response-wrap');

const Activity        = require('./activity');

const activityInst        = Activity(config);

const runActivity = (cb) => {
  activityInst.ready(cb);
}

const app = express();

async.series({
  activity: runActivity,
}, (err, results) => {
  if(!err){
    app.use('/status', StaticUrl().status());
  } else{
    console.log(err)
  }
  app.use('/api', bodyParser.json())
  app.use('/api', ResponseWrap().middleware());

  app.get('/api/activity/publishlist', activityInst.publishlist());
  app.post('/api/activity/publishlist', activityInst.publishActivity());
  app.get('/api/activity/publishlist/:activityid', activityInst.applyList());
  app.post('/api/activity/attendlist/:activityid', activityInst.applyActivity());
  app.get('/api/activity/attendlist/:activityid', activityInst.getMyActivityIdCardList());
  app.get('/api/activity/attendlist', activityInst.applyActivityList());
  app.post('/api/activity/cancelattend', activityInst.cancelattend());
  app.get('/api/contact', activityInst.queryContact());

  app.use(StaticUrl().notFound());
  app.listen(config.port, ()=>{
    console.log(`listening on ${config.port}...`);
  });
});
