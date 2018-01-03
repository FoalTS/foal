export function logErrors(enabled = true, logFn = console.error) {
  return (err, req, res, next) => {
    if (enabled) {
      logFn(err);
    }
    next(err);
  };
}
