import {
  log,
  methodNotAllowed,
  NotFoundError,
  ObjectType,
  preHook,
  RestController,
  Service
} from '@foal/core';

@Service()
@log('User (1)')
@log('User (2)')
export class User implements RestController {
  constructor() {}

  public async create(data: any, query: ObjectType): Promise<any> {
    console.log(data);
    return 1;
  }

  @preHook(ctx => {
    console.log(ctx);
  })
  public async get(id: any, query: ObjectType): Promise<any> {
    throw new NotFoundError();
  }

  @methodNotAllowed()
  public async getAll(query: ObjectType): Promise<any> {
    return 'You got it all';
  }

  @log('update (1)')
  @log('update (2)')
  public async update(id: any, data: any, query: ObjectType): Promise<any> {
    console.log('id', id);
    console.log('data', data);
    console.log('query', query);
    return Promise.resolve();
  }

  @preHook(ctx => Promise.resolve(ctx))
  public async patch(id: any, data: any, query: ObjectType): Promise<any> {
    console.log('id', id);
    console.log('data', data);
    console.log('query', query);
    return Promise.resolve();
  }

  public async delete(id: any, query: ObjectType): Promise<any> {
    console.log('id', id);
    console.log('query', query);
    return Promise.resolve();
  }
}
