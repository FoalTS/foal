import { ControllerFactory, Route } from '@foal/core';

import { AuthenticatorService } from './authenticator.service';

export class AuthenticationFactory extends ControllerFactory<AuthenticatorService> {
  public getRoutes(service: AuthenticatorService): Route[] {
    return [

    ];
  }
}

export const authentication = new AuthenticationFactory();
