// FoalTS
import { SocketIOController } from '@foal/socket.io';

describe('Feature: Passing custom server options', () => {

  it('Example: simple example that tests that the code compiles.', async () => {

    /* ======================= DOCUMENTATION BEGIN ======================= */

    // tslint:disable-next-line
    class WebsocketController extends SocketIOController {

      options = {
        connectTimeout: 60000
      }

    }

    /* ======================= DOCUMENTATION END ========================= */

  });

});
