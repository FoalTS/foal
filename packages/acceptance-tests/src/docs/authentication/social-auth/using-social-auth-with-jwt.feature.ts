// std
import { promisify } from 'util';
import { strictEqual } from 'assert';

// 3p
import { BaseEntity, Column, DataSource, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { decode, sign } from 'jsonwebtoken';

// FoalTS
import {
  Config,
  Context,
  createController,
  dependency,
  Get,
  HttpResponseRedirect,
} from '@foal/core';
import { GoogleProvider } from '@foal/social';
import { getSecretOrPrivateKey, setAuthCookie } from '@foal/jwt';
import { createAndInitializeDataSource } from '../../../common';
import { DatabaseSession } from '@foal/typeorm';

describe('Feature: Using social auth with JWT', () => {

  let dataSource: DataSource;

  before(() => {
    Config.set('settings.jwt.secret', 'my_secret');
  })

  after(async () => {
    Config.remove('settings.jwt.secret');
    if (dataSource) {
      await dataSource.destroy();
    }
  });

  it('Example: Simple auth controller.', async () => {

    /* ======================= DOCUMENTATION BEGIN ======================= */

    @Entity()
    class User extends BaseEntity {

      @PrimaryGeneratedColumn()
      id: number;

      @Column({ unique: true })
      email: string;

    }

    class AuthController {
      @dependency
      google: GoogleProvider;

      @Get('/signin/google')
      redirectToGoogle() {
        return this.google.createHttpResponseWithConsentPageUrl({ isRedirection: true });
      }

      @Get('/signin/google/callback')
      async handleGoogleRedirection(ctx: Context) {
        const { userInfo } = await this.google.getUserInfo(ctx);

        if (!userInfo.email) {
          throw new Error('Google should have returned an email address.');
        }

        let user = await User.findOneBy({ email: userInfo.email });

        if (!user) {
          // If the user has not already signed up, then add them to the database.
          user = new User();
          user.email = userInfo.email;
          await user.save();
        }

        const payload = {
          email: user.email,
          id: user.id,
        };

        const jwt = await promisify(sign as any)(
          payload,
          getSecretOrPrivateKey(),
          { subject: user.id.toString() }
        );

        const response = new HttpResponseRedirect('/');
        await setAuthCookie(response, jwt);
        return response;
      }

    }

    /* ======================= DOCUMENTATION END ========================= */

    dataSource = await createAndInitializeDataSource([ User, DatabaseSession ]);

    const user = new User();
    user.email = 'jane.doe@foalts.org';
    await user.save();

    const googleProviderMock = {
      getUserInfo(ctx: Context) {
        if (ctx.request.query.code === 'known_user') {
          return {
            userInfo: { email: 'jane.doe@foalts.org' }
          };
        } else {
          return {
            userInfo: { email: 'unknown@foalts.org' }
          };
        }
      }
    }

    const controller = createController(AuthController, {
      google: googleProviderMock
    });

    // Known user
    const ctx = new Context({
      query: {
        code: 'known_user'
      }
    });

    const response = await controller.handleGoogleRedirection(ctx);
    const cookie = response.getCookie('auth');

    if (!cookie.value) {
      throw new Error('No cookie "auth" found.');
    }

    const payload = decode(cookie.value);
    strictEqual((payload as any).id, user.id);
    strictEqual((payload as any).email, user.email);

    // Unknown user
    const ctx2 = new Context({
      query: {
        code: 'unknown_user'
      }
    });

    strictEqual(await User.findOneBy({ email: 'unknown@foalts.org' }), null);

    const response2 = await controller.handleGoogleRedirection(ctx2);
    const cookie2 = response2.getCookie('auth');

    if (!cookie2.value) {
      throw new Error('No cookie "auth" found.');
    }

    const user2 = await User.findOneByOrFail({ email: 'unknown@foalts.org' });

    const payload2 = decode(cookie2.value);
    strictEqual((payload2 as any).id, user2.id);
    strictEqual((payload2 as any).email, user2.email);
  });

});
