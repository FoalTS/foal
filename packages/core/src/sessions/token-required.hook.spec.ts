// FoalTS
import { TokenRequired } from './token-required.hook';
import { testSuite } from './token.hook.spec';

describe('TokenRequired', () => testSuite(TokenRequired, true));
