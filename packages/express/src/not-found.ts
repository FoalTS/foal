const page404 = '<html><head><title>PAGE NOT FOUND</title></head><body><h1>404 - PAGE NOT FOUND</h1></body></html>';

export function notFound() {
  return (req, res) => {
    res.status(404)
       .send(page404);
  };
}
