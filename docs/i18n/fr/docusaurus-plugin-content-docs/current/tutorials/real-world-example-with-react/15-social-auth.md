---
title: Authentification Sociale avec Google
id: tuto-15-social-auth
slug: 15-social-auth
---

Dans cette dernière partie du tutoriel, nous allons donner aux utilisateurs la possibilité de se connecter avec Google. Actuellement, ils ne peuvent se connecter qu'avec un email et un mot de passe.

Pour ce faire, vous utiliserez le système d'authentification sociale de Foal.

> *Cette section suppose que vous avez déjà configuré une application Google et que vous avez récupéré votre ID client et votre secret. Si ce n'est pas le cas, vous pouvez d'abord consulter cette [page](../../authentication/social-auth.md). Les URI de redirection autorisés dans votre application Google doivent inclure `http://localhost:3001/api/auth/google/callback`.*

## Mots de Passe Nullables

La première étape est de mettre à jour le modèle `User`. Certains utilisateurs peuvent n'utiliser que le login social et donc ne pas avoir de mot de passe. Pour prendre cela en compte, nous allons faire en sorte que la colonne `password` accepte des valeurs nulles.

Ouvrez `user.entity.ts` et mettez à jour son contenu.

```typescript
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column()
  name: string;

  @Column()
  avatar: string;

}

export { DatabaseSession } from '@foal/typeorm';
```

Générez et exécutez les migrations.

```bash
npm run makemigrations
npm run migrations
```

Ouvrez ensuite `auth.controller.ts` et ajoutez une condition pour vérifier si la valeur du mot de passe est `null` dans la base de données.

```typescript
if (!user.password) {
  return new HttpResponseUnauthorized();
}

if (!(await verifyPassword(password, user.password))) {
  return new HttpResponseUnauthorized();
}
```

## Configuration

Maintenant que le problème du mot de passe est résolu, vous pouvez installer les paquets et fournir vos informations d'identification sociale dans la configuration.

```bash
npm install @foal/social node-fetch@2
```

*config/default.json*
```json
{
  "port": "env(PORT)",
  "settings": {
    ...
    "social": {
      "google": {
        "clientId": "env(GOOGLE_CLIENT_ID)",
        "clientSecret": "env(GOOGLE_CLIENT_SECRET)",
        "redirectUri": "http://localhost:3001/api/auth/google/callback"
      }
    },
  },
  ...
}
```

*.env*
```bash
# ...

GOOGLE_CLIENT_ID="your Google client ID"
GOOGLE_CLIENT_SECRET="your Google client secret"
```

## Le Contrôleur Social

Créez le contrôleur.

```bash
foal generate controller api/social-auth --register
```

Ouvrez le fichier et ajoutez deux nouvelles routes.

| Point de terminaison | Méthode | Description |
| --- | --- | --- |
| `/api/auth/google` | `POST` | Redirige l'utilisateur vers la page de connexion de Google. |
| `/api/auth/google/callback` | `GET` | Gère la redirection depuis Google une fois que l'utilisateur a approuvé la connexion. |

```typescript
import { Context, dependency, Get, HttpResponseRedirect } from '@foal/core';
import { GoogleProvider } from '@foal/social';
import { User } from '../../entities';
import * as fetch from 'node-fetch';
import { Disk } from '@foal/storage';

interface GoogleUserInfo {
  email: string;
  name?: string;
  picture?: string;
}

export class SocialAuthController {
  @dependency
  google: GoogleProvider;

  @dependency
  disk: Disk;

  @Get('/google')
  redirectToGoogle() {
    return this.google.redirect();
  }

  @Get('/google/callback')
  async handleGoogleRedirection(ctx: Context<User>) {
    const { userInfo } = await this.google.getUserInfo<GoogleUserInfo>(ctx);

    if (!userInfo.email) {
      throw new Error('Google should have returned an email address.');
    }

    let user = await User.findOneBy({ email: userInfo.email });

    if (!user) {
      user = new User();
      user.email = userInfo.email;
      user.avatar = '';
      user.name = userInfo.name ?? 'Unknown';

      if (userInfo.picture) {
        const response = await fetch(userInfo.picture);
        const { path } = await this.disk.write('images/profiles/uploaded', response.body)
        user.avatar = path;
      }

      await user.save();
    }

    ctx.session!.setUser(user);
    ctx.user = user;

    return new HttpResponseRedirect('/');
  }

}

```

Ouvrez `api.controller.ts` et remplacez le préfixe du chemin du `SocialAuthController` par `/auth`.

```typescript
subControllers = [
  controller('/stories', StoriesController),
  controller('/auth', AuthController),
  controller('/profile', ProfileController),
  controller('/auth', SocialAuthController)
];
```

Allez sur [http://localhost:3001/login](http://localhost:3001/login) et cliquez sur le bouton *Connect with Google*. Vous êtes redirigé vers la page de connexion de Google. Une fois que vous avez validé la connexion, vous êtes redirigé vers la page d'accueil. Si vous avez une photo de profil Google, vous la verrez sur votre page de profil.

> Pour que cela fonctionne, vous devez vous assurer que vous utilisez le port `3001` pour tester la connexion sociale. Cela suppose que vous avez créé la build de production dans l'étape précédente de ce tutoriel. Vous ne pouvez pas utiliser le serveur de développement React ici car les redirections ne fonctionneront pas avec les deux ports `3000` et `3001`. 

Félicitations ! Vous avez atteint la fin de ce tutoriel. Vous pouvez trouver le code source complet [ici](./assets/tutorial-foal-react.zip).