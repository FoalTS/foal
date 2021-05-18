---
title: Introduction
---

This tutorial shows how to build a real-world application with React and Foal. It assumes that you have already read the first guide *[How to build a Simple To-Do List](../simple-todo-list/1-installation.md)* and that you have a basic knowledge of React.

In this tutorial, you will learn to:
- establish a connection with MySQL or Postgres,
- provide credentials to the application in a secure way,
- create many-to-one models,
- use a query builder,
- generate an interface to test your API (Swagger UI),
- fix same-origin policy errors,
- allow users to log in and register with an email and a password,
- authenticate users on the frontend and the backend,
- manage access control,
- protect against CSRF attacks,
- upload and save files,
- allow users to connect with a social provider (Google),
- manage multiple environments,
- and build and deploy an application to production.

> *For the sake of simplicity, the front-end application will not use a state management library (such as [redux](https://redux.js.org/)). But you can of course add one if you wish. The logic to follow will remain mainly the same.*