function render(locals): string {
  return '<html>'
    + '<head>'
    +  `<title>${locals.statusCode} - ${locals.statusMessage}</title>`
    + '</head>'
    + '<body>'
    +  `<h1>${locals.statusCode} - ${locals.statusMessage}</h1>`
    + (locals.stack ? `<pre>${locals.stack}</pre>` : '')
    + (locals.details ? '<h2>Details:</h2>' : '')
    + (locals.details ? `<pre>${JSON.stringify(locals.details, null, ' ')}</pre>` : '')
    + '</body>'
    + '</html>';
}

export type logOptions = 'none'|'500'|'all';

export function handleErrors(options: { logs?: logOptions, sendStack?: boolean } = {},
                             logFn = console.error) {
  options.logs = options.logs || 'none';
  options.sendStack = options.sendStack || false;

  return (err, req, res, next) => {
    const locals: any = {
      details: err.details,
      statusCode: err.statusCode || 500,
      statusMessage: err.statusMessage || 'INTERNAL SERVER ERROR',
    };
    if (options.logs === 'all') {
      logFn(err);
    } else if (options.logs === '500' && locals.statusCode === 500) {
      logFn(err);
    }
    if (options.sendStack) {
      locals.stack = err.stack;
    }
    res.status(locals.statusCode);
    if (err.headers) {
      res.set(err.headers);
    }
    if (req.accepts('html')) {
      res.send(render(locals));
    } else {
      res.send(locals);
    }
  };
}
