const fs = require('fs');
const { join, basename } = require('path');

const arg = process.argv[2];

const parentDirPath = join(__dirname, arg);

// Create lib/ or src/
if (!fs.existsSync(parentDirPath)) {
  fs.mkdirSync(parentDirPath);
}

const staticDirPath = join(__dirname, arg, 'static');

// Create lib/static or src/static
if (!fs.existsSync(staticDirPath)) {
  fs.mkdirSync(staticDirPath);
}

const paths = [
  'react/umd/react.production.min.js',
  'react-dom/umd/react-dom.production.min.js',
  'graphiql/graphiql.min.js',
  'graphiql/graphiql.min.css',
]

// Copy the static files to lib/static or src/static
for (const path of paths) {
  fs.copyFile(join(__dirname, '../../node_modules', path), join(staticDirPath, basename(path)), err => {
    if (err) {
      console.log(err);
      process.exit(1);
    }
  });
}

if (arg !== 'lib') {
  return;
}

const templatDirPath = join(__dirname, 'lib/templates');

// Create lib/templates
if (!fs.existsSync(templatDirPath)) {
  fs.mkdirSync(templatDirPath);
}

// Copy lib/templates/index.html
fs.copyFile(join(__dirname, 'src/templates/index.html'), join(templatDirPath, 'index.html'), err => {
  if (err) {
    console.log(err);
    process.exit(1);
  }
});