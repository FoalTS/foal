---
title: Ajout de la Page d'Inscription
id: tuto-11-sign-up
slug: 11-sign-up
---

Jusqu'à présent, seuls les utilisateurs créés avec le script `create-user` peuvent se connecter et publier des posts. Dans cette section, vous allez ajouter un nouveau point de terminaison de l'API pour que les utilisateurs puissent s'inscrire avec la page d'inscription.

| Point de terminaison | Méthode | Description |
| --- | --- | --- |
| `/api/auth/signup` | `POST` | Enregistre un nouvel utilisateur. Un email et un mot de passe sont attendus dans le corps de la requête. |

Ouvrez le fichier `auth.controller.ts` et ajoutez une nouvelle route.

```typescript
import { Context, hashPassword, HttpResponseNoContent, HttpResponseOK, HttpResponseUnauthorized, Post, ValidateBody, verifyPassword } from '@foal/core';
import { User } from '../../entities';

const credentialsSchema = {
  // ...
};

export class AuthController {

  // login...

  // logout...

  @Post('/signup')
  @ValidateBody(credentialsSchema)
  async signup(ctx: Context<User|null>) {
    const email = ctx.request.body.email;
    const password = ctx.request.body.password;

    const user = new User();
    user.email = email;
    user.avatar = '';
    user.name = 'Unknown';
    user.password = await hashPassword(password);
    await user.save();

    ctx.session!.setUser(user);
    ctx.user = user;

    return new HttpResponseOK({
      id: user.id,
      name: user.name,
    });
  }


}

```

Si vous allez sur la [page d'inscription](http://localhost:3000/signup), vous devriez maintenant pouvoir vous inscrire en tant que nouvel utilisateur.