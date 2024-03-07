// std
import { createReadStream } from 'fs';
import { readFile, stat } from 'node:fs/promises';
import { join } from 'path';

// 3p
import { Context, Get, HttpResponseMovedPermanently, HttpResponseOK, renderToString } from '@foal/core';

export interface GraphiQLControllerOptions {
  query?: string;
  variables?: string;
  headers?: string;
  externalFragments?: string;
  operationName?: string;
  response?: string;
  defaultQuery?: string;
  defaultVariableEditorOpen?: boolean;
  defaultSecondaryEditorOpen?: boolean;
  editorTheme?: string;
  readOnly?: boolean;
  docExplorerOpen?: boolean;
  headerEditorEnabled?: boolean;
  shouldPersistHeaders?: boolean;
}

/**
 * Controller to render a GraphiQL page.
 *
 * @export
 * @class GraphiQLController
 */
export class GraphiQLController {

  options: GraphiQLControllerOptions = {};

  apiEndpoint = '/graphql';

  cssThemeURL?: string;

  @Get('/')
  async index(ctx: Context) {
    if (!ctx.request.path.endsWith('/')) {
      return new HttpResponseMovedPermanently(ctx.request.path + '/');
    }

    const template = await readFile(join(__dirname, 'templates/index.html'), 'utf8');

    const page = renderToString(template, {
      options: JSON.stringify(this.options),
      endpoint: this.apiEndpoint,
      cssTheme: this.cssThemeURL ? `\n<link rel="stylesheet" href="${this.cssThemeURL}" />` : ''
    });
    return new HttpResponseOK(page);
  }

  @Get('/react.production.min.js')
  getReactProduction() {
    return this.createHttpResponseFile('react.production.min.js', 'application/javascript');
  }

  @Get('/react-dom.production.min.js')
  getReactDomProduction() {
    return this.createHttpResponseFile('react-dom.production.min.js', 'application/javascript');
  }

  @Get('/graphiql.min.css')
  getGraphiqlCss() {
    return this.createHttpResponseFile('graphiql.min.css', 'text/css');
  }

  @Get('/graphiql.min.js')
  getGraphiqlJs() {
    return this.createHttpResponseFile('graphiql.min.js', 'application/javascript');
  }

  private async createHttpResponseFile(filename: string, contentType: string): Promise<HttpResponseOK> {
    const filePath = join(__dirname, 'static', filename);

    const stream = createReadStream(filePath);
    const stats = await stat(filePath);

    return new HttpResponseOK(stream, { stream: true })
      .setHeader('Content-Type', contentType)
      .setHeader('Content-Length', stats.size.toString());
  }

}