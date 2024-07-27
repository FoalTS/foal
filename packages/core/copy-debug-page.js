const fs = require('fs');
if (!fs.existsSync('./lib')) {
  fs.mkdirSync('./lib');
}
if (!fs.existsSync('./lib/core')) {
  fs.mkdirSync('./lib/core');
}
if (!fs.existsSync('./lib/core/templates')) {
  fs.mkdirSync('./lib/core/templates');
}
fs.copyFileSync('./src/core/templates/500.debug.html', './lib/core/templates/500.debug.html');
