---
title: Protection CSRF
id: tuto-13-csrf
slug: 13-csrf
---

Comme vous utilisez l'authentification avec des cookies, vous devez ajouter une protection CSRF à votre application. C'est très facile avec Foal, même lorsque vous construisez une SPA.

Ouvrez le fichier de configuration `default.json` et activez la protection CSRF.

```json
{
  "port": "env(PORT)",
  "settings": {
    "session": {
      "store": "@foal/typeorm",
      "csrf": {
        "enabled": true
      }
    },
    ...
  }
  ...
}
```

Maintenant, lorsque les sessions seront utilisées avec des cookies, le serveur enverra un jeton supplémentaire au client dans un cookie nommé `XSRF-Token`. Ce jeton devra être récupéré par l'application frontend et renvoyé dans chaque requête POST, PATCH, PUT et DELETE avec l'en-tête `X-XSRF-Token`. Si ce n'est pas le cas, le serveur renverra une erreur 403.

Si vous utilisez [axios](https://www.npmjs.com/package/axios) comme bibliothèque de requêtes, comme dans ce tutoriel, vous n'avez rien à faire. Tout est géré en arrière-plan. 

Si vous redémarrez votre serveur de développement et ouvrez les outils de développement de votre navigateur, vous verrez qu'axios inclut automatiquement le jeton pour vous lors de la création d'un nouveau post.

![X-XSRF-Token header example](./images/csrf.png)