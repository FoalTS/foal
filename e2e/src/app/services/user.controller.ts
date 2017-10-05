import * as bodyParser from 'body-parser';

import {
  combineDecorators,
  logger,
  methodNotAllowed,
  NotFoundError,
  preHook,
  RestController,
  RestParams,
  Service
} from '@foal/core';

@Service()
@logger('User service')
export class User implements RestController {
  constructor() {}

  @logger('create')
  public async create(data: any, params: RestParams): Promise<any> {
    return 1;
  }

  @combineDecorators([
    logger('Get 1'),
    logger('Get 2')
  ])
  @preHook(async ctx => {
    console.log(ctx);
    return ctx;
  })
  public async get(id: any, params: RestParams): Promise<any> {
    throw new NotFoundError();
  }

  @methodNotAllowed()
  public async getAll(params: RestParams): Promise<any> {
    return 'You got it all';
  }

  @logger('update')
  public async update(id: any, data: any, params: RestParams): Promise<any> {
    console.log('id', id);
    console.log('data', data);
    console.log('params', params);
    return Promise.resolve();
  }

  @logger('patch')
  @preHook(ctx => Promise.resolve(ctx))
  public async patch(id: any, data: any, params: RestParams): Promise<any> {
    console.log('id', id);
    console.log('data', data);
    console.log('params', params);
    return Promise.resolve();
  }

  @logger('delete')
  public async delete(id: any, params: RestParams): Promise<any> {
    console.log('id', id);
    console.log('params', params);
    return Promise.resolve();
  }
}
