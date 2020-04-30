declare module 'express' {
  import { Express, RequestHandler, Response, Router as IRouter } from 'express-serve-static-core';

  function express(): Express;

  namespace express {
    function Router(options?: {
      caseSensitive?: boolean;
      mergeParams?: boolean;
      strict?: boolean;
    }): IRouter;

    function json(options?: {
      strict?: boolean;
      inflate?: boolean;
      limit?: number | string;
      type?: string | string[] | ((req: any) => any);
      reviver?(key: string, value: any): any;
      verify?(req: any, res: any, buf: Buffer, encoding: string): void;
    }): RequestHandler;

    function text(options?: {
      defaultCharset?: string;
      inflate?: boolean;
      limit?: number | string;
      type?: string | string[] | ((req: any) => any);
      verify?(req: any, res: any, buf: Buffer, encoding: string): void;
    }): RequestHandler;

    function urlencoded(options?: {
      extended?: boolean;
      parameterLimit?: number;
      inflate?: boolean;
      limit?: number | string;
      type?: string | string[] | ((req: any) => any);
      verify?(req: any, res: any, buf: Buffer, encoding: string): void;
    }): RequestHandler;

    function static(root: string, options?: {
      cacheControl?: boolean;
      dotfiles?: string;
      etag?: boolean;
      extensions?: string[];
      fallthrough?: boolean;
      immutable?: boolean;
      index?: boolean | string | string[];
      lastModified?: boolean;
      maxAge?: number | string;
      redirect?: boolean;
      setHeaders?: (res: Response, path: string, stat: any) => any;
    }): RequestHandler;
  }
  export = express;
}
