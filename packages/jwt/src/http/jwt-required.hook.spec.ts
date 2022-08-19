// FoalTS
import { JWTRequired } from './jwt-required.hook';
import { testSuite } from './jwt.hook.spec';

describe('JWTRequired', () => testSuite(JWTRequired, true));
