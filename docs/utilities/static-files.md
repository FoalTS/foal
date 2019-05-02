# Serving Static Files

By default, Foal serves static files from the `public/` directory.

## Example

*`public/`*
```
index.html
styles.css
app.js
```

*Paths served*
```
/ -> returns index.html
/index.html -> returns index.html
/styles.css -> returns styles.css
/app.js -> returns app.js
```

# Change the directory

You can change the directory where the static files are served using the badly named configuration key `staticUrl`.

*Example with `config/default.json`*
```json
{
  "settings": {
    "staticUrl": "another-directory/"
  }
}
```

# Add a virtual prefix path

You can add a virtual prefix path using the configuration key `staticPathPrefix`.

*Example with `config/default.json`*
```json
{
  "settings": {
    "staticPathPrefix": "static/"
  }
}
```

*Paths served (example)*
```
/static/ -> returns index.html
/static/index.html -> returns index.html
/static/styles.css -> returns styles.css
/static/app.js -> returns app.js
```