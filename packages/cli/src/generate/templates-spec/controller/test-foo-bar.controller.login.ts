import { Controller, LoginController, strategy } from '@foal/core';

@Controller()
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
