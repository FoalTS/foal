---
title: Authentification des utilisateurs dans React
id: tuto-10-auth-with-react
slug: 10-auth-with-react
---

L'API backend est prête à être utilisée. Maintenant, ajoutons l'authentification dans la partie frontend.

Voici comment l'application React est organisée :
- En cliquant sur le bouton *Log in* ou *Log out*, l'application appelle les fonctions définies dans `requests/auth.ts` pour faire des requêtes au serveur.
- Les informations sur l'utilisateur actuel sont stockées dans le composant racine `App.tsx` sous le nom `currentUser`. Si l'utilisateur s'est connecté, cet état est de type `{ id: number, name: string }`. Sinon, sa valeur est `null`.
- Lors de la connexion, le serveur renvoie des informations sur l'utilisateur qui sont utilisées pour définir l'état `currentUser`. Lors de la déconnexion, l'application donne à cet état la valeur `null`.

> Savoir, côté client, si un utilisateur est connecté et qui il est est utile pour gérer l'affichage des éléments de l'interface utilisateur. Cela nous permet, par exemple, de savoir quels boutons de navigation doivent être visibles.

Ouvrez le fichier `requests/auth.ts` et implémentez les fonctions vides.

```typescript
import axios from 'axios';
import { ICredentials, IUser } from '../interfaces';

export async function logIn(credentials: ICredentials): Promise<IUser> {
  const response = await axios.post<IUser>('/api/auth/login', credentials);
  return response.data;
}

export async function logOut(): Promise<void> {
  await axios.post('/api/auth/logout');
}

export async function signUp(credentials: ICredentials): Promise<IUser> {
  const response = await axios.post<IUser>('/api/auth/signup', credentials);
  return response.data;
}

```

Allez sur [http://localhost:3000/login](http://localhost:3000/login) et connectez-vous. Vous devriez être redirigé vers la page d'accueil. Si vous cliquez sur le bouton *Profile* dans la barre de navigation, vous devriez être dirigé vers votre page personnelle. Vous pouvez ajouter ou supprimer des posts si vous le souhaitez.

Maintenant, rafraîchissons la page. Vous êtes redirigé vers la page de connexion comme si vous étiez déconnecté. Aïe !

La raison en est que l'application frontend ne sait plus que vous êtes connecté. Si vous regardez le composant `App`, vous verrez que l'état `currentUser` est initialisé à `null` lorsque l'application est chargée. Nous devons donc trouver un moyen de garder la trace de l'état de connexion de l'utilisateur même si la page est rafraîchie.

Pour ce faire, vous utiliserez un cookie supplémentaire pour stocker cette information qui sera lisible par l'application React.

Ouvrez le fichier `api.controller.ts` et ajoutez l'option `userCookie`.

```typescript
@UseSessions({
  cookie: true,
  user: (id: number) => User.findOneBy({ id }),
  userCookie: ctx => ctx.user ? JSON.stringify({ id: ctx.user.id, name: ctx.user.name }) : '',
})
```

Cette option définit un cookie `user` supplémentaire sur l'hôte client avec des informations sur l'utilisateur actuel.

Retournez maintenant au fichier `App.tsx` et ajoutez la fonction `getCurrentUserFromCookie` ci-dessous.

```typescript
import * as cookie from 'cookie';

function getCurrentUserFromCookie(): IUser | null {
  const userCookie = cookie.parse(document.cookie).user as string|undefined;
  if (!userCookie) {
    return null;
  }
  try {
    return JSON.parse(userCookie);
  } catch (error: any) {
    return null;
  }
}

export default function App() {
  const [currentUser, setCurrentUser] = useState(getCurrentUserFromCookie());

  // ...

}
```

Au chargement de l'application, cette fonction vérifiera si un cookie `user` existe avec des informations sur l'utilisateur actuel. Si c'est le cas, son contenu sera utilisé pour définir la valeur de `currentUser`.

Rafraîchissez la page. L'application fonctionne maintenant comme prévu.

> Vous auriez également pu définir un cookie côté client dans la fonction `logIn` et le supprimer dans la fonction `logOut`. Mais cette solution ne fonctionne pas bien lorsque l'utilisateur est automatiquement déconnecté après une période d'inactivité (expiration de la session).