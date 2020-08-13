// std
import { strictEqual } from 'assert';

// FoalTS
import { SessionStore } from './session-store';

describe('SessionStore', () => {

  it('should support concrete services.', () => {
    strictEqual(SessionStore.concreteClassConfigPath, 'settings.session.store');
    strictEqual(SessionStore.concreteClassName, 'ConcreteSessionStore');
  });

});
