// std
import { strictEqual } from 'assert';

// FoalTS
import { Context, getHookFunction, Hook, ServiceManager } from '@foal/core';

describe('Feature: Mocking services in hooks', () => {

  describe('Example: Returning "Hello world!"', () => {

    /* ======================= DOCUMENTATION BEGIN ======================= */

    // authenticate.hook.ts
    class UserService {
      private users: any = {
        eh4sb: { id: 1, name: 'John' },
        kadu5: { id: 2, name: 'Mary' }
      };

      getUser(key: string) {
        return this.users[key] ?? null;
      }
    }

    const authenticate = Hook((ctx, services) => {
      const users = services.get(UserService);
      ctx.user = users.getUser(ctx.request.params.key);
    });

    // authenticate.hook.spec.ts
    it('authenticate', () => {
      const hook = getHookFunction(authenticate);

      const user = { id: 3, name: 'Bob' };

      const ctx = new Context({ params: { key: 'xxx' }});
      const services = new ServiceManager();
      services.set(UserService, {
        getUser() {
          return user;
        }
      });

      hook(ctx, services);

      strictEqual(ctx.user, user);
    });

    /* ======================= DOCUMENTATION END ========================= */

  });

});
