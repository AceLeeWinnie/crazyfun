const fs = require('fs');
const path = require('path');
MODE = process.env.BABEL_ENV;

const cwd = process.cwd()

var defaultOptons = {
  user    : __dirname + '/../etc/config.' + MODE + '.json',
  config  : __dirname + '/../etc/config.default.json'
}

var opt = require(defaultOptons.config);
var user = {};
if (fs.existsSync(defaultOptons.user)) {
  user = require(defaultOptons.user);
}
opt = Object.assign(opt, user);
opt.logs_dir = path.join(cwd, opt.logs_dir);

module.exports = opt;
