---
title: Authenticating Users in React
id: tuto-10-auth-with-react
slug: 10-auth-with-react
---

The backend API is ready to be used. Now let's add authentication in the frontend side.

Here is how the React application is organized:
- When clicking the *Log in* or *Log out* button, the application calls the functions defined in `requests/auth.ts` to make requests to the server.
- Information about the current user is stored in the root component `App.tsx` under the name `currentUser`. If the user has logged in, this state is of type `{ id: number, name: string }`. Otherwise, its value is `null`.
- When logging in, the server returns information about the user which is used to set the `currentUser` state. On logout, the application sets this state to `null`.

> Knowing, on the client side, if a user is logged in and who they are is useful to manage the display of user interface elements. This allows us, for example, to know which navigation buttons should be visible.

Open the file `requests/auth.ts` and implement the empty functions.

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

Go to [http://localhost:3000/login](http://localhost:3000/login) and log in. You should be redirected to the home page. If you click on the *Profile* button in the navigation bar, you should be taken to your personal page. You can add or remove stories if you wish.

Now let's refresh the page. You are redirected to the login page as if you were logged out. Ouch!

The reason behind this is that the front-end application no longer knows that you are logged in. If you look at the `App` component, you will see that the `currentUser` state is initialized to `null` when the application is loaded. So we need to find a way to keep track of the user's login state even if the page is refreshed.

To do this, you will use an additional cookie to store this information that will be readable by the front-end application.

Open the `api.controller.ts` file and add the `userCookie` option.

```typescript
@UseSessions({
  cookie: true,
  user: (id: number) => User.findOneBy({ id }),
  userCookie: ctx => ctx.user ? JSON.stringify({ id: ctx.user.id, name: ctx.user.name }) : '',
})
```

This option sets an additional `user` cookie on the client host with information about the current user.

Now go back to the `App.tsx` file and add the `getCurrentUserFromCookie` function below.

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

When the application loads, this function will check if a `user` cookie exists with information about the current user. If so, its contents will be used to set the value of `currentUser`.

Refresh the page. The application now works as expected.

> You could also have set a client-side cookie in the `logIn` function and deleted it in the `logOut` function. But this solution does not work well when the user is automatically logged out after a period of inactivity (session expiration).