// std
import { strictEqual } from 'assert';

// 3p
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { createConnection, getConnection, getManager, QueryFailedError } from 'typeorm';

// FoalTS
import { Group } from './group.entity';
import { Permission } from './permission.entity';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('Group', () => {

  beforeEach(() => createConnection({
    database: 'test',
    dropSchema: true,
    entities: [Group, Permission],
    password: 'test',
    synchronize: true,
    type: 'mysql',
    username: 'test',
  }));

  afterEach(() => getConnection().close());

  it('should have a generated primary key "id".', async () => {
    const group = new Group();
    group.name = '';
    group.permissions = [];
    await getManager().save(group);
    expect(group.id).not.to.equal(undefined);
  });

  it('should have a "name" and whose length is 80.', async () => {
    const group = new Group();
    group.permissions = [];
    await expect(getManager().save(group))
      .to.be.rejectedWith(
        QueryFailedError,
        'ER_NO_DEFAULT_FOR_FIELD: Field \'name\' doesn\'t have a default value'
      );

    group.name = 'This is a very long long long long long long long long long long long long line1.';

    await expect(getManager().save(group))
      .to.be.rejectedWith(
        QueryFailedError,
        'ER_DATA_TOO_LONG: Data too long for column \'name\' at row 1'
      );
  });

  it('should have "permissions" which take Permission instances.', async () => {
    const permission = new Permission();
    permission.name = 'permission1';
    permission.codeName = '';
    await getManager().save(permission);

    const group = new Group();
    group.name = 'group1';
    group.permissions = [
      permission
    ];

    await getManager().save(group);

    const group2 = await getManager().findOne(Group, group.id, { relations: ['permissions'] });
    if (!group2) {
      throw new Error('Group should have been saved.');
    }
    strictEqual(group2.name, 'group1');
    expect(group2.permissions).to.be.an('array').and.to.have.lengthOf(1);
    strictEqual(group2.permissions[0].name, 'permission1');
  });

});
