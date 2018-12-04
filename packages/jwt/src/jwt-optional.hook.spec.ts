// FoalTS
import { JWTOptional } from './jwt-optional.hook';
import { testSuite } from './jwt.hook.spec';

describe('JWTOptional', () => testSuite(JWTOptional, false));
