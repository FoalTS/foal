import { Class, HookDecorator } from '../core';
import { AbstractUser } from './entities';
import { Login } from './login.hook';

export function LoginOptional(options: { redirect?: string, userEntity: Class<AbstractUser> }): HookDecorator {
 return Login(false, options);
}
