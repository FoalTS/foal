import { LoginController } from '@foal/core';

export class /* upperFirstCamelName */Controller extends LoginController {
  strategies = [
    // strategy('/login', MyAuthenticator, mySchema)
  ];

  redirect = {
    // failure: '/login',
    // logout: '/login',
    // success: '/home',
  };
}
