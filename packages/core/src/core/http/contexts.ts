import { Request } from 'express';
import { Session } from '../../sessions';

/**
 * Class instantiated on each request. It includes:
 * - the express request object,
 * - the user object if available,
 * - the session object if available,
 * - and a `state` object that can be used to pass data across several hooks.
 *
 * @export
 * @class Context
 * @template User
 */
export class Context<User = any, ContextSession = Session|undefined> {
  state: { [key: string]: any } = {};
  user: User;
  session: ContextSession;
  request: Request;

  /**
   * Creates an instance of Context.
   * @param {*} request - Either the express request object or a mock (for testing).
   * @memberof Context
   */
  constructor(request) {
    this.request = request;
  }
}
