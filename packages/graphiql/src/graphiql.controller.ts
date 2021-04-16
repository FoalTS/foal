// std
import { createReadStream, stat } from 'fs';
import { join } from 'path';
import { promisify } from 'util';

// 3p
import { Get, HttpResponseOK } from '@foal/core';

export class GraphiQLController {

  // options: {} = {};

  // @Get()
  // index() {

  // }

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
    const stats = await promisify(stat)(filePath);

    return new HttpResponseOK(stream, { stream: true })
      .setHeader('Content-Type', contentType)
      .setHeader('Content-Length', stats.size.toString());
  }

}