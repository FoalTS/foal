import { LoginController } from '@foal/core';

export class TestFooBarController extends LoginController {
  strategies = [
    // strategy('/login', MyAuthenticator, mySchema)
  ];

  redirect = {
    // failure: '/login',
    // logout: '/login',
    // success: '/home',
  };
}
