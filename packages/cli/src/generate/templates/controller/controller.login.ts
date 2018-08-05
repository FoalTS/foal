import { Controller, LoginController, strategy } from '@foal/core';

@Controller()
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
