window.onload = function() {
  // Begin Swagger UI call region
  const ui = SwaggerUIBundle(Object.assign({
    urls: [{"name":"v1","url":"v1.json"},{"name":"v2","url":"openapi.json?name=v2"}],
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout"
  },{}))
  // End Swagger UI call region

  window.ui = ui
}
