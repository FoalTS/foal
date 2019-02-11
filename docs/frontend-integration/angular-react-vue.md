# Angular, React & Vue

```
foal connect angular ../frontend
foal connect react ../frontend
foal connect vue ../frontend
```


that forces you to take the framework way to use. The manner of thinking is different in Foal. Frontend frameworks offer greats CLI that should be used. -> Updated, maintained, a lot of docs

That'w why in FoalTS, actually use the frontend CLI features to connect it to the backend. Do not waste time trying to figure out 

## The problems

### Origins that do not match

Consequently requests made by the frontend do not reach the backend as they have a different origin. One hacky solution is to replace the URL path to `http://localhost:3001` in development and to enable CORS requests.

This technique has some drawbacks:
- it may introduces a different codebase between the environments (dev and prod),
- and it disables a browser protection (the `Same-Origin policy`).

One way to get around this, keeping the policy and the same codebase, is to configure a proxy to redirect `4200` requests to the port `3001`. The CLI of Angular/Vue/React all have this option but not everyone knows that it exists and how to configure it.

### Build outpath

## The `connect` command