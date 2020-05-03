const page404 = '<html><head><title>PAGE NOT FOUND</title></head><body><h1>404 - PAGE NOT FOUND</h1></body></html>';

/**
 * Create an express middleware to display a 404 HTML page.
 *
 * @export
 * @returns The express middleware.
 */
export function notFound() {
  return (req: any, res: any) => {
    res.status(404)
       .send(page404);
  };
}
