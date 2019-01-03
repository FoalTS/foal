// FoalTS
import { LoginOptional } from './login-optional.hook';
import { testSuite } from './login.hook.spec';

describe('LoginOptional', () => testSuite(LoginOptional, false));
