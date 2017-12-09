import { ObjectType } from '../../interfaces';

export interface RestController {
  create?: (data: any, query: ObjectType) => Promise<any>;
  get?: (id: any, query: ObjectType) => Promise<any>;
  getAll?: (query: ObjectType) => Promise<any>;
  update?: (id: any, data: any, query: ObjectType) => Promise<any>;
  patch?: (id: any, data: any, query: ObjectType) => Promise<any>;
  delete?: (id: any, query: ObjectType) => Promise<any>;
}
