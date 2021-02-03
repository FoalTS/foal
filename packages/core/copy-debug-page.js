const fs = require('fs');
if (!fs.existsSync('./lib')) {
  fs.mkdirSync('./lib');
}
if (!fs.existsSync('./lib/common')) {
  fs.mkdirSync('./lib/common');
}
if (!fs.existsSync('./lib/common/utils')) {
  fs.mkdirSync('./lib/common/utils');
}
fs.copyFileSync('./src/common/utils/500.debug.html', './lib/common/utils/500.debug.html');
