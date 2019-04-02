// std
import { readFile } from 'fs';
import { join } from 'path';
import { promisify } from 'util';

// 3p
import { Class, Context, createHttpResponseFile, Get, HttpResponseOK, HttpResponseRedirect } from '@foal/core';
import { getAbsoluteFSPath } from 'swagger-ui-dist';

function isUrlOption(option): option is { url: string } {
  return option.hasOwnProperty('url');
}

/**
 *
 *
 * @export
 * @abstract
 * @class SwaggerController
 */
export abstract class SwaggerController {
  abstract options: { url: string } |
           { controllerClass: Class } |
           (
             { name: string, url: string, primary?: boolean } |
             { name: string, controllerClass: Class, primary?: boolean }
           )[];

  /* Spec file(s) */

  @Get('swagger.json')
  getOpenApiDefinition(ctx: Context) {
    // Use a query /swagger.json?name=v1
  }

  /* UI */

  @Get('/')
  async index(ctx: Context) {
    if (!ctx.request.path.endsWith('/')) {
      return new HttpResponseRedirect(ctx.request.path + '/');
    }

    const template = await promisify(readFile)(join(__dirname, 'index.tpl.html'), 'utf8');
    let body = '';

    if (!Array.isArray(this.options)) {
      const url = isUrlOption(this.options) ? this.options.url : 'swagger.json';
      body = template
        .replace('{{ urls }}', `url: "${url}"`)
        .replace('{{ urlArray }}', '');
    } else {
      let primaryName: string = '';
      const options = this.options
        .map(option => {
          if (option.primary) {
            primaryName = option.name;
          }
          return {
            name: option.name,
            url: isUrlOption(option) ? option.url : `swagger.json?name=${option.name}`
          };
        });
      let urlArray = `\n      const urls = ${JSON.stringify(options)};`;
      if (primaryName) {
        urlArray = urlArray.concat(`\n      urls.primaryName = "${primaryName}";`);
      }
      body = template
        .replace('{{ urls }}', 'urls: urls')
        .replace('{{ urlArray }}', urlArray);
    }

    const response = new HttpResponseOK(body);
    response.setHeader('Content-Type', 'text/html; charset=utf-8');
    return response;
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
