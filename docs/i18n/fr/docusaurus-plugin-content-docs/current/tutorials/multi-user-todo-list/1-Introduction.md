---
title: Introduction
---

> Vous lisez la documentation de la version 2 de FoalTS. Les instructions pour la mise à jour vers cette version sont disponibles [ici](../../upgrade-to-v2/README.md). L'ancienne documentation se trouve [ici](https://foalts.org/docs/1.x/).

Dans ce tutoriel, vous apprendrez comment gérer les utilisateurs, l'authentification et l'autorisation dans FoalTS. Vous aurez également un aperçu rapide des tests de bout en bout.

Pour cela, vous allez créer une liste de tâches multi-utilisateurs. Elle prolongera l'application créée dans le tutoriel précédent [To-Do Liste Simple](../simple-todo-list/1-installation.md) que vous devez suivre avant de passer à celui-ci.

> Le code source du premier tutoriel est disponible [ici](https://foalts.org/simple-todo-list-source-code-v2.zip).

L'application aura trois pages :
- une page d'inscription où les utilisateurs peuvent créer un nouveau compte avec une adresse email et un mot de passe,
- une page de connexion qui attend une adresse email et un mot de passe pour s'identifier,
- et la page todo-list où les tâches sont listées, créées et supprimées.

Chaque utilisateur aura ses propres todos et ne pourra pas visualiser, créer ou supprimer les todos d'autres personnes.

Les pages ressemblent à ceci :

![Sign up page](./signup.png)
![Login page](./signin.png)
![To-do list page](./todo-list.png)

Commençons !