export class HttpRequest {
  params: { [key: string]: any } = {};
  body: any = undefined;
  query: { [key: string]: any } = {};

  constructor(private expressRequest?) {
    if (expressRequest) {
      this.query = expressRequest.query;
      this.params = expressRequest.params;
      this.body = expressRequest.body;
    }
  }

  getHeader(field: string): string {
    if (this.expressRequest) {
      return this.expressRequest.getHeader(field);
    }
    return field;
  }
}
