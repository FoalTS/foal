window.onload = function() {
  // Begin Swagger UI call region
  const ui = SwaggerUIBundle(Object.assign({
    url: "openapi.json",
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
