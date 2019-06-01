import { strictEqual } from 'assert';
import { Session } from './session';
import { SessionStore } from './session-store';

describe('SessionStore', () => {

  describe('has a "generateID" method that', () => {

    it('should generate a random base64url-encoded string which size is 128 bits.', async () => {
      class Store extends SessionStore {
        getID(): Promise<string> {
          return this.generateSessionID();
        }

        async createAndSaveSession() { return new Session('a', {}, 0); }
        async destroy() {}
        async extendLifeTime() {}
        async read() { return new Session('a', {}, 0); }
        async update() {}
      }

      const id = await new Store().getID();
      const buffer = Buffer.from(id, 'base64');
      strictEqual(buffer.length, 32);
      strictEqual(id.includes('='), false);

      // The below tests are bad because the ID is different each time this test is ran.
      strictEqual(id.includes('+'), false);
      strictEqual(id.includes('/'), false);
    });

  });

});
