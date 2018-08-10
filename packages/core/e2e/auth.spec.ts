// 3p
import * as request from 'supertest';

// FoalTS
import { Column, createConnection, Entity, getConnection, getRepository } from '../node_modules/typeorm';
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

  const app = createApp(AppModule);

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
  user.password = 'password';
  await getRepository(User, 'create-connection').save(user);

  await getConnection('create-connection').close();

  await Promise.all([
    request(app).get('/foo').expect(401),
    request(app).get('/bar').expect(401),
  ]);

  await request(app)
    .post('/login')
    .send({ email: 'jack@foalts.org', password: 'password' })
    .end((err, data) => console.log(err, data));
    // .expect(401);

  await request(app)
    .post('/login')
    .send({ email: 'john@foalts.org', password: 'wrong-password' })
    .expect(401);

  await request(app)
    .post('/login')
    .send({ email: 'john@foalts.org', password: 'password' })
    .expect(201);

});
