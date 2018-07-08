import { HttpMethod } from './http-methods';

export class HttpRequest {
  params: { [key: string]: any } = {};
  body: any = undefined;
  query: { [key: string]: any } = {};
  method: HttpMethod = 'GET';
  path: string = '';

  constructor(private expressRequest?) {
    if (expressRequest) {
      this.query = expressRequest.query;
      this.params = expressRequest.params;
      this.body = expressRequest.body;
      this.method = expressRequest.method;
      this.path = expressRequest.path;
    }
  }

  getHeader(field: string): string {
    if (this.expressRequest) {
      return this.expressRequest.get(field);
    }
    return field;
  }
}
