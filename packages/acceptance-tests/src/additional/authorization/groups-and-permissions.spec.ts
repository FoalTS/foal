// 3p
import { Entity, DataSource } from 'typeorm';
import * as request from 'supertest';

// FoalTS
import {
  createApp,
  createService,
  createSession,
  Get,
  HttpResponseNoContent,
  PermissionRequired,
  UseSessions,
} from '@foal/core';
import {
  DatabaseSession,
  Group,
  Permission,
  TypeORMStore,
  UserWithPermissions
} from '@foal/typeorm';
import { createAndInitializeDataSource } from '../../common';

describe('[Authorization|permissions] Users', () => {

  let dataSource: DataSource;
  let app: any;
  let tokenUser1: string;
  let tokenUser2: string;

  @Entity()
  class User extends UserWithPermissions {}

  @UseSessions({
    user: (id: number) => User.findOneWithPermissionsBy({ id }),
    store: TypeORMStore,
    required: true
  })
  class AppController {
    @Get('/bar')
    @PermissionRequired('access-bar')
    bar() {
      return new HttpResponseNoContent();
    }

    @Get('/foo')
    @PermissionRequired('access-foo')
    foo() {
      return new HttpResponseNoContent();
    }
  }

  before(async () => {
    dataSource = await createAndInitializeDataSource([ User, Permission, Group, DatabaseSession ]);

    const user1 = new User();
    const user2 = new User();

    const perm = new Permission();
    perm.codeName = 'access-foo';
    perm.name = 'Foo permission';
    await perm.save();

    const group = new Group();
    group.name = 'Administrators';
    group.codeName = 'administrators';
    group.permissions = [ perm ];
    await group.save();

    user1.userPermissions = [ perm ];
    user2.groups = [ group ];

    await User.save([ user1, user2 ]);

    const store = createService(TypeORMStore);

    const session1 = await createSession(store);
    session1.setUser(user1);
    await session1.commit();
    tokenUser1 = session1.getToken();

    const session2 = await createSession(store);
    session2.setUser(user1);
    await session2.commit();
    tokenUser2 = session2.getToken();

    app = await createApp(AppController);
  });

  after(async () => {
    if (dataSource) {
      await dataSource.destroy();
    }
  });

  it('cannot access protected routes if they do not have the permission.', () => {
    return Promise.all([
      request(app).get('/bar').set('Authorization', `Bearer ${tokenUser1}`).expect(403),
      request(app).get('/bar').set('Authorization', `Bearer ${tokenUser2}`).expect(403),
    ]);
  });

  it('can access protected routes if they have the permission.', () => {
    return Promise.all([
      request(app).get('/foo').set('Authorization', `Bearer ${tokenUser1}`).expect(204),
      request(app).get('/foo').set('Authorization', `Bearer ${tokenUser2}`).expect(204),
    ]);
  });

});
