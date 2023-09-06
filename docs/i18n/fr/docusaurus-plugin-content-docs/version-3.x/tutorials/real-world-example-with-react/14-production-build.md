---
title: Construction de Production
id: tuto-14-production-build
slug: 14-production-build
---

Jusqu'à présent, les applications frontend et backend sont compilées et servies par deux serveurs de développement différents. L'étape suivante consiste à les regrouper en un seul serveur prêt pour la production.

## Construction de l'Application React

Dans le répertoire de votre frontend, exécutez la commande suivante :

```bash
npm run build
```

Cette commande construit l'application React pour la production et enregistre les fichiers dans le répertoire `build`.

Ouvrez-le et copiez tout son contenu dans le répertoire `public` de votre application Foal.

> Lorsque vous utilisez `foal connect` avec Angular ou Vue, le frontend build enregistrera automatiquement les fichiers dans `public`.

Maintenant, si vous naviguez vers [http://localhost:3001](http://localhost:3001), vous verrez l'application frontend servie par le serveur dorsal.

## Prévention des erreurs 404

Ouvrez le lien [http://localhost:3001/login](http://localhost:3001/login) dans un nouvel onglet. Le serveur renvoie une erreur 404.

C'est tout à fait normal. Pour le moment, le serveur n'a pas de gestionnaire pour la route `/login` et renvoie donc cette erreur. Auparavant, ce problème était géré par le serveur de développement React, c'est pourquoi cette erreur n'existait pas.

Pour résoudre ce problème, vous allez ajouter une méthode de contrôleur qui traitera les requêtes non traitées.

Ouvrez `app.controller.ts` et mettez à jour son contenu.

```typescript
import { Context, controller, Get, HttpResponseNotFound, IAppController, render } from '@foal/core';

import { ApiController, OpenapiController } from './controllers';

export class AppController implements IAppController {
  subControllers = [
    controller('/api', ApiController),
    controller('/swagger', OpenapiController)
  ];

  @Get('*')
  renderApp(ctx: Context) {
    if (!ctx.request.accepts('html')) {
      return new HttpResponseNotFound();
    }

    return render('./public/index.html');
  }
}

```

Cette méthode renvoie l'application React pour toute requête GET qui accepte du contenu HTML et qui n'a pas été traitée par les autres méthodes du contrôleur et de ses sous-contrôleurs.

Si vous retournez à [http://localhost:3001/login](http://localhost:3001/login) et rafraîchissez la page, la page de connexion devrait s'afficher.

## Construction de l'Application Foal

Maintenant, si vous voulez construire l'application backend sans utiliser l'option `npm run dev`, vous pouvez exécuter cette commande :

```bash
npm run build
```

Ensuite, pour lancer l'application, il suffit d'exécuter ce qui suit :

```bash
npm run start
```