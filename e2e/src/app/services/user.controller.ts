import * as bodyParser from 'body-parser';

import { combineDecorators, ExtendedRequest, Injectable, logger, newContextualDecorator,
  newExpressDecorator, NotFoundError, RestController, RestParams } from '@foal/core';

import { restrictToAdmin } from '../decorators/restrict-to-admin.decorator';

@Injectable()
@logger('User service')
@newExpressDecorator(bodyParser.urlencoded({ extended: false }))
@newExpressDecorator(bodyParser.json())
export class User implements RestController {
  constructor() {}

  @logger('create')
  public async create(data: any, params: RestParams): Promise<any> {
    return data;
  }

  @combineDecorators([
    logger('Get 1'),
    logger('Get 2')
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

  @logger('update')
  public async update(id: any, data: any, params: RestParams): Promise<any> {
    console.log('id', id);
    console.log('data', data);
    console.log('params', params);
    return Promise.resolve();
  }

  @logger('patch')
  @newExpressDecorator((req, res, next) => next())
  @newContextualDecorator(ctx => Promise.resolve(ctx))
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
