// std
import { ok } from 'assert';

// 3p
import * as request from 'supertest';
import { Column, createConnection, Entity, getConnection, getRepository } from 'typeorm';

// FoalTS
import {
  AbstractUser,
  Authenticate,
  Controller,
  createApp,
  EmailAuthenticator,
  emailSchema,
  Get,
  Group,
  HttpResponseOK,
  IModule,
  LoginController,
  LoginRequired,
  Module,
  parsePassword,
  Permission,
  PermissionRequired,
  Service,
  strategy
} from '../src';

it('Authentication and authorization', async () => {
  @Controller()
  class MyController {
    @Get('/foo')
    @LoginRequired()
    foo() {
      return new HttpResponseOK();
    }

    @Get('/bar')
    @PermissionRequired('admin')
    bar() {
      return new HttpResponseOK();
    }
  }

  @Entity()
  class User extends AbstractUser {
    @Column({ unique: true })
    // @ts-ignore
    email: string;

    @Column()
    // @ts-ignore
    password: string;
  }

  @Service()
  class Authenticator extends EmailAuthenticator<User> {
    entityClass = User;
  }

  @Controller()
  class AuthController extends LoginController {
    strategies = [
      strategy('login', Authenticator, emailSchema)
    ];
  }

  @Module()
  @Authenticate(User)
  class AppModule implements IModule {
    controllers = [
      MyController,
      AuthController
    ];
  }

  await createConnection({
    database: 'e2e_db.sqlite',
    dropSchema: true,
    entities: [ User, Permission, Group ],
    synchronize: true,
    type: 'sqlite',
  });

  const app = createApp(AppModule);

  /* Create a user */

  await createConnection({
    database: 'e2e_db.sqlite',
    dropSchema: true,
    entities: [ User, Permission, Group ],
    name: 'create-connection',
    synchronize: true,
    type: 'sqlite',
  });

  const user = new User();
  user.email = 'john@foalts.org';
  user.password = await parsePassword('password');
  await getRepository(User, 'create-connection').save(user);

  await getConnection('create-connection').close();

  /* Try to access routes that require authentication and a specific permission */

  await Promise.all([
    request(app).get('/foo').expect(401),
    request(app).get('/bar').expect(401),
  ]);

  /* Try to login with a wrong email */

  await request(app)
    .post('/login')
    .send({ email: 'jack@foalts.org', password: 'password' })
    .expect(401);

  /* Try to login with a wrong password */

  await request(app)
    .post('/login')
    .send({ email: 'john@foalts.org', password: 'wrong-password' })
    .expect(401);

  /* Log in */

  let cookie = '';
  await request(app)
    .post('/login')
    .send({ email: 'john@foalts.org', password: 'password' })
    .expect(204)
    .then(data => {
      ok(Array.isArray(data.header['set-cookie']));
      cookie = data.header['set-cookie'][0];
    });

  /* Access and try to access routes that require authentication and a specific permission */

  await Promise.all([
    request(app).get('/foo').set('Cookie', cookie).expect(200),
    request(app).get('/bar').set('Cookie', cookie).expect(403),
  ]);

  /* Add the admin group and permission */

  await createConnection({
    database: 'e2e_db.sqlite',
    entities: [ User, Permission, Group ],
    name: 'perm-connection',
    type: 'sqlite',
  });

  const user2 = await getRepository(User, 'perm-connection').findOne({ email: 'john@foalts.org' });
  if (!user2) {
    throw new Error('John was not found in the database.');
  }

  const perm = new Permission();
  perm.codeName = 'admin';
  perm.name = 'Admin permission';
  await getRepository(Permission, 'perm-connection').save(perm);

  const group = new Group();
  group.name = 'Administrators';
  group.permissions = [ perm ];
  await getRepository(Group, 'perm-connection').save(group);

  user2.groups = [ group ];
  await getRepository(User, 'perm-connection').save(user2);

  await getConnection('perm-connection').close();

  /* Access the route that require a specific permission */

  await request(app).get('/bar').set('Cookie', cookie).expect(200);

  /* Log out */

  await request(app).get('/logout').set('Cookie', cookie).expect(204);

  /* Try to access routes that require authentication and a specific permission */

  await Promise.all([
    request(app).get('/foo').expect(401),
    request(app).get('/bar').expect(401),
  ]);

});

after(() => getConnection().close());
