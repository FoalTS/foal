import { Class } from './class.interface';
import { Context, HttpResponse } from './http';

export interface IController {
  subControllers?: Class<IController>[];
  [key: string]: any;
}

export interface IAppController extends IController {
  init?(): void|Promise<void>;
  handleError?(error: Error, ctx: Context): HttpResponse|Promise<HttpResponse>;
}
