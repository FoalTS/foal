import { Class, HookDecorator } from '../core';
import { AbstractUser } from './entities';
import { Login } from './login.hook';

export function LoginRequired(options: { redirect?: string, userEntity: Class<AbstractUser> }): HookDecorator {
 return Login(options);
}
