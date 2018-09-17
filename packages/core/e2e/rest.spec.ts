// std
import { notStrictEqual, ok, strictEqual } from 'assert';

// 3p
import * as request from 'supertest';
import {
  Column,
  createConnection,
  Entity,
  getConnection,
  getManager,
  getRepository,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';

// FoalTS
import {
  AbstractUser,
  Authenticate,
  Controller,
  controller,
  createApp,
  EntityResourceCollection,
  Group,
  IAuthenticator,
  IModule,
  IResourceCollection,
  LoginController,
  LoginRequired,
  Permission,
  RestController,
  strategy,
} from '../src';

xit('REST API with RestController and EntityResourceCollection', async () => {
  /**
   * Test description
   *
   *
   * Several organizations. A user belongs to one organization (or none for the superuser).
   *
   * There are three groups of users:
   * - simple users
   * - admin users (permission: admin-perm)
   * - super users (permission: superuser-perm)
   *
   * ORGS
   * A super user can create, read, update and delete orgs.
   * An admin user can read and update (expect the id) its org.
   * A simple user can read its org.
   *
   * USER CREATIONS
   * A super user can create a user and choose the org it belongs to.
   * An admin user can create a user. Its org will be the admin user org.
   * A simple cannot create any user.
   *
   * USER READS
   * A super user can read all the users and filter them according to their coordination.
   * An admin user can read the users of its org.
   * A simple user can read itself.
   * The "phone number" is partially returned. Only the last 2 digits are visible.
   * The "origin" property is only returned if the authenticated user is an admin or a super user.
   *
   * USER UPDATES
   * A user can update any user.
   * An admin user can update any user of its org.
   * A simple can update itself expect for the "origin" property.
   *
   * USER DELETIONS
   * A super user can delete every user.
   * An admin user can delete every user of its org expect him/her.
   * A simple user cannot delete a user including itself.
   */
  @Entity()
  class Org {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
  }

  @Entity()
  class User extends AbstractUser {
    @Column()
    name: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ nullable: true })
    origin: string;

    @ManyToOne(type => Org)
    org: Org;
  }

  class UserCollection extends EntityResourceCollection {
    entityClass = User;
    allowedOperations: (keyof IResourceCollection)[] = [
      'create', 'deleteById', 'find', 'findById', 'modifyById', 'updateById'
    ];
  }

  class OrgCollection extends EntityResourceCollection {
    entityClass = Org;
    allowedOperations: (keyof IResourceCollection)[] = [
      'create', 'deleteById', 'find', 'findById', 'modifyById', 'updateById'
    ];
    middlewares = [
      /* TODO: add the middlewares */
    ];
  }

  class Authenticator implements IAuthenticator<User> {
    async authenticate(credentials: { id: number }) {
      const user = await getRepository(User).findOne({ id: credentials.id });
      return user || null;
    }
  }

  @Controller()
  @LoginRequired()
  class UserController extends RestController {
    collectionClass = UserCollection;
  }

  @Controller()
  @LoginRequired()
  class OrgController extends RestController {
    collectionClass = OrgCollection;
  }

  @Controller()
  class AuthController extends LoginController {
    strategies = [
      strategy('login', Authenticator, {})
    ];
  }

  @Authenticate(User)
  class AppModule implements IModule {
    controllers = [
      controller('/users', UserController),
      controller('/orgs', OrgController),
      controller('', AuthController),
    ];
  }

  const app = createApp(AppModule);

  /* Create orgs, perms, groups and users */

  await createConnection({
    database: 'e2e_db.sqlite',
    dropSchema: true,
    entities: [ User, Permission, Group, Org ],
    name: 'create-connection',
    synchronize: true,
    type: 'sqlite',
  });

  const adminPerm = new Permission();
  adminPerm.name = 'Admin permission';
  adminPerm.codeName = 'admin-perm';

  const superuserPerm = new Permission();
  superuserPerm.name = 'Superuser permission';
  superuserPerm.codeName = 'superuser-perm';

  const simpleUsers = new Group();
  simpleUsers.name = 'Simple users';
  simpleUsers.permissions = [];

  const administrators = new Group();
  administrators.name = 'Administrators';
  administrators.permissions = [ adminPerm ];

  const superusers = new Group();
  superusers.name = 'Superusers';
  superusers.permissions = [ superuserPerm ];

  const blueOrg = new Org();
  blueOrg.name = 'Blue org';

  const redOrg = new Org();
  redOrg.name = 'Red org';

  const superuser = new User();
  superuser.name = 'Super user';
  superuser.groups = [ superusers ];

  const blueAdminUser = new User();
  blueAdminUser.org = blueOrg;
  blueAdminUser.name = 'Blue admin user';
  blueAdminUser.phone = '06 00 00 00 12';
  blueAdminUser.groups = [ administrators ];

  const blueSimpleUser1 = new User();
  blueSimpleUser1.org = blueOrg;
  blueSimpleUser1.name = 'Blue simple user 1';
  blueSimpleUser1.phone = '06 00 24 00 42';
  blueSimpleUser1.groups = [ simpleUsers ];

  const blueSimpleUser2 = new User();
  blueSimpleUser2.org = blueOrg;
  blueSimpleUser2.name = 'Blue simple user 2';
  blueSimpleUser2.phone = '06 00 13 00 64';
  blueSimpleUser2.groups = [ simpleUsers ];

  const redAdminUser = new User();
  redAdminUser.org = redOrg;
  redAdminUser.name = 'Red admin user';
  redAdminUser.phone = '06 00 22 00 73';
  redAdminUser.groups = [ administrators ];

  const redSimpleUser = new User();
  redSimpleUser.org = redOrg;
  redSimpleUser.name = 'Red simple user';
  redSimpleUser.phone = '06 00 62 00 44';
  redSimpleUser.groups = [ simpleUsers ];

  await getManager('create-connection').save([
    adminPerm, superuserPerm,
    simpleUsers, administrators, superusers,
    blueOrg, redOrg,
    blueAdminUser, blueSimpleUser1, blueSimpleUser2,
    redAdminUser, redSimpleUser,
  ]);

  await getConnection('create-connection').close();

  let authCookie = '';

  /************ SIMPLE USER ***************/

  /* Log in as a simple user */

  await request(app)
    .post('/login')
    .send({ id: blueSimpleUser1.id })
    .expect(204)
    .then(data => {
      ok(Array.isArray(data.header['set-cookie']));
      authCookie = data.header['set-cookie'][0];
    });

  /* Try to create, read, update or delete an org */

  await Promise.all([

    // should only read its org.
    request(app)
      .get('/orgs')
      .set('Cookie', authCookie)
      .expect(200)
      .expect([
        {
          id: blueOrg.id,
          name: blueOrg.name
        }
      ]),

    // should not be able to read another org than its.
    request(app)
      .get(`/orgs/${redOrg.id}`)
      .set('Cookie', authCookie)
      .expect(203),

    // should be able to read its org.
    request(app)
      .get(`/orgs/${blueOrg.id}`)
      .set('Cookie', authCookie)
      .expect(200)
      .expect({
        id: blueOrg.id,
        name: blueOrg.name
      }),

    // should not be able to create an org.
    request(app)
      .post('/orgs')
      .set('Cookie', authCookie)
      .send({
        name: 'Yellow org'
      })
      .expect(203),

    // should not be able to update an org (including its org).
    request(app)
      .put(`/orgs/${blueOrg.id}`)
      .set('Cookie', authCookie)
      .send({
        name: 'A new name for my blue org'
      })
      .expect(203),

    // should not be able to modify an org (including its org).
    request(app)
      .patch(`/orgs/${blueOrg.id}`)
      .set('Cookie', authCookie)
      .send({
        name: 'A new name for my blue org'
      })
      .expect(203),

    // should not be able to delete an org (including its org).
    request(app)
      .delete(`/orgs/${blueOrg.id}`)
      .set('Cookie', authCookie)
      .expect(203),

  ]);

  /* Try to create a user */

  // await request(app)
  //   .post('/users')
  //   .set('Cookie', authCookie)
  //   .send({
  //     name: 'John',
  //     phone: '06 00 00 00 54'
  //   })
  //   .expect(403);

  /************ ADMIN USER ***************/

  /* Log in as an admin user */

  await request(app)
    .post('/login')
    .send({ id: blueAdminUser.id })
    .expect(204)
    .then(data => {
      ok(Array.isArray(data.header['set-cookie']));
      authCookie = data.header['set-cookie'][0];
    });

  /* Try to create, read, update or delete an org */

  await Promise.all([

    // should only read its org.
    request(app)
      .get('/orgs')
      .set('Cookie', authCookie)
      .expect(200)
      .expect([
        {
          id: blueOrg.id,
          name: blueOrg.name
        }
      ]),

    // should not be able to read another org than its.
    request(app)
      .get(`/orgs/${redOrg.id}`)
      .set('Cookie', authCookie)
      .expect(203),

    // should be able to read its org.
    request(app)
      .get(`/orgs/${blueOrg.id}`)
      .set('Cookie', authCookie)
      .expect(200)
      .expect({
        id: blueOrg.id,
        name: blueOrg.name
      }),

    // should not be able to create an org.
    request(app)
      .post('/orgs')
      .set('Cookie', authCookie)
      .send({
        name: 'Yellow org'
      })
      .expect(203),

    // should not be able to update another org than its.
    request(app)
      .put(`/orgs/${redOrg.id}`)
      .set('Cookie', authCookie)
      .send({
        name: 'A new name for the red org'
      })
      .expect(203),

    // should be able to update its org.
    request(app)
      .put(`/orgs/${blueOrg.id}`)
      .set('Cookie', authCookie)
      .send({
        name: 'A new name for my blue org'
      })
      .expect(200)
      .expect({
        id: blueOrg.id,
        name: 'A new name for my blue org'
      }),

    // should not be able to modify another org than its.
    request(app)
      .patch(`/orgs/${redOrg.id}`)
      .set('Cookie', authCookie)
      .send({
        name: 'A new name for the red org'
      })
      .expect(203),

    // should be able to modify its org.
    request(app)
      .patch(`/orgs/${blueOrg.id}`)
      .set('Cookie', authCookie)
      .send({
        name: 'Another new name for my blue org'
      })
      .expect(200)
      .expect({
        id: blueOrg.id,
        name: 'Another new name for my blue org'
      }),

    // should not be able to delete an org (including its org).
    request(app)
      .delete(`/orgs/${blueOrg.id}`)
      .set('Cookie', authCookie)
      .expect(203),

  ]);

  /************ SUPER USER ***************/

  /* Log in as a superuser */

  await request(app)
    .post('/login')
    .send({ id: superuser.id })
    .expect(204)
    .then(data => {
      ok(Array.isArray(data.header['set-cookie']));
      authCookie = data.header['set-cookie'][0];
    });

  /* Try to create, read, update or delete an org */

  // should read all the orgs.
  await request(app)
    .get('/orgs')
    .set('Cookie', authCookie)
    .expect(200)
    .expect([
      {
        id: blueOrg.id,
        name: blueOrg.name
      },
      {
        id: redOrg.id,
        name: redOrg.name
      }
    ]),

  await Promise.all([

    // should be able to read an org.
    request(app)
      .get(`/orgs/${blueOrg.id}`)
      .set('Cookie', authCookie)
      .expect(200)
      .expect({
        id: blueOrg.id,
        name: blueOrg.name
      }),

    // should be able to create an org.
    request(app)
      .post('/orgs')
      .set('Cookie', authCookie)
      .send({
        name: 'Yellow org'
      })
      .expect(201)
      .then(data => {
        strictEqual(data.body.name, 'Yellow org');
        notStrictEqual(data.body.id, undefined);
      }),

    // should be able to update an org.
    request(app)
      .put(`/orgs/${blueOrg.id}`)
      .set('Cookie', authCookie)
      .send({
        name: 'A new name for my blue org'
      })
      .expect(200)
      .expect({
        id: blueOrg.id,
        name: 'A new name for my blue org',
      }),

    // should be able to modify an org.
    request(app)
      .patch(`/orgs/${blueOrg.id}`)
      .set('Cookie', authCookie)
      .send({
        name: 'A new name for my blue org'
      })
      .expect(200)
      .expect({
        id: blueOrg.id,
        name: 'A new name for my blue org',
      }),

    // should get a 400 BAD REQUEST if the schema is incorrect when modifying.
    request(app)
      .patch(`/orgs/${blueOrg.id}`)
      .set('Cookie', authCookie)
      .send({
        name: 3
      })
      .expect(400), // TODO: Check the responde body message

    // should be able to delete an org.
    request(app)
      .delete(`/orgs/${redOrg.id}`)
      .set('Cookie', authCookie)
      .expect(203),

  ]);

});
