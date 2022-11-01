---
title: Le Script Shell create-todo
id: tuto-4-the-shell-script-create-todo
slug: 4-the-shell-script-create-todo
---

Il est maintenant temps de remplir la base de données avec quelques tâches.

Vous pouvez exécuter l'interface en ligne de commande de votre base de données (dans ce cas *SQLite*) et entrer quelques requêtes SQL. Mais c'est risqué et ce n'est pas très pratique. Cela devient particulièrement vrai lorsque la complexité de vos modèles augmente (relations *many-to-many*, etc.).

C'est pourquoi vous allez créer et utiliser un script shell à la place.

```sh
foal generate script create-todo
```

Un *script shell* est un morceau de code destiné à être appelé depuis la ligne de commande. Il a accès à tous les composants de votre application, y compris vos modèles. Un script shell est divisé en deux parties :

- un objet `schema` qui définit la spécification des arguments de la ligne de commande,
- et une fonction `main` qui reçoit ces arguments sous forme d'objet et exécute du code.

Ouvrez le nouveau fichier généré dans le répertoire `src/scripts` et mettez à jour son contenu.

```typescript
// App
import { Todo } from '../app/entities';
import { dataSource } from '../db';

export const schema = {
  properties: {
    text: { type: 'string' }
  },
  required: [ 'text' ],
  type: 'object',
};

export async function main(args: { text: string }) {
  // Connect to the database.
  await dataSource.initialize();

  try {
    // Create a new task with the text given in the command line.
    const todo = new Todo();
    todo.text = args.text;

    // Save the task in the database and then display it in the console.
    console.log(await todo.save());
  } catch (error: any) {
    console.log(error.message);
  } finally {
    // Close the connection to the database.
    await dataSource.destroy();
  }
}

```

Construisez le script.

```sh
npm run build
```

Ensuite, lancez le script pour créer des tâches dans la base de données.

```sh
foal run create-todo text="Read the docs"
foal run create-todo text="Create my first application"
foal run create-todo text="Write tests"
```

> Notez que si vous essayez de créer une nouvelle tâche sans spécifier l'argument texte, vous obtiendrez l'erreur ci-dessous.
>
> `Error: The command line arguments should have required property 'text'.`
