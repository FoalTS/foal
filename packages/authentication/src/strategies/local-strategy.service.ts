import { ReadService } from '@foal/common';
import { ObjectType, Service } from '@foal/core';
import { Strategy as LocalStrategy } from 'passport-local';

import { Strategy } from './strategy.interface';

@Service()
export abstract class LocalStrategyService {
  public readonly passportStrategy: any;
  protected userService: ReadService;

  constructor(options: ObjectType = {}) {
    this.passportStrategy = new LocalStrategy(options, async (username, password, done) => {
      try {
        const user = await this.verify(username, password);
        done(null, user);
      } catch (err) {
        done(err);
      }
    });
  }

  public init(userService: ReadService) {
    this.userService = userService;
  }

  public async verify(username, password) {
    if (!this.userService) {
      throw new Error('Please call init first with a ReadService.');
    }

    const users = await this.userService.getAll({ username });
    if (users.length === 0) {
      // Use an HttpError instead.
      throw new Error('Wrong username or password.');
    }

    const user = users[0];
    // Q: Est-ce qu'on le met dans le CRUD service? Ca devient compliqué
    // de gérer ce cas là avec Sequelize, Mongoose services etc.
    // Ou dans le constructor une fonction d'encryption par défaut. Mais que se passe-t-il
    // quand on crée un utilisateur avec un mdp ? Créer un service d'encryption ?
    // Ca rajoute pas trop de complexité ?
    // C'est juste spécifique à la stratégie locale a priori.
    // if (!this.userService.verifyPassword(user, password)) {
    if (password !== user.password) {
      // Use an HttpError instead.
      throw new Error('Wrong username or password.');
    }

    return user;
  }
}
