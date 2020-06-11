// FoalTS
import { HookDecorator } from '../core';
import { Token, TokenOptions } from './token.hook';

// TODO: Add missing documentation.

export function TokenRequired(options: TokenOptions): HookDecorator {
  return Token(true, options);
}
