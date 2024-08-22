// std
import { deepStrictEqual, strictEqual } from 'assert';

// 3p
import { BaseEntity, Column, DataSource, Entity, PrimaryGeneratedColumn } from 'typeorm';

// FoalTS
import {
  Config,
  Context,
  createController,
  createSession,
  dependency,
  Get,
  HttpResponseRedirect,
  Store,
  UseSessions,
} from '@foal/core';
import { GoogleProvider } from '@foal/social';
import { createAndInitializeDataSource, getTypeORMStorePath } from '../../../common';
import { DatabaseSession } from '@foal/typeorm';

describe('Feature: Using social auth with sessions', () => {

  let dataSource: DataSource;

  before(() => {
    Config.set('settings.session.store', getTypeORMStorePath());
  });

  after(async () => {
    Config.remove('settings.session.store');
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

      @dependency
      store: Store;

      @Get('/signin/google')
      redirectToGoogle() {
        return this.google.createHttpResponseWithConsentPageUrl({ isRedirection: true });
      }

      @Get('/signin/google/callback')
      @UseSessions({
        cookie: true,
      })
      async handleGoogleRedirection(ctx: Context<User>) {
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

        ctx.session!.setUser(user);

        return new HttpResponseRedirect('/');
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
    const ctx = new Context<User>({
      query: {
        code: 'known_user'
      }
    });
    ctx.session = await createSession({} as any);

    strictEqual(ctx.session.userId, null);

    await controller.handleGoogleRedirection(ctx);

    deepStrictEqual(ctx.session.userId, user.id);

    // Unknown user
    const ctx2 = new Context<User>({
      query: {
        code: 'unknown_user'
      }
    });
    ctx2.session = await createSession({} as any);

    strictEqual(ctx2.session.userId, null);
    strictEqual(await User.findOneBy({ email: 'unknown@foalts.org' }), null);

    await controller.handleGoogleRedirection(ctx2);

    const user2 = await User.findOneByOrFail({ email: 'unknown@foalts.org' })

    deepStrictEqual(ctx2.session.userId, user2.id);
  });

});
