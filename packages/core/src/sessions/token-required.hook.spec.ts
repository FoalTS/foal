// FoalTS
import { TokenRequired } from './token-required.hook';
import { testSuite } from './use-sessions.hook.spec';

describe('TokenRequired', () => testSuite(TokenRequired, true));
