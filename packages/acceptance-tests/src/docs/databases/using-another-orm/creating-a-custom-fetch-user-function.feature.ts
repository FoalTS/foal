// std
import { deepStrictEqual, rejects, strictEqual } from 'assert';

// FoalTS
import { FetchUser, ServiceManager } from '@foal/core';

describe('Feature: Creating a custom fetch user function.', () => {

  it('Example: simple example with a dummy model.', async () => {

    /* ======================= DOCUMENTATION BEGIN ======================= */

    function fetchUser(userModel: any): FetchUser {
      return async (id: number|string, services: ServiceManager) => {
        if (typeof id === 'string') {
          throw new Error('The user ID must be a number.');
        }
        const user = await userModel.findOneBy({ id });
        return user;
      };
    }

    /* ======================= DOCUMENTATION END ========================= */

    class User {
      static findOneBy({ id }: { id: number }): any {
        if (id === 1) {
          return { id: 1 };
        }
        return null
      }
    }

    const services = new ServiceManager();

    rejects(
      () => fetchUser(User)('foo', services),
      'The user ID must be a number.'
    );
    deepStrictEqual(await fetchUser(User)(1, services), { id: 1 })
    strictEqual(await fetchUser(User)(2, services), null)

  });

});
