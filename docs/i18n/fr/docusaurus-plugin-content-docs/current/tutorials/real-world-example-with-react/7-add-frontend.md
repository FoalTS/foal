---
title: L'Application Frontend
id: tuto-7-add-frontend
slug: 7-add-frontend
---

Très bien, jusqu'à présent vous avez une première version fonctionnelle de votre API. Il est temps d'ajouter le frontend.

Téléchargez le fichier zip [ici](./assets/frontend-app.zip). Il contient une base de code front-end que vous compléterez au fur et à mesure. La plupart de l'application est déjà implémentée pour vous. Vous n'aurez à vous occuper que de l'authentification et du téléchargement de fichiers pendant ce tutoriel.

Créez un nouveau répertoire `frontend-app` à la racine de votre projet et déplacez-y le contenu du zip.

Allez dans le répertoire nouvellement créé et démarrez le serveur de développement.

```bash
cd frontend-app
npm install
npm run start
```

L'application frontend se charge à [http://localhost:3000](http://localhost:3000).

![Feed page](./images/feed-error.png)

L'interface affiche une erreur et vous invite à rafraîchir la page. Cette erreur est due au fait que les applications frontend et backend sont servies sur des ports différents. Ainsi, lorsqu'il envoie une requête, le frontend l'envoie au mauvais port.

Une façon de résoudre ce problème est de mettre à jour temporairement le fichier `requests/stories.ts` pour utiliser le port `3001` en développement. Mais cela vous oblige à ajouter un code différent de celui qui est réellement utilisé en production, et cela génère également des erreurs de *same-origin policy* que vous devrez toujours gérer.

Une autre façon de résoudre ce problème est de *connecter* votre serveur de développement frontend au port 3001 en développement. Ceci peut être fait avec la commande suivante.

```bash
cd ../backend-app
foal connect react ../frontend-app
```

Si vous redémarrez le serveur React, les posts devraient s'afficher correctement sur la page *feed* (sauf pour les images).

![Feed page](./images/feed-no-images.png)