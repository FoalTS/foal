import { ReadService } from '@foal/common';
import { Service } from '@foal/core';
import * as passport from 'passport';

import { Strategy } from './strategies';

@Service()
export abstract class AuthenticatorService {

  constructor(userService: ReadService, strategies: Strategy[]) {
    for (const strategy of strategies) {
      strategy.init(userService);
      passport.use(strategy.passportStrategy);
    }

    passport.serializeUser((user, done) => done(null, user.id));

    passport.deserializeUser(async (id, done) => {
      try {
        const user = await userService.get(id, {});
        done(null, user);
      } catch (err) {
        done(err);
      }
    });
  }

}
