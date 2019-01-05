// FoalTS
import { LoginRequired } from './login-required.hook';
import { testSuite } from './login.hook.spec';

describe('LoginRequired', () => testSuite(LoginRequired, true));
