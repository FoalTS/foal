import { Request } from 'express';

/**
 * Interface of the express request object. It also includes
 * a `session` property and a `csrfToken` method.
 *
 * @export
 * @interface HTTPRequest
 * @extends {Request}
 */
export interface HTTPRequest extends Request {
  session: any;
  csrfToken: () => string;
}

/**
 * Class instantiated on each request. It includes:
 * - the express request object,
 * - the user object if available,
 * - and a `state` object that can be used to pass data across several hooks.
 *
 * @export
 * @class Context
 * @template User
 */
export class Context<User = any> {
  state: { [key: string]: any } = {};
  user: User;
  request: HTTPRequest;

  /**
   * Creates an instance of Context.
   * @param {*} request - Either the express request object or a mock (for testing).
   * @memberof Context
   */
  constructor(request) {
    this.request = request;
  }
}
