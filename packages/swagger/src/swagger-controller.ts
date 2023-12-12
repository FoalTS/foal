// std
import { createReadStream } from 'fs';
import { readFile, stat } from 'node:fs/promises';
import { join } from 'path';

// 3p
import {
  Class,
  Context,
  Dependency,
  Get,
  HttpResponseBadRequest,
  HttpResponseMovedPermanently,
  HttpResponseNotFound,
  HttpResponseOK,
  OpenApi,
  OPENAPI_SERVICE_ID,
} from '@foal/core';
import { getAbsoluteFSPath } from 'swagger-ui-dist';

function isUrlOption(option: SwaggerController['options']): option is { url: string } {
  return option.hasOwnProperty('url');
}

/**
 * Serve Swagger UI to visualize and interact with API resources.
 *
 * @export
 * @abstract
 * @class SwaggerController
 */
export abstract class SwaggerController {
  @Dependency(OPENAPI_SERVICE_ID)
  openApi: OpenApi;

  /**
   * Specify the OpenAPI Specification(s) and their location(s).
   *
   * If a controller class is provided, then an OpenAPI Specification is generated
   * from its definition.
   *
   * @abstract
   * @type {({ url: string } |
   *            { controllerClass: Class } |
   *            (
   *              { name: string, url: string, primary?: boolean } |
   *              { name: string, controllerClass: Class, primary?: boolean }
   *            )[])}
   * @memberof SwaggerController
   */
  abstract options: { url: string } |
           { controllerClass: Class } |
           (
             { name: string, url: string, primary?: boolean } |
             { name: string, controllerClass: Class, primary?: boolean }
           )[];

  /**
   * Extend Swagger UI options.
   *
   * See https://swagger.io/docs/open-source-tools/swagger-ui/usage/configuration/.
   *
   * @type {object}
   * @example
   * uiOptions = { docExpansion: 'none' };
   * @memberof SwaggerController
   */
  uiOptions: object = {};

  /* Spec file(s) */

  @Get('/openapi.json')
  getOpenApiDefinition(ctx: Context) {
    if (isUrlOption(this.options)) {
      return new HttpResponseNotFound();
    }

    if (!Array.isArray(this.options)) {
      const document = this.openApi.getDocument(this.options.controllerClass);
      return new HttpResponseOK(document);
    }

    const name = ctx.request.query.name;
    if (typeof name !== 'string') {
      return new HttpResponseBadRequest('Missing URL parameter "name".');
    }

    const option = this.options.find(option => option.name === name);
    if (!option || isUrlOption(option)) {
      return new HttpResponseNotFound();
    }

    return new HttpResponseOK(this.openApi.getDocument(option.controllerClass));
  }

  /* UI */

  @Get('/')
  async index(ctx: Context) {
    if (!ctx.request.path.endsWith('/')) {
      return new HttpResponseMovedPermanently(ctx.request.path + '/');
    }

    const page = await readFile(join(__dirname, 'index.html'), 'utf8');
    return new HttpResponseOK(page)
      .setHeader('Content-Type', 'text/html; charset=utf-8');
  }

  @Get('/main.js')
  async main(ctx: Context) {
    const template = await readFile(join(__dirname, 'main.tpl.js'), 'utf8');
    let body = '';

    if (!Array.isArray(this.options)) {
      const url = isUrlOption(this.options) ? this.options.url : 'openapi.json';
      body = template
        .replace('{{ urls }}', `url: "${url}"`)
        .replace('{{ primaryName }}', '');
    } else {
      let primaryName: string = '';
      const options = this.options
        .map(option => {
          if (option.primary) {
            primaryName = `\n    \'urls.primaryName\': "${option.name}",`;
          }
          return {
            name: option.name,
            url: isUrlOption(option) ? option.url : `openapi.json?name=${option.name}`
          };
        });
      body = template
        .replace('{{ urls }}', `urls: ${JSON.stringify(options)}`)
        .replace('{{ primaryName }}', primaryName);
    }
    body = body.replace('{{ uiOptions }}', JSON.stringify(this.uiOptions));
    return new HttpResponseOK(body)
      .setHeader('Content-Type', 'application/javascript');
  }

  @Get('/swagger-ui.css')
  swaggerUi() {
    return this.createHttpResponseFile('swagger-ui.css', 'text/css');
  }

  @Get('/swagger-ui-bundle.js')
  swaggerUiBundle() {
    return this.createHttpResponseFile('swagger-ui-bundle.js', 'application/javascript');
  }

  @Get('/swagger-ui-standalone-preset.js')
  swaggerUiStandalonePreset() {
    return this.createHttpResponseFile('swagger-ui-standalone-preset.js', 'application/javascript');
  }

  private async createHttpResponseFile(filename: string, contentType: string): Promise<HttpResponseOK> {
    const filePath = join(getAbsoluteFSPath(), filename);

    const stream = createReadStream(filePath);
    const stats = await stat(filePath);

    return new HttpResponseOK(stream, { stream: true })
      .setHeader('Content-Type', contentType)
      .setHeader('Content-Length', stats.size.toString());
  }

}
