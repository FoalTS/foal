import { FileList } from '../../common/file';
import { Session } from '../../sessions';

interface Readable {
  [name: string]: any;
}

interface IncomingMessage extends Readable {
  aborted: boolean;
  complete: boolean;
  headers: any;
  // These two lines are present in @types/node but not in Node.js official documentation.
  // Missing: httpVersionMajor: number;
  // Missing: httpVersionMinor: string;
  httpVersion: string;
  method?: string;
  rawHeaders: string[];
  rawTrailers: string[];
  socket: any;
  statusCode?: number;
  statusMessage?: number;
  trailers: any;
  url?: string;
  destroy(err?: any): void;
  // tslint:disable-next-line:ban-types
  setTimeout(msecs: number, callback: Function): this;
}

/**
 * Express Request interface.
 *
 * @interface Request
 */
interface Request extends IncomingMessage {
  app: any;
  baseUrl: string;
  body: any;
  cookies: any;
  fresh: boolean;
  // This line is present in @types/express but not in Express official documentation.
  // host: string; // @deprecated
  hostname: string;
  ip: string;
  ips: string[];
  method: string;
  originalUrl: string;
  params: any;
  path: string;
  // The type is a string in @types/express.
  procotol: 'http'|'https';
  query: any;
  route: any;
  secure: boolean;
  signedCookies: any;
  stale: boolean;
  subdomains: string[];
  xhr: boolean;
  // This line has been added based on @types/express in order not to make the url possibly undefined.
  url: string;

  // This line has been added based on @types/express but it is not present in Express official documentation.
  accepts(): string[];
  accepts(types: string|string[]): string|false;
  accepts(...types: string[]): string|false;

  // This line has been added based on @types/express but it is not present in Express official documentation.
  acceptsCharsets(): string[];
  acceptsCharsets(charset: string|string[]): string|false;
  acceptsCharsets(...charset: string[]): string|false;

  // This line has been added based on @types/express but it is not present in Express official documentation.
  acceptsEncodings(): string[];
  acceptsEncodings(encoding: string|string[]): string|false;
  acceptsEncodings(...encoding: string[]): string|false;

  // This line has been added based on @types/express but it is not present in Express official documentation.
  acceptsLanguages(): string[];
  acceptsLanguages(lang: string|string[]): string|false;
  acceptsLanguages(...lang: string[]): string|false;

  // This line has been added based on @types/express but it is not present in Express official documentation.
  get(field: 'set-cookie'): string[] | undefined;
  get(field: string): string|undefined;

  // This line has been added based on @types/express but it is not present in Express official documentation.
  header(field: 'set-cookie'): string[] | undefined;
  header(field: string): string|undefined;

  // The string[] type has been added based on @types/express but it is not present in Express official documentation.
  is(type: string|string[]): string | false | null;

  /**
   * @deprecated
   */
  param(name: string, defaultValue?: any): any;

  // The undefined type has been added based on @types/express but it is not present in Express official documentation.
  range(size: number, options?: { combine?: boolean }): -1|-2|any[]|undefined;
}

/**
 * Class instantiated on each request. It includes:
 * - the express request object,
 * - the user object if available,
 * - the session object if available,
 * - a file list object,
 * - the name of the controller and the name of the method,
 * - and a `state` object that can be used to pass data across several hooks.
 *
 * @export
 * @class Context
 * @template User
 */
export class Context<User = { [key: string]: any } | null, ContextState = { [key: string]: any }> {
  readonly request: Request;
  session: Session | null;

  user: User;
  readonly state: ContextState;
  readonly files: FileList;

  readonly controllerName: string;
  readonly controllerMethodName: string;

  /**
   * Creates an instance of Context.
   * @param {*} request - Either the express request object or a mock (for testing).
   * @param {string} [controllerName=''] - The name of the controller.
   * @param {string} [controllerMethodName=''] - The name of the method.
   * @memberof Context
   */
  constructor(request: any, controllerName: string = '', controllerMethodName: string = '') {
    this.request = request;
    this.session = null;

    this.user = null as any;
    this.state = {} as any;
    this.files = new FileList();

    this.controllerName = controllerName;
    this.controllerMethodName = controllerMethodName;
  }
}
