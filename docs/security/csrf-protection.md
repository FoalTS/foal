# CSRF protection

// by default true

`settings.json`

Returns a 403 error with the message `Bad csrf token.`

In the body `_csrf`.
In the query `_csrf`.

Headers: `CSRF-Token`, `XSRF-Token`, `X-CSRF-Token` and `X-XSRF-Token`.