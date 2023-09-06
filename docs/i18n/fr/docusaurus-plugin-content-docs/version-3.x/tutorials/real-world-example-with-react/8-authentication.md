---
title: Connecter les Utilisateurs
id: tuto-8-authentication
slug: 8-authentication
---

Les posts sont affichées sur la page d'accueil. Si nous voulons que les utilisateurs puissent publier de nouveaux posts et télécharger une photo de profil, nous devons leur permettre de se connecter à l'application.

Pour ce faire, nous allons utiliser les sessions de Foal avec des cookies.

> FoalTS offre de nombreuses options pour authentifier les utilisateurs. Par exemple, vous pouvez envoyer des jetons (*tokens*) de session avec l'en-tête `Authorization` ou utiliser des jetons sans état avec JWT. Nous n'allons pas explorer toutes ces possibilités dans ce tutoriel mais vous pouvez trouver la documentation complète [ici](../../authentication/quick-start.md).

Ouvrez le fichier `api.controller.ts` et ajoutez le hook `@UseSessions` en haut de la classe.

```typescript
import { ApiInfo, ApiServer, controller, UseSessions } from '@foal/core';
import { User } from '../entities';
import { StoriesController } from './api';

@ApiInfo({
  title: 'Application API',
  version: '1.0.0'
})
@ApiServer({
  url: '/api'
})
@UseSessions({
  cookie: true,
  user: (id: number) => User.findOneBy({ id }),
})
export class ApiController {

  subControllers = [
    controller('/stories', StoriesController),
  ];

}

```

Lorsqu'il est utilisé avec l'option `cookie`, ce hook garantit que `ctx.session` est toujours défini dans chaque méthode du contrôleur et de ses sous-contrôleurs. Cet objet peut être utilisé pour stocker des informations entre plusieurs requêtes, comme un ID d'utilisateur par exemple. Vous l'utiliserez pour authentifier les utilisateurs.

> En arrière-plan, Foal génère un jeton de session unique pour chaque utilisateur utilisant l'API et le stocke dans un cookie sur l'hôte du client. Lorsque le client effectue une nouvelle requête, le navigateur envoie automatiquement le jeton avec la requête afin que le serveur puisse récupérer les informations de session. Les données de session sont stockées dans la base de données dans la table *sessions*.
>
> Mais vous n'avez pas à vous en préoccuper, tout est géré par Foal.

Créez un nouveau contrôleur.

```bash
foal generate controller api/auth --register
```

Ouvrez le nouveau fichier créé et ajoutez deux routes.

| Point de terminaison | Méthode | Description |
| --- | --- | --- |
| `/api/auth/login` | `POST` | Connecte l'utilisateur. Un email et un mot de passe sont attendus dans le corps de la requête. |
| `/api/auth/logout` | `POST` | Déconnecte l'utilisateur. |

```typescript
import { Context, hashPassword, HttpResponseNoContent, HttpResponseOK, HttpResponseUnauthorized, Post, ValidateBody, verifyPassword } from '@foal/core';
import { User } from '../../entities';

const credentialsSchema = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email', maxLength: 255 },
    password: { type: 'string' }
  },
  required: [ 'email', 'password' ],
  additionalProperties: false,
};

export class AuthController {

  @Post('/login')
  @ValidateBody(credentialsSchema)
  async login(ctx: Context<User|null>) {
    const email = ctx.request.body.email;
    const password = ctx.request.body.password;

    const user = await User.findOneBy({ email });
    if (!user) {
      return new HttpResponseUnauthorized();
    }

    if (!(await verifyPassword(password, user.password))) {
      return new HttpResponseUnauthorized();
    }

    ctx.session!.setUser(user);
    ctx.user = user;

    return new HttpResponseOK({
      id: user.id,
      name: user.name,
    });
  }

  @Post('/logout')
  async logout(ctx: Context) {
    await ctx.session!.destroy();
    return new HttpResponseNoContent();
  }

}

```

La méthode `login` vérifie d'abord que l'utilisateur existe et que les informations d'identification fournies sont correctes. Si c'est le cas, elle associe l'utilisateur à la session en cours.

Lors des requêtes suivantes, le hook *UseSessions* récupérera l'ID de l'utilisateur dans la session et définira la propriété `ctx.user` en conséquence. Si l'utilisateur ne s'est pas encore connecté, la propriété `ctx.user` sera `null`. Dans le cas contraire, `ctx.user` sera une instance de `User`. Ceci est rendu possible par l'option `user` que nous avons fournie au hook plus tôt. Il s'agit en fait la fonction qui prend l'ID de l'utilisateur comme paramètre et retourne la valeur à assigner à `ctx.user`.

