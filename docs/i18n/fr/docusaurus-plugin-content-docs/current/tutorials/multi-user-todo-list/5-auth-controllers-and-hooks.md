---
title: Contrôleurs & Hooks d'Authentification
---

Jusqu'à présent, vous avez défini le modèle `User` et écrit un script pour créer de nouveaux utilisateurs avec leur mot de passe et leur adresse email. L'étape suivante consiste à créer un contrôleur pour connecter ou déconnecter les utilisateurs.

Voici l'architecture que nous voulons :

1. Les utilisateurs ouvrent la page `/signin`, entrent leurs identifiants et sont ensuite redirigés vers la page `/` si les identifiants sont corrects. S'ils ne le sont pas, la page est rafraîchie avec un message d'erreur.
1. Les utilisateurs peuvent voir, créer et supprimer leurs todos sur la page `/`.
1. Lorsqu'ils cliquent sur le bouton `Log out`, ils sont déconnectés et redirigés vers la page `/signin`.

Lorsque l'utilisateur appuie sur le bouton `Log in` dans la page de connexion, la page envoie une requête `POST /auth/login` avec les informations d'identification dans le corps.

Lorsque l'utilisateur appuie sur le bouton `Log out` dans la page de la liste de tâches, la page envoie une requête `POST /auth/logout`.

> Dans ce scénario, le processus d'authentification est géré avec des sessions et des redirections HTTP. Vous n'utiliserez pas les [jetons JWT](https://en.wikipedia.org/wiki/JSON_Web_Token#Use) qui sont parfois utilisés dans les *Single Page Applications* (SPA).

## Les Pages Principale et de Connexion

Téléchargez les fichiers html, css et js en cliquant [ici](https://foalts.org/multi-user-todo-list-v2.zip).

Videz le répertoire `public/`.

Déplacez ensuite les fichiers `script.js` et `style.css` vers `public/` et les fichiers `index.html`, `signin.html` et `signup.html` vers un nouveau répertoire `templates/` à la racine de votre projet.

Ouvrez le fichier `app.controller.ts` et ajoutez trois nouvelles routes pour servir les pages.

```typescript
import { Context, controller, Get, IAppController, render, Session, UseSessions } from '@foal/core';
import { fetchUser } from '@foal/typeorm';
import { createConnection } from 'typeorm';

import { ApiController } from './controllers';
import { User } from './entities';

@UseSessions({
  cookie: true,
  user: fetchUser(User)
})
export class AppController implements IAppController {
  subControllers = [
    controller('/api', ApiController)
  ];

  async init() {
    await createConnection();
  }

  @Get('/')
  index() {
    return render('templates/index.html');
  }

  @Get('/signin')
  signin(ctx: Context<any, Session>) {
    return render('templates/signin.html', { error: ctx.session.get('error', '') });
  }
  
  @Get('/signup')
  signup(ctx: Context<any, Session>) {
    return render('templates/signup.html', { error: ctx.session.get('error', '') });
  }
}
```

Ouvrez votre navigateur et allez sur http://localhost:3001/signin. La page de connexion devrait s'afficher.

## Contrôleurs de Connexion

L'étape suivante consiste à créer un contrôleur qui connecte ou déconnecte les utilisateurs et les redirige après la réussite ou l'échec de l'opération. Il a besoin de deux routes `/login` et `/logout`.

```
foal generate controller auth --register
```

> Le drapeau `--register` ajoute directement une nouvelle ligne dans `app.controller.ts` pour déclarer l'`AuthController` comme un sous-contrôleur de `AppController`.

Ouvrez le nouveau fichier `auth.controller.ts` et remplacez son contenu.

```typescript
// 3p
import {
  Context, dependency, HttpResponseRedirect, Post, Session,
  Store, ValidateBody, verifyPassword
} from '@foal/core';

import { User } from '../entities';

export class AuthController {
  // This line is required.
  @dependency
  store: Store;

  @Post('/login')
  // Validate the request body.
  @ValidateBody({
    additionalProperties: false,
    properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string' }
    },
    required: ['email', 'password'],
    type: 'object',
  })
  async login(ctx: Context<User, Session>) {
    const user = await User.findOne({ email: ctx.request.body.email });

    if (!user) {
      // Redirect the user to /signin if the authentication fails.
      ctx.session.set('error', 'Invalid email or password.', { flash: true });
      return new HttpResponseRedirect('/signin');
    }

    if (!await verifyPassword(ctx.request.body.password, user.password)) {
      // Redirect the user to /signin if the authentication fails.
      ctx.session.set('error', 'Invalid email or password.', { flash: true });
      return new HttpResponseRedirect('/signin');
    }

    // Associate the current session with the authenticated user.
    ctx.session.setUser(user);

    // Redirect the user to the home page on success.
    return new HttpResponseRedirect('/');
  }

  @Post('/logout')
  async logout(ctx: Context) {
    // Destroy the user session.
    if (ctx.session) {
      await ctx.session.destroy();
    }

    // Redirect the user to the home page on success.
    return new HttpResponseRedirect('/signin');
  }
}

```

> Ecrire `User.findOne({ email: email, password: password })` ne peut pas fonctionner car le mot de passe doit être haché.

Retournez à votre navigateur et essayez de vous connecter avec l'e-mail `john@foalts.org` et le mot de passe `mary_password`. Vous êtes redirigé vers la même page et le message `Invalid email or password.` apparaît. Utilisez maintenant le mot de passe `john_password` et essayez de vous connecter. Vous êtes redirigé vers la page todo-list où tous les todos sont répertoriés. Si vous cliquez sur le bouton `Log out`, vous êtes alors redirigé vers la page de connexion !

## Contrôle d'accès

Super, jusqu'à présent vous pouvez authentifier les utilisateurs. Mais comme vous n'avez pas encore ajouté le contrôle d'accès à la page "todo-list" et à l'API, les utilisateurs non authentifiés peuvent toujours y accéder.

La façon habituelle de gérer les autorisations est d'utiliser un *hook*. Dans ce cas, vous allez utiliser le hook intégré `UserRequired` qui renvoie une erreur 401 ou redirige l'utilisateur si celui-ci n'est pas connecté. 

Mettez à jour `app.controller.ts`.

```typescript
import { Context, controller, Get, IAppController, render, Session, UserRequired, UseSessions } from '@foal/core';

import { ApiController, AuthController } from './controllers';

// ...
export class AppController extends IAppController {

  // ...

  @Get('/')
  @UserRequired({
    // Redirect to /signin if the user is not authenticated.
    redirectTo: '/signin'
  })
  index() {
    // ...
  }

  // ...

}
```

Mettez à jour `api.controller.ts`.

```typescript
import {
  Context, Delete, Get, HttpResponseCreated, HttpResponseNoContent,
  HttpResponseNotFound, HttpResponseOK, Post,
  UserRequired, ValidateBody, ValidatePathParam
} from '@foal/core';

import { Todo, User } from '../entities';

@UserRequired()
export class ApiController {

  ...

}
```

> Lorsqu'un hook décore une classe de contrôleur, il s'applique à toutes les routes du contrôleur et de ses sous-contrôleurs.

Allez sur `http://localhost:3001`. Si vous n'êtes pas connecté, vous devriez être redirigé vers la page de connexion.