// 3p
import * as Ajv from 'ajv';

// FoalTS
import {
  Class,
  Context,
  Get,
  HttpResponseBadRequest,
  HttpResponseNoContent,
  HttpResponseNotFound,
  HttpResponseRedirect,
  HttpResponseUnauthorized,
  Post,
  ServiceManager
} from '../../core';
import { IAuthenticator } from './authenticator.interface';

const ajv = new Ajv();

export interface Strategy {
  name: string;
  authenticatorClass: Class<IAuthenticator>;
  schema: object;
}

export function strategy(name: Strategy['name'],
                         authenticatorClass: Strategy['authenticatorClass'],
                         schema: Strategy['schema']): Strategy {
  return { name, authenticatorClass, schema };
}

export abstract class LoginController {
  redirect: { logout?: string, success?: string, failure?: string } | undefined;
  abstract strategies: Strategy[];

  constructor(private services: ServiceManager) {}

  @Get('/logout')
  logout(ctx: Context) {
    delete ctx.request.session.authentication;
    if (this.redirect && this.redirect.logout) {
      return new HttpResponseRedirect(this.redirect.logout);
    }
    return new HttpResponseNoContent();
  }

  @Post('/:strategy')
  async login(ctx: Context) {
    const strategyName = ctx.request.params.strategy;
    const strategy = this.strategies.find(strategy => strategy.name === strategyName);

    if (!strategy) {
      return new HttpResponseNotFound();
    }

    const isValid = ajv.validate(strategy.schema, ctx.request.body);
    if (!isValid) {
      return new HttpResponseBadRequest(ajv.errors);
    }

    const authenticator = this.services.get(strategy.authenticatorClass);
    const user = await authenticator.authenticate(ctx.request.body);

    if (user === null) {
      const redirectPath = this.redirect && this.redirect.failure;
      return redirectPath ? new HttpResponseRedirect(redirectPath) : new HttpResponseUnauthorized();
    }

    ctx.request.session.authentication = {
      ...ctx.request.session.authentication,
      userId: user.id
    };

    const redirectPath = this.redirect && this.redirect.success;
    return redirectPath ? new HttpResponseRedirect(redirectPath) : new HttpResponseNoContent();
  }
}
