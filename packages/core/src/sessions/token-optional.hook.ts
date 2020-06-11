// FoalTS
import { HookDecorator } from '../core';
import { Token, TokenOptions } from './token.hook';

// TODO: Add missing documentation.

export function TokenOptional(options: TokenOptions): HookDecorator {
  return Token(false, options);
}
