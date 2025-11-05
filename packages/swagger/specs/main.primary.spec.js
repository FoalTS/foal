window.onload = function() {
  // Begin Swagger UI call region
  const ui = SwaggerUIBundle(Object.assign({
    urls: [{"name":"spec1","url":"xxx"},{"name":"spec2","url":"yyy"}],
    'urls.primaryName': "spec2",
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
