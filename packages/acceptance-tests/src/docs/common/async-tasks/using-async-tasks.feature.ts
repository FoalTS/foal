
import { AsyncService, dependency } from '@foal/core';

// This set of tests mainly verifies that the code examples in the documentation compile.

describe('Feature: Using async tasks', () => {

  it('Example: simple use case.', async () => {

    class CRMService {
      async updateUser(userId: number): Promise<void> {}
    }

    /* ======================= DOCUMENTATION BEGIN ======================= */

    // tslint:disable-next-line:no-unused-variable
    class SubscriptionService {
      @dependency
      asyncService: AsyncService;

      @dependency
      crmService: CRMService;

      async subscribe(userId: number): Promise<void> {
        // Do something

        this.asyncService.run(() => this.crmService.updateUser(userId));
      }
    }

    /* ======================= DOCUMENTATION END ========================= */

  });

});