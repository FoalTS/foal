---
title: Téléchargement d'Images
id: tuto-12-file-upload
slug: 12-file-upload
---

L'étape suivante de ce tutoriel consiste à permettre aux utilisateurs de télécharger une photo de profil. Cette image sera affichée sur la page d'accueil en face de chaque post de chaque auteur.

Pour ce faire, vous utiliserez le système de stockage de Foal. Il vous permet de valider et d'enregistrer les fichiers téléchargés par le client. Ces fichiers peuvent être sauvegardés sur votre disque local ou dans le Cloud en utilisant AWS S3. Nous n'utiliserons pas la fonction "cloud" dans ce tutoriel, mais vous pouvez découvrir comment la configurer [ici](../../common/file-storage/local-and-cloud-storage.md).

## Côté serveur

Tout d'abord, installez le paquet.

```bash
npm install @foal/storage
```

Mettez à jour la configuration dans `config/default.json` pour spécifier l'emplacement des fichiers auxquels le gestionnaire de disque peut accéder.

```json
{
  "port": "env(PORT)",
  "settings": {
    ...
    "disk": {
      "local": {
        "directory": "assets"
      }
    }
  },
  ...
}
```

Créez ensuite le répertoire `assets/images/profiles/uploaded` où les images de profil seront téléchargées. Téléchargez l'image de profil par défaut [ici](./assets/default.png) et placez-la dans le dossier `assets/images/profiles` avec le nom `default.png`.

Vous êtes prêt à créer le contrôleur. Générez-en un nouveau.

```bash
foal generate controller api/profile --register
```

Ouvrez le nouveau fichier `profile.controller.ts` et ajoutez deux nouvelles routes.

| Point de terminaison | Méthode | Description |
| --- | --- | --- |
| `/api/profile/avatar` | `GET` | Récupère l'image de profil de l'utilisateur. Si le paramètre de requête facultatif `userId` est fourni, le serveur renvoie l'avatar de cet utilisateur. Sinon, il renvoie l'avatar de l'utilisateur actuel. Si aucun utilisateur n'est authentifié ou s'il ou elle n'a pas d'image de profil, une image par défaut est renvoyée. |
| `/api/profile` | `POST` | Met à jour le profil de l'utilisateur. Un champ `name` et un fichier `avatar` facultatif sont attendus. |

```typescript
import { Context, dependency, File, Get, HttpResponseNoContent, Post, UserRequired, ValidateQueryParam } from '@foal/core';
import { Disk, ParseAndValidateFiles } from '@foal/storage';
import { User } from '../../entities';

export class ProfileController {
  @dependency
  disk: Disk;

  @Get('/avatar')
  @ValidateQueryParam('userId', { type: 'number' }, { required: false })
  async readProfileImage(ctx: Context<User|null>) {
    let user = ctx.user;

    const userId: number|undefined = ctx.request.query.userId;
    if (userId !== undefined) {
      user = await User.findOneBy({ id: userId })
    }

    if (!user || !user.avatar) {
      return this.disk.createHttpResponse('images/profiles/default.png');
    }

    return this.disk.createHttpResponse(user.avatar);
  }

  @Post()
  @UserRequired()
  @ParseAndValidateFiles(
    {
      avatar: { required: false, saveTo: 'images/profiles/uploaded' }
    },
    {
      type: 'object',
      properties: {
        name: { type: 'string', maxLength: 255 }
      },
      required: ['name']
    }
  )
  async updateProfileImage(ctx: Context<User>) {
    ctx.user.name = ctx.request.body.name;

    // Warning: File must be imported from `@foal/core`.
    const file: File|undefined = ctx.files.get('avatar')[0];
    if (file) {
      if (ctx.user.avatar) {
        await this.disk.delete(ctx.user.avatar);
      }
      ctx.user.avatar = file.path;
    }

    await ctx.user.save();

    return new HttpResponseNoContent();
  }

}

```

Allez sur [http://localhost:3001/swagger](http://localhost:3001/swagger) et essayez de télécharger une photo de profil. Vous devez d'abord vous connecter.

> Vous avez peut-être remarqué le décorateur `@dependency` pour définir la propriété `disk: Disk`. Ce mécanisme est appelé injection de dépendance et est particulièrement utile dans les tests unitaires. Vous pouvez en savoir plus à ce sujet [ici](../../architecture/architecture-overview.md).

## Côté client

Du côté client, le téléchargement de l'image du profil est géré dans les fichiers `ProfileHeader.tsx` et `requests/profile.ts`.

Ouvrez ce dernier et implémentez la fonction `updateProfile`.

```typescript
import axios from 'axios';

export async function updateProfile(username: string, avatar: File|null): Promise<void> {
  const formData = new FormData();
  formData.set('name', username);
  if (avatar) {
    formData.set('avatar', avatar);
  }

  await axios.post('/api/profile', formData, {
    headers: {
    'content-type': 'multipart/form-data'
    }
  });
}
```

Maintenant, si vous retournez sur [http://localhost:3000/profile](http://localhost:3000/profile), vous devriez pouvoir télécharger votre photo de profil.