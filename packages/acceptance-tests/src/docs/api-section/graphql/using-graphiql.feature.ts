// std
import { } from 'assert';

// 3p
import * as request from 'supertest';

// FoalTS
import { controller, createApp } from '@foal/core';
import { GraphiQLController, GraphiQLControllerOptions } from '@foal/graphiql';

// This set of tests mainly verifies that the code examples in the documentation compile.

describe('Feature: Using GraphiQL', () => {

  it('Example: simple use case.', async () => {

    class GraphqlApiController {}

    /* ======================= DOCUMENTATION BEGIN ======================= */

    class AppController {

      subControllers = [
        // ...
        controller('/graphql', GraphqlApiController),
        controller('/graphiql', GraphiQLController)
      ];

    }

    /* ======================= DOCUMENTATION END ========================= */

    const app = await createApp(AppController);

    await request(app)
      .get('/graphiql')
      .expect(301);

    await request(app)
      .get('/graphiql/')
      .expect(200);
  });

  it('Example: custom GraphiQL Options.', async () => {

    /* ======================= DOCUMENTATION BEGIN ======================= */

    class GraphiQL2Controller extends GraphiQLController {
      options: GraphiQLControllerOptions = {
        docExplorerOpen: true,
      }
    }

    /* ======================= DOCUMENTATION END ========================= */

    class AppController {
      subControllers = [
        controller('/graphiql', GraphiQL2Controller)
      ];
    }

    const app = await createApp(AppController);

    await request(app)
      .get('/graphiql')
      .expect(301);

    await request(app)
      .get('/graphiql/')
      .expect(200);
  });

  it('Example: custom API endpoint.', async () => {

    /* ======================= DOCUMENTATION BEGIN ======================= */

    class GraphiQL2Controller extends GraphiQLController {
      apiEndpoint = '/api';
    }

    /* ======================= DOCUMENTATION END ========================= */

    class AppController {
      subControllers = [
        controller('/graphiql', GraphiQL2Controller)
      ];
    }

    const app = await createApp(AppController);

    await request(app)
      .get('/graphiql')
      .expect(301);

    await request(app)
      .get('/graphiql/')
      .expect(200);

  });

  it('Example: custom CSS theme.', async () => {

    /* ======================= DOCUMENTATION BEGIN ======================= */

    class GraphiQL2Controller extends GraphiQLController {
      cssThemeURL = 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.23.0/theme/solarized.css';

      options: GraphiQLControllerOptions = {
        editorTheme: 'solarized light'
      }
    }

    /* ======================= DOCUMENTATION END ========================= */

    class AppController {
      subControllers = [
        controller('/graphiql', GraphiQL2Controller)
      ];
    }

    const app = await createApp(AppController);

    await request(app)
      .get('/graphiql')
      .expect(301);

    await request(app)
      .get('/graphiql/')
      .expect(200);

  });

});
