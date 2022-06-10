// std
import { strictEqual } from 'assert';

// 3p
import {
  Config,
  Context,
  createApp,
  createSession,
  dependency,
  Get,
  hashPassword,
  Hook,
  HttpResponseForbidden,
  HttpResponseNoContent,
  HttpResponseOK,
  HttpResponseUnauthorized,
  Post,
  UseSessions,
  ValidateBody,
  verifyPassword
} from '@foal/core';
import { MongoDBStore } from '@foal/mongodb';
import { MongoClient } from 'mongodb';
import * as request from 'supertest';

// FoalTS
import { fetchMongoDBUser } from '@foal/typeorm';
import {
  Column,
  Connection,
  createConnection,
  Entity,
  getMongoRepository,
  ObjectID,
  ObjectIdColumn
} from '@foal/typeorm/node_modules/typeorm';

describe('[Sample] TypeORM & MongoDB Store', async () => {

  const MONGODB_URI = 'mongodb://localhost:27017/e2e_db';

  let app: any;
  let token: string;
  let mongoClient: any;

  @Entity()
  class User {
    @ObjectIdColumn()
    id: ObjectID;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column()
    isAdmin: boolean;
  }

  function AdminRequired() {
    return Hook((ctx: Context<User>) => {
      if (!ctx.user.isAdmin) {
        return new HttpResponseForbidden();
      }
    });
  }

  @UseSessions({ user: fetchMongoDBUser(User), store: MongoDBStore, required: true })
  class MyController {
    @Get('/foo')
    foo() {
      return new HttpResponseOK();
    }

    @Get('/bar')
    @AdminRequired()
    bar() {
      return new HttpResponseOK();
    }
  }

  class AuthController {
    @dependency
    store: MongoDBStore;

    @Post('/logout')
    @UseSessions({ store: MongoDBStore, required: false, })
    async logout(ctx: Context) {
      if (ctx.session) {
        await ctx.session.destroy();
      }

      return new HttpResponseNoContent();
    }

    @Post('/login')
    @ValidateBody({
      additionalProperties: false,
      properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string' }
      },
      required: ['email', 'password'],
      type: 'object',
    })
    async login(ctx: Context) {
      const user = await getMongoRepository(User).findOne({ email: ctx.request.body.email });

      if (!user) {
        return new HttpResponseUnauthorized();
      }

      if (!await verifyPassword(ctx.request.body.password, user.password)) {
        return new HttpResponseUnauthorized();
      }

      const session = await createSession(this.store);
      session.setUser(user);
      await session.commit();

      return new HttpResponseOK({
        token: session.getToken()
      });
    }
  }

  class AppController {
    subControllers = [
      MyController,
      AuthController
    ];
  }

  let connection: Connection;

  before(async () => {
    Config.set('settings.mongodb.uri', 'mongodb://localhost:27017/e2e_db');

    connection = await createConnection({
      database: 'e2e_db',
      dropSchema: true,
      entities: [User],
      host: 'localhost',
      port: 27017,
      type: 'mongodb',
    });

    mongoClient = await MongoClient.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    await mongoClient.db().collection('foalSessions').deleteMany({});

    const user = new User();
    user.email = 'john@foalts.org';
    user.password = await hashPassword('password');
    user.isAdmin = false;
    await getMongoRepository(User).save(user);

    app = await createApp(AppController);
  });

  after(async () => {
    Config.remove('settings.mongodb.uri');

    return Promise.all([
      connection.close(),
      app.foal.services.get(MongoDBStore).close(),
      mongoClient.close()
    ]);
  });

  it('should work.', async () => {
    /* Try to access routes that require authentication and a specific permission */

    await Promise.all([
      request(app).get('/foo').expect(400),
      request(app).get('/bar').expect(400),
    ]);

    /* Try to login with a wrong email */

    await request(app)
      .post('/login')
      .send({ email: 'mary@foalts.org', password: 'password' })
      .expect(401);

    /* Try to login with a wrong password */

    await request(app)
      .post('/login')
      .send({ email: 'john@foalts.org', password: 'wrong-password' })
      .expect(401);

    /* Log in */

    await request(app)
      .post('/login')
      .send({ email: 'john@foalts.org', password: 'password' })
      .expect(200)
      .then(response => {
        strictEqual(typeof response.body.token, 'string');
        token = response.body.token;
      });

    /* Access and try to access routes that require authentication and a specific permission */

    await Promise.all([
      request(app).get('/foo').set('Authorization', `Bearer ${token}`).expect(200),
      request(app).get('/bar').set('Authorization', `Bearer ${token}`).expect(403),
    ]);

    /* Add the admin group and permission */

    const user2 = await getMongoRepository(User).findOne({ email: 'john@foalts.org' });
    if (!user2) {
      throw new Error('John was not found in the database.');
    }

    user2.isAdmin = true;
    await getMongoRepository(User).save(user2);

    /* Access the route that requires a specific permission */

    await request(app).get('/bar').set('Authorization', `Bearer ${token}`).expect(200);

    /* Log out */

    await request(app).post('/logout').set('Authorization', `Bearer ${token}`).expect(204);

    /* Try to access routes that require authentication and a specific permission */

    await Promise.all([
      request(app).get('/foo').set('Authorization', `Bearer ${token}`).expect(401),
      request(app).get('/bar').set('Authorization', `Bearer ${token}`).expect(401),
    ]);
  });

});
