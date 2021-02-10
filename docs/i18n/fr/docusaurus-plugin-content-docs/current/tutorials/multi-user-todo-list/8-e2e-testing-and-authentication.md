---
title: Tests de bout en bout & Authentication
---

La dernière partie de ce tutoriel explique comment écrire et exécuter des tests *de bout en bout*. Le but de ces tests n'est pas de vérifier que chaque fonctionnalité de chaque composant fonctionne, mais de vérifier que ces composants fonctionnent correctement ensemble.

Les tests sont situés dans le répertoire `src/e2e/`. La commande pour les exécuter en développement est `npm run e2e`. Les tests E2E utilisent généralement la bibliothèque `supertest` qui fournit une abstraction de haut niveau pour tester HTTP.

Ouvrez `index.ts` dans `src/e2e` et remplacez son contenu.

```typescript
// std
// The `assert` module provides a simple set of assertion tests.
import { ok } from 'assert';

// 3p
import { createApp } from '@foal/core';
import * as request from 'supertest';
import { getConnection } from 'typeorm';

// App
import { AppController } from '../app/app.controller';
import { User } from '../app/entities';

// Define a group of tests.
describe('The server', () => {

  let app: any;

  // Create the application and the connection to the database before running all the tests.
  before(async () => {
    app = await createApp(AppController);
  });

  // Close the database connection after running all the tests whether they succeed or failed.
  after(() => getConnection().close());

  // Define a nested group of tests.
  describe('on GET /api/todos requests', () => {

    it('should return a 401 status if the user did not signed in.', () => {
      return request(app)
        .get('/api/todos')
        .expect(401);
    });

    it('should return a 200 status if the user did signed in.', async () => {
      // Create a new user in the empty database.
      const user = new User();
      user.email = 'john@foalts.org';
      await user.setPassword('john_password');
      await getConnection().manager.save(user);

      // Log the user in.
      let cookie = '';
      await request(app)
        .post('/auth/login')
        // Set the body of the request
        .send({ email: 'john@foalts.org', password: 'john_password' })
        // The response should have the status 302 (redirection)
        .expect(302)
        .then(data => {
          // The response should set the authentication cookie for the next requests.
          ok(Array.isArray(data.header['set-cookie']));
          // Save the cookie to be able to use it in further requests.
          cookie = data.header['set-cookie'][0];
        });

      // Test the /api/todos endpoint when the user has logged in.
      return request(app)
        .get('/api/todos')
        // Send the authentication cookie.
        .set('Cookie', cookie)
        .expect(200);
    });

  });

});

```

Maintenant, lancez les tests.

```
npm run e2e
```

La sortie devrait ressembler à ceci :

![Sortie des tests de bout en bout](./e2e_output.png)

Félicitations, vous êtes arrivé à la fin de ce tutoriel !
