export interface RestController {
  create?: (data: any, query: object) => Promise<any>;
  get?: (id: any, query: object) => Promise<any>;
  getAll?: (query: object) => Promise<any>;
  update?: (id: any, data: any, query: object) => Promise<any>;
  patch?: (id: any, data: any, query: object) => Promise<any>;
  delete?: (id: any, query: object) => Promise<any>;
}
