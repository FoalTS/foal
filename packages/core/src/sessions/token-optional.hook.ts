// FoalTS
import { HookDecorator } from '../core';
import { Token, TokenOptions } from './token.hook';

export function TokenOptional(options: TokenOptions): HookDecorator {
  return Token(false, options);
}
