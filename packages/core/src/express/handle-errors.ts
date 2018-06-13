const page500 = '<html><head><title>INTERNAL SERVER ERROR</title></head><body>'
                + '<h1>500 - INTERNAL SERVER ERROR</h1></body></html>';

function renderDebug500(stack): string {
  return '<html>'
    + '<head>'
    +  '<title>INTERNAL SERVER ERROR</title>'
    + '</head>'
    + '<body>'
    +  '<h1>500 - INTERNAL SERVER ERROR</h1>'
    + `<pre>${stack}</pre>`
    + 'You are seeing this error because you have debug set to true in your config/settings.js file.'
    + '</body>'
    + '</html>';
}

export function handleErrors(debug: boolean, logFn = console.error) {
  return (err, req, res, next) => {
    logFn(err.stack);
    if (debug) {
      res.status(500)
         .send(renderDebug500(err.stack));
    } else {
      res.status(500)
         .send(page500);
    }
  };
}
