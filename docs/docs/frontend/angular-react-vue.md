---
title: Angular, React & Vue
---


```
foal connect angular ../frontend
foal connect react ../frontend
foal connect vue ../frontend
```

Angular, React and Vue all provide powerful CLIs for creating frontend applications. These tools are widely used, regularly improved and extensively documented. That's why Foal CLI do not provide ready-made features to build the frontend in their place.

Instead, FoalTS offers a convenient command, named `connect`, to configure your frontend CLI so that it interacts smoothly with your Foal application. This way, you do not have to worry about the details of the configuration when starting a new project. You can leave this until later if you need it.

## Creating a new Application

### Angular

```
mkdir my-app
cd my-app

foal createapp backend
ng new frontend

cd backend
foal connect angular ../frontend
```

### React

```
mkdir my-app
cd my-app

foal createapp backend
npx create-react-app frontend --template typescript

cd backend
foal connect react ../frontend
```

### Vue

```
mkdir my-app
cd my-app

foal createapp backend
vue create frontend

cd backend
foal connect vue ../frontend
```

## Problems Solved by the `connect` Command

### Origins that Do not Match

When building a web application with a Angular / React / Vue, it is very common in development to have two servers serving on different ports. For example, with an application written in Foal and Angular, the backend server serves the port `3001` and the frontend one servers the `4200`.

Consequently requests made by the frontend do not reach the backend as they have a different origin. One hacky solution is to replace the URL path to `http://localhost:3001` in development and to enable CORS requests.

This technique has some drawbacks however:
- It may introduce a different codebase between the environments (dev and prod).
- And it disables a browser protection (the `Same-Origin policy`).

One way to get around this, keeping the policy and the same codebase, is to configure a proxy to redirect `4200` requests to the port `3001`. The `connect` command does it for you.

### Build Outpath

> *This feature only works with Angular and Vue.*

The `connect` command also modifies the build output path of your front so that its bundles are saved in the `public/` directory. This way, you can run the frontend and the backend build commands and directly ship the application to production.
