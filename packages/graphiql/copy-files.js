const fs = require('fs');
const { join, basename } = require('path');

const staticDirPath = join(__dirname, process.argv[2], 'static');

if (!fs.existsSync(staticDirPath)) {
  fs.mkdirSync(staticDirPath);
}

const paths = [
  'react/cjs/react.production.min.js',
  'react-dom/cjs/react-dom.production.min.js',
  'graphiql/graphiql.min.js',
  'graphiql/graphiql.min.css',
]

for (const path of paths) {
  fs.copyFile(join(__dirname, 'node_modules', path), join(staticDirPath, basename(path)), err => {
    if (err) {
      console.log(err);
      process.exit(1);
    }
  });
}
