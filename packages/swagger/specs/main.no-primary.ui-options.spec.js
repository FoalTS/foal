window.onload = function() {
  // Begin Swagger UI call region
  const ui = SwaggerUIBundle(Object.assign({
    urls: [{"name":"v1","url":"v1.json"}],
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
  },{"docExpansion":"none"}))
  // End Swagger UI call region

  window.ui = ui
}
