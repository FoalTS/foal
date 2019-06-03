// std
import { ok } from 'assert';

// 3p
import {
  Context,
  createApp,
  Get,
  hashPassword,
  Hook,
  HttpResponseForbidden,
  HttpResponseNoContent,
  HttpResponseOK,
  HttpResponseUnauthorized,
  logIn,
  LoginRequired,
  logOut,
  Post,
  ValidateBody,
  verifyPassword,
} from '@foal/core';
import { connect, disconnect, Document, Model, model, Schema } from 'mongoose';
import * as request from 'supertest';

// FoalTS
import { fetchUser } from '@foal/mongoose';

it('Foal should support authorization and authentication based on sessions & cookies (Mongoose)', async () => {

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

  @LoginRequired({ user: fetchUser(UserModel) })
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
    @Get('/logout')
    logout(ctx: Context) {
      logOut(ctx);
      return new HttpResponseNoContent();
    }

    @Post('/login')
    @ValidateBody({
      additionalProperties: false,
      properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string' }
      },
      required: [ 'email', 'password' ],
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

      logIn(ctx, user);

      return new HttpResponseNoContent();
    }
  }

  class AppController {
    subControllers = [
      MyController,
      AuthController
    ];
  }

  await connect('mongodb://localhost:27017/e2e_db', { useNewUrlParser: true });

  await new Promise((resolve, reject) => {
    UserModel.deleteMany({}, err => err ? reject(err) : resolve());
  });

  const app = createApp(AppController);

  /* Create a user */

  const user = new UserModel();
  user.email = 'john@foalts.org';
  user.password = await hashPassword('password');
  user.isAdmin = false;
  await user.save();

  /* Try to access routes that require authentication and a specific permission */

  await Promise.all([
    request(app).get('/foo').expect(401),
    request(app).get('/bar').expect(401),
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

  const user2 = await UserModel.findOne({ email: 'john@foalts.org' });
  if (!user2) {
    throw new Error('John was not found in the database.');
  }

  user2.isAdmin = true;
  await user2.save();

  /* Access the route that requires a specific permission */

  await request(app).get('/bar').set('Cookie', cookie).expect(200);

  /* Log out */

  await request(app).get('/logout').set('Cookie', cookie).expect(204);

  /* Try to access routes that require authentication and a specific permission */

  await Promise.all([
    request(app).get('/foo').expect(401),
    request(app).get('/bar').expect(401),
  ]);

});

after(() => disconnect());
