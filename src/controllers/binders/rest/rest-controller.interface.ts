import { RequestWithContext } from '../../interfaces';

export interface RestParams {
  query: { [name: string]: any };
}

export interface RestContext {
  id: any;
  data: any;
  params: RestParams;
}

export interface RequestWithRestContext extends RequestWithContext {
  foal: {
    context: RestContext;
  };
}

export interface RestController {
  create?: (data: any, params: any) => Promise<any>;
  get?: (id: any, params: any) => Promise<any>;
  update?: (id: any, data: any, params: any) => Promise<any>;
  patch?: (id: any, data: any, params: any) => Promise<any>;
  delete?: (id: any, params: any) => Promise<any>;
}
