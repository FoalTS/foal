---
title: Les Scripts Shell
---

Comme dans le tutoriel précédent, vous allez utiliser des scripts shell pour alimenter la base de données.

## Le script `create-user`

Un script appelé `create-user` existe déjà dans le répertoire `scripts/`. Il comporte de nombreuses lignes commentées qui vous permettent de créer des utilisateurs avec des *permissions* et des *groupes*.

Ouvrez le fichier et remplacez son contenu par ce qui suit :

```typescript
// 3p
import { isCommon } from '@foal/password';
import { createConnection } from 'typeorm';

// App
import { User } from '../app/entities';

export const schema = {
  additionalProperties: false,
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string' },
  },
  required: [ 'email', 'password' ],
  type: 'object',
};

export async function main(args: { email: string; password: string }) {
  const connection = await createConnection();
  try {
    const user = new User();
    user.email = args.email;

    if (await isCommon(args.password)) {
      console.log('This password is too common. Please choose another one.');
      return;
    }
    await user.setPassword(args.password);

    console.log(await user.save());
  } catch (error) {
    console.log(error.message);
  } finally {
    await connection.close();
  }
}

```

Certaines parties de ce code devraient vous sembler familières.

L'objet `schema` est utilisé pour valider les arguments tapés dans la ligne de commande. Dans ce cas, le script définit deux paramètres obligatoires : une adresse email et un mot de passe. La propriété `format` vérifie que la chaîne `email` est bien une adresse valide (présence du caractère `@`, etc). 

La fonction `main` est divisée en plusieurs parties. Tout d'abord, elle instancie une connexion à la base de données. Ensuite, elle crée un nouvel utilisateur avec les arguments spécifiés dans la ligne de commande. La fonction `isCommon` compare le mot de passe donné avec une liste de dix mille mots de passe courants (ex : `123456`, `password`, etc). Elle retourne vrai si le mot de passe est trouvé dans la liste. Enfin, l'utilisateur est enregistré dans la base de données et, si une erreur est levée, le message d'erreur est affiché.

Comme vous l'avez peut-être remarqué, l'utilitaire `isCommon` provient du paquet `@foal/password`. Vous devez l'installer.

```
npm install @foal/password
```

Maintenant, construisez le script.

```
npm run build
```

Créez deux nouveaux utilisateurs.

```
foal run create-user email="john@foalts.org" password="john_password"
foal run create-user email="mary@foalts.org" password="mary_password"
```

> Si vous essayez de relancer l'une de ces commandes, vous obtiendrez l'erreur ci-dessous car la clé email est unique.
>
> `SQLITE_CONSTRAINT: UNIQUE constraint failed: user.email`

## Le script `create-todo`

Le script `create-todo` est un peu plus complexe car `Todo` a une relation *many-to-one* avec `User`.

Ouvrez le fichier `create-todo.ts` et remplacez son contenu.

```typescript
// 3p
import { createConnection } from 'typeorm';

// App
import { Todo, User } from '../app/entities';

export const schema = {
  properties: {
    owner: { type: 'string', format: 'email' },
    text: { type: 'string' },
  },
  required: [ 'owner', 'text' ],
  type: 'object',
};

export async function main(args: { owner: string; text: string }) {
  const connection = await createConnection();
  try {
    const user = await User.findOne({ email: args.owner });

    if (!user) {
      console.log('No user was found with the email ' + args.owner);
      return;
    }

    const todo = new Todo();
    todo.text = args.text;
    todo.owner = user;

    console.log(await todo.save());
  } catch (error) {
    console.log(error.message);
  } finally {
    await connection.close();
  }
}

```

Nous avons ajouté un paramètre `owner` pour savoir à quel utilisateur appartient le todo. Il attend l'email de l'utilisateur.

La fonction `main` essaie ensuite de trouver l'utilisateur qui a cette adresse email. S'il n'existe pas, le script se termine par un message affiché dans la console. Sinon, l'utilisateur est ajouté au todo comme propriétaire.

Construisez le script.

```
npm run build
```

Créez de nouveaux todos pour chaque utilisateur.

```
foal run create-todo owner="john@foalts.org" text="John task 1"
foal run create-todo owner="john@foalts.org" text="John task 2"
foal run create-todo owner="mary@foalts.org" text="Mary task 1"
foal run create-todo owner="mary@foalts.org" text="Mary task 2"
```
