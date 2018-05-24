import { IModelService, isObjectDoesNotExist } from '@foal/common';
import { Class, PreHook } from '@foal/core';
import { getManager } from 'typeorm';

import { AbstractUser } from './abstract-user';

export function authenticate(UserEntity: Class<AbstractUser>): PreHook {
  return async ctx => {
    if (!ctx.session) {
      throw new Error('authenticate pre-hook requires session management.');
    }
    if (!ctx.session.authentication || !ctx.session.authentication.hasOwnProperty('userId')) {
      return;
    }
    try {
      ctx.user = await getManager().findOne(UserEntity, ctx.session.authentication.userId);
    } catch (err) {
      if (!isObjectDoesNotExist(err)) {
        throw err;
      }
    }
  };
}
