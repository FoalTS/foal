---
title: Les Scripts Shell
id: tuto-4-the-shell-scripts
slug: 4-the-shell-scripts
---

Vos modèles sont prêts à être utilisés. Comme dans le tutoriel précédent, vous allez utiliser des scripts shell pour alimenter la base de données.

## Le script `créer-utilisateur`

Un script appelé `create-user` existe déjà dans le répertoire `scripts`.

Ouvrez le fichier et remplacez son contenu par ce qui suit :

```typescript
// 3p
import { hashPassword } from '@foal/core';

// App
import { User } from '../app/entities';
import { dataSource } from '../db';

export const schema = {
  additionalProperties: false,
  properties: {
    email: { type: 'string', format: 'email', maxLength: 255 },
    password: { type: 'string' },
    name: { type: 'string', maxLength: 255 },
  },
  required: [ 'email', 'password' ],
  type: 'object',
};

export async function main(args: { email: string, password: string, name?: string }) {
  const user = new User();
  user.email = args.email;
  user.password = await hashPassword(args.password);
  user.name = args.name ?? 'Unknown';
  user.avatar = '';

  await dataSource.initialize();

  try {
    console.log(await user.save());
  } catch (error: any) {
    console.log(error.message);
  } finally {
    await dataSource.destroy();
  }
}

```

Certaines parties de ce code devraient vous sembler familières.

L'objet `schema` est utilisé pour valider les arguments tapés sur la ligne de commande. Dans notre cas, le script attend deux paramètres obligatoires `email` et `password` et un optionnel `name`. La propriété `format` vérifie que la chaîne `email` est un email (présence du caractère `@`, etc). 

La fonction `main` est appelée après que la validation ait réussi. Elle est divisée en plusieurs parties. D'abord, elle crée un nouvel utilisateur avec les arguments spécifiés dans la ligne de commande. Ensuite, elle établit une connexion avec la base de données et enregistre l'utilisateur.

> La fonction `hashPassword` est utilisée pour hacher et saler les mots de passe avant de les stocker dans la base de données. Pour des raisons de sécurité, vous devez utiliser cette fonction avant de sauvegarder les mots de passe.

Construisez le script.

```bash
npm run build
```

Créez ensuite deux nouveaux utilisateurs.

```bash
foal run create-user email="john@foalts.org" password="john_password" name="John"
foal run create-user email="mary@foalts.org" password="mary_password" name="Mary"
```

> Si vous essayez de réexécuter l'une de ces commandes, vous obtiendrez l'erreur MySQL ci-dessous car la clé `email` est unique.
>
> `ER_DUP_ENTRY: Duplicate entry 'john@foalts.org' for key 'IDX_xxx'`

## Le scénario `create-story`.

Le script `create-story` est un peu plus complexe car `Story` a une relation many-to-one avec `User`.

```bash
foal generate script create-story
```

Ouvrez le fichier `create-story.ts` et remplacez son contenu.

```typescript
import { Story, User } from '../app/entities';
import { dataSource } from '../db';

export const schema = {
  additionalProperties: false,
  properties: {
    author: { type: 'string', format: 'email', maxLength: 255 },
    title: { type: 'string', maxLength: 255 },
    link: { type: 'string', maxLength: 255 },
  },
  required: [ 'author', 'title', 'link' ],
  type: 'object',
};

export async function main(args: { author: string, title: string, link: string }) {
  await dataSource.initialize();

  const user = await User.findOneByOrFail({ email: args.author });

  const story = new Story();
  story.author = user;
  story.title = args.title;
  story.link = args.link;

  try {
    console.log(await story.save());
  } catch (error: any) {
    console.error(error);
  } finally {
    await dataSource.destroy();
  }
}

```

Nous avons ajouté un paramètre `author` pour savoir quel utilisateur a posté l'article. Il attend l'email de l'utilisateur.

La fonction `main` essaie alors de trouver l'utilisateur qui possède cet email. S'il existe, l'utilisateur est ajouté à la *story* en tant qu'auteur. Si ce n'est pas le cas, le script se termine par un message affiché dans la console.

Construisez le script.

```bash
npm run build
```

Et créez de nouveaux posts pour chaque utilisateur.

```bash
foal run create-story author="john@foalts.org" title="How to build a simple to-do list" link="https://foalts.org/docs/tutorials/simple-todo-list/1-installation"
foal run create-story author="mary@foalts.org" title="FoalTS architecture overview" link="https://foalts.org/docs/architecture/architecture-overview"
foal run create-story author="mary@foalts.org" title="Authentication with Foal" link="https://foalts.org/docs/authentication/quick-start"
```
