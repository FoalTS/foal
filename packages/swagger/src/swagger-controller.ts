// std
import { readFile } from 'fs';
import { join } from 'path';
import { promisify } from 'util';

// 3p
import {
  Class, Context, createHttpResponseFile, createOpenApiDocument,
  dependency, Get, HttpResponseBadRequest,
  HttpResponseMovedPermanently, HttpResponseNotFound, HttpResponseOK, ServiceManager
} from '@foal/core';
import { getAbsoluteFSPath } from 'swagger-ui-dist';

function isUrlOption(option): option is { url: string } {
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
  @dependency
  controllers: ServiceManager;

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
      const document = createOpenApiDocument(this.options.controllerClass, this.controllers);
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

    return new HttpResponseOK(createOpenApiDocument(option.controllerClass, this.controllers));
  }

  /* UI */

  @Get('/')
  async index(ctx: Context) {
    if (!ctx.request.path.endsWith('/')) {
      return new HttpResponseMovedPermanently(ctx.request.path + '/');
    }

    const template = await promisify(readFile)(join(__dirname, 'index.tpl.html'), 'utf8');
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
            primaryName = `\n        \'urls.primaryName\': "${option.name}",`;
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
      .setHeader('Content-Type', 'text/html; charset=utf-8');
  }

  @Get('/swagger-ui.css')
  swaggerUi() {
    return createHttpResponseFile({
      directory: getAbsoluteFSPath(),
      file: 'swagger-ui.css'
    });
  }

  @Get('/swagger-ui-bundle.js')
  swaggerUiBundle() {
    return createHttpResponseFile({
      directory: getAbsoluteFSPath(),
      file: 'swagger-ui-bundle.js'
    });
  }

  @Get('/swagger-ui-standalone-preset.js')
  swaggerUiStandalonePreset() {
    return createHttpResponseFile({
      directory: getAbsoluteFSPath(),
      file: 'swagger-ui-standalone-preset.js'
    });
  }

}
