import * as bodyParser from 'body-parser';

import { combineDecorators, expressLogger, ExtendedRequest, Injectable, newContextualDecorator,
  newExpressDecorator, NotFoundError, RestController, RestParams } from '@foal/core';

import { restrictToAdmin } from '../decorators/restrict-to-admin.decorator';

@Injectable()
@expressLogger('User service')
@newExpressDecorator(bodyParser.urlencoded({ extended: false }))
@newExpressDecorator(bodyParser.json())
export class User implements RestController {
  constructor() {}

  @expressLogger('create')
  public async create(data: any, params: RestParams): Promise<any> {
    return data;
  }

  @combineDecorators([
    expressLogger('Get 1'),
    expressLogger('Get 2')
  ])
  @newExpressDecorator((req: ExtendedRequest, res, next) => {
    req.user = { roles: ['admin', 'user'] };
    next();
  }, [{ req: 'user', ctx: 'user' }])
  @restrictToAdmin()
  @newContextualDecorator(async ctx => {
    console.log(ctx);
    return ctx;
  })
  public async get(id: any, params: RestParams): Promise<any> {
    throw new NotFoundError();
  }

  @expressLogger('update')
  public async update(id: any, data: any, params: RestParams): Promise<any> {
    console.log('id', id);
    console.log('data', data);
    console.log('params', params);
    return Promise.resolve();
  }

  @expressLogger('patch')
  @newExpressDecorator((req, res, next) => next())
  @newContextualDecorator(ctx => Promise.resolve(ctx))
  public async patch(id: any, data: any, params: RestParams): Promise<any> {
    console.log('id', id);
    console.log('data', data);
    console.log('params', params);
    return Promise.resolve();
  }

  @expressLogger('delete')
  public async delete(id: any, params: RestParams): Promise<any> {
    console.log('id', id);
    console.log('params', params);
    return Promise.resolve();
  }
}
