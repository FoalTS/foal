import { Get, HttpResponseOK, UserRequired, UseSessions } from '@foal/core';
import { fetchUser } from '@foal/typeorm';
import { User } from '../entities';

@UseSessions({
  cookie: true,
  user: fetchUser(User),
})
@UserRequired()
export class ApiController {
  @Get('/products')
  readProducts() {
    return new HttpResponseOK([]);
  }
}
