// std
import { strictEqual } from 'assert';

// 3p
import {
  Context,
  createApp,
  dependency,
  ExpressApplication,
  Get,
  hashPassword,
  Hook,
  HttpResponseForbidden,
  HttpResponseNoContent,
  HttpResponseOK,
  HttpResponseUnauthorized,
  Post,
  TokenOptional,
  TokenRequired,
  ValidateBody,
  verifyPassword
} from '@foal/core';
import { MongoDBStore } from '@foal/mongodb';
import { MongoClient } from 'mongodb';
import { connect, disconnect, Document, Model, model, Schema } from 'mongoose';
import * as request from 'supertest';

// FoalTS
import { fetchUser } from '@foal/mongoose';

describe('[Sample] Mongoose DB & MongoDB Store', async () => {

  const MONGODB_URI = 'mongodb://localhost:27017/e2e_db';

  let app: ExpressApplication;
  let token: string;
  let mongoClient: MongoClient;

  const UserSchema: Schema = new Schema({
    email: {
      required: true,
      type: String,
      unique: true
    },
    isAdmin: {
      required: true,
      type: Boolean,
    },
    password: {
      required: true,
      type: String,
    },
  });

  interface IUser extends Document {
    email: string;
    password: string;
    isAdmin: boolean;
  }

  const UserModel: Model<IUser> = model('User', UserSchema);

  function AdminRequired() {
    return Hook((ctx: Context<IUser>) => {
      if (!ctx.user.isAdmin) {
        return new HttpResponseForbidden();
      }
    });
  }

  @TokenRequired({ user: fetchUser(UserModel), store: MongoDBStore })
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
    @TokenOptional({ store: MongoDBStore })
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
      const user = await UserModel.findOne({ email: ctx.request.body.email });

      if (!user) {
        return new HttpResponseUnauthorized();
      }

      if (!await verifyPassword(ctx.request.body.password, user.password)) {
        return new HttpResponseUnauthorized();
      }
      const session = await this.store.createAndSaveSessionFromUser({ id: user._id });
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

  before(async () => {
    process.env.SETTINGS_SESSION_SECRET = 'session-secret';
    process.env.MONGODB_URI = 'mongodb://localhost:27017/e2e_db';
    await connect(MONGODB_URI, { useNewUrlParser: true, useCreateIndex: true });

    mongoClient = await MongoClient.connect(MONGODB_URI, { useNewUrlParser: true });

    await new Promise((resolve, reject) => {
      UserModel.deleteMany({}, err => err ? reject(err) : resolve());
    });

    await mongoClient.db().collection('foalSessions').deleteMany({});

    const user = new UserModel();
    user.email = 'john@foalts.org';
    user.password = await hashPassword('password');
    user.isAdmin = false;
    await user.save();

    app = createApp(AppController);
  });

  after(async () => {
    delete process.env.SETTINGS_SESSION_SECRET;
    delete process.env.MONGODB_URI;
    return Promise.all([
      disconnect(),
      (await app.foal.services.get(MongoDBStore).getMongoDBInstance()).close(),
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

    const user2 = await UserModel.findOne({ email: 'john@foalts.org' });
    if (!user2) {
      throw new Error('John was not found in the database.');
    }

    user2.isAdmin = true;
    await user2.save();

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
