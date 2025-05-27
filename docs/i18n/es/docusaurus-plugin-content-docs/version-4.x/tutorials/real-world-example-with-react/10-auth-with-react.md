---
title: Autenticación en React
id: tuto-10-auth-with-react
slug: 10-auth-with-react
---

La API del backend está lista para ser utilizada. Ahora vamos a añadir la autenticación en el lado del frontend.

Así es como se organiza la aplicación React:
- Al hacer clic en el botón *Log in* o *Log out*, la aplicación llama a las funciones definidas en `requests/auth.ts` para realizar consultas al servidor.
- La información sobre el usuario actual se almacena en el componente raíz `App.tsx` bajo el nombre `currentUser`. Si el usuario se ha conectado, este estado es de tipo `{ id: number, name: string }`. En caso contrario, su valor es `null`.
- Al iniciar la sesión, el servidor devuelve información sobre el usuario que se utiliza para establecer el estado `currentUser`. Al cerrar la sesión, la aplicación establece este estado como `null`.

> Saber, en el lado del cliente, si un usuario está conectado y quién es, es útil para gestionar la visualización de los elementos de la interfaz de usuario. Esto nos permite, por ejemplo, saber qué botones de navegación deben ser visibles.

Abra el archivo `requests/auth.ts` e implemente las funciones vacías.

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

Vaya a [http://localhost:3000/login](http://localhost:3000/login) y conéctese. Debería ser redirigido a la página de inicio. Si hace clic en el botón *Profile* de la barra de navegación, debería ser llevado a su página personal. Puede añadir o eliminar publicaciones si lo desea.

Ahora vamos a actualizar la página. Se le redirige a la página de inicio de sesión como si hubiera cerrado la sesión. ¡Ay!

La razón de esto es que la aplicación del front-end ya no sabe que usted está conectado. Si mira el componente `App`, verá que el estado `currentUser` se inicializa a `null` cuando se carga la aplicación. Así que tenemos que encontrar una manera de mantener el estado de inicio de sesión del usuario incluso si la página se actualiza.

Para ello, utilizaremos una cookie adicional para almacenar esta información que será legible por la aplicación front-end.

Abra el archivo `api.controller.ts` y añada la opción `userCookie`.

```typescript
@UseSessions({
  cookie: true,
  user: (id: number) => User.findOneBy({ id }),
  userCookie: ctx => ctx.user ? JSON.stringify({ id: ctx.user.id, name: ctx.user.name }) : '',
})
```

Esta opción establece una cookie adicional `user` en el host del cliente con información sobre el usuario actual.

Ahora vuelva al archivo `App.tsx` y añada la función `getCurrentUserFromCookie` que aparece a continuación.

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

Cuando la aplicación se carga, esta función comprobará si existe una cookie `user` con información sobre el usuario actual. Si es así, su contenido se utilizará para establecer el valor de `currentUser`.

Actualice la página. La aplicación ahora funciona como se esperaba.

> También podría haber establecido una cookie del lado del cliente en la función `logIn` y eliminarla en la función `logOut`. Pero esta solución no funciona bien cuando el usuario se desconecta automáticamente después de un período de inactividad (expiración de la sesión).