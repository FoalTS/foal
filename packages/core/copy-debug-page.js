const fs = require('fs');
if (!fs.existsSync('./lib')) {
  fs.mkdirSync('./lib');
}
if (!fs.existsSync('./lib/common')) {
  fs.mkdirSync('./lib/common');
}
if (!fs.existsSync('./lib/common/templates')) {
  fs.mkdirSync('./lib/common/templates');
}
fs.copyFileSync('./src/common/templates/500.debug.html', './lib/common/templates/500.debug.html');
