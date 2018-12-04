// 3p
import { VerifyOptions } from 'jsonwebtoken';

// FoalTS
import { JWT, JWTOptions } from './jwt.hook';

export function JWTOptional(options: JWTOptions = {}, verifyOptions: VerifyOptions = {}) {
  return JWT(false, options, verifyOptions);
}
