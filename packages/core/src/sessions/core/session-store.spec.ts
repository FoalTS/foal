// std
import { strictEqual } from 'assert';
import { createService } from '../../core';

// FoalTS
import { SessionState } from './session-state.interface';
import { SessionStore } from './session-store';

describe('SessionStore', () => {
  class Store extends SessionStore {

    save(state: SessionState, maxInactivity: number): Promise<void> {
      throw new Error('Method not implemented.');
    }
    read(id: string): Promise<SessionState | null> {
      throw new Error('Method not implemented.');
    }
    update(state: SessionState, maxInactivity: number): Promise<void> {
      throw new Error('Method not implemented.');
    }
    destroy(id: string): Promise<void> {
      throw new Error('Method not implemented.');
    }
    clear(): Promise<void> {
      throw new Error('Method not implemented.');
    }
    cleanUpExpiredSessions(maxInactivity: number, maxLifeTime: number): Promise<void> {
      throw new Error('Method not implemented.');
    }
  }

  it('should support concrete services.', () => {
    strictEqual(SessionStore.concreteClassConfigPath, 'settings.session.store');
    strictEqual(SessionStore.concreteClassName, 'ConcreteSessionStore');
  });

  it('should have a boot method that does nothing.', async () => {
    const store = createService(Store);
    await store.boot();
  });

});
