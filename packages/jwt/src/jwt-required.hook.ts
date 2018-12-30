// 3p
import { VerifyOptions } from 'jsonwebtoken';

// FoalTS
import { JWT, JWTOptions } from './jwt.hook';

export function JWTRequired(options: JWTOptions = {}, verifyOptions: VerifyOptions = {}) {
  return JWT(true, options, verifyOptions);
}
