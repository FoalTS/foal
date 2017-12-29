function render(locals): string {
  return '<html>'
    + '<head>'
    +  `<title>${locals.statusCode} - ${locals.statusMessage}</title>`
    + '</head>'
    + '<body>'
    +  `<h1>${locals.statusCode} - ${locals.statusMessage}</h1>`
    + (locals.stack ? `<pre>${locals.stack}</pre>` : '')
    + '</body>'
    + '</html>';
}

export function handleErrors(options: { logErrors?: boolean, sendStack?: boolean } = {}, logFn = console.log) {
  options.logErrors = options.logErrors || false;
  options.sendStack = options.sendStack || false;

  return (err, req, res, next) => {
    if (options.logErrors) {
      logFn(err);
    }
    const locals: any = {
      statusCode: err.statusCode || 500,
      statusMessage: err.statusMessage || 'INTERNAL SERVER ERROR'
    };
    if (options.sendStack) {
      locals.stack = err.stack;
    }
    res.status(locals.statusCode);
    if (req.accepts('html')) {
      res.send(render(locals));
    } else {
      res.send(locals);
    }
  };
}
