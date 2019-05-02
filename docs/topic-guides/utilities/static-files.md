# Static Files

## Serving Static Files

By default, Foal serves static files from the `public/` directory.

### Example

`public/`

```text
index.html
styles.css
app.js
```

_Paths served_

```text
/ -> returns index.html
/index.html -> returns index.html
/styles.css -> returns styles.css
/app.js -> returns app.js
```

## Change the directory

You can change the directory where the static files are served using the badly named configuration key `staticUrl`.

_Example with_ `config/default.json`

```javascript
{
  "settings": {
    "staticUrl": "another-directory/"
  }
}
```

## Add a virtual prefix path

You can add a virtual prefix path using the configuration key `staticPathPrefix`.

_Example with_ `config/default.json`

```javascript
{
  "settings": {
    "staticPathPrefix": "static/"
  }
}
```

_Paths served \(example\)_

```text
/static/ -> returns index.html
/static/index.html -> returns index.html
/static/styles.css -> returns styles.css
/static/app.js -> returns app.js
```

