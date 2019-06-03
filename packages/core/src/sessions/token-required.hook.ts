// FoalTS
import { HookDecorator } from '../core';
import { Token, TokenOptions } from './token.hook';

export function TokenRequired(options: TokenOptions): HookDecorator {
  return Token(true, options);
}
