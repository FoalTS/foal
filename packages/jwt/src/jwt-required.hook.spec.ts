// FoalTS
import { JWTRequired } from './jwt-required.hook';
import { test } from './jwt.hook.spec';

describe('JWTRequired', () => test(JWTRequired, true));
