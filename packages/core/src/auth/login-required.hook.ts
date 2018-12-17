import { HookDecorator } from '../core';
import { Login } from './login.hook';

export function LoginRequired(
    options: { redirect?: string, user: (id: number|string) => Promise<any> }): HookDecorator {
  return Login(true, options);
}
