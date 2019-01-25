// 3p
import { HookDecorator } from '@foal/core';
import { VerifyOptions } from 'jsonwebtoken';

// FoalTS
import { JWT, JWTOptions } from './jwt.hook';

export function JWTOptional(options: JWTOptions = {}, verifyOptions: VerifyOptions = {}): HookDecorator {
  return JWT(false, options, verifyOptions);
}
