// 3p
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { createConnection, getConnection, getManager, QueryFailedError } from 'typeorm';

// FoalTS
import { Permission } from './permission.entity';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('Permission', () => {

  beforeEach(() => createConnection({
    database: 'test',
    dropSchema: true,
    entities: [Permission],
    password: 'test',
    synchronize: true,
    type: 'mysql',
    username: 'test',
  }));

  afterEach(() => getConnection().close());

  it('should have a generated primary key "id".', async () => {
    const permission = new Permission();
    permission.name = '';
    permission.codeName = '';
    await getManager().save(permission);
    expect(permission.id).not.to.equal(undefined);
  });

  it('should have a "name".', () => {
    const permission = new Permission();
    permission.codeName = '';
    return expect(getManager().save(permission))
      .to.be.rejectedWith(
        QueryFailedError,
        'ER_NO_DEFAULT_FOR_FIELD: Field \'name\' doesn\'t have a default value'
      );
  });

  it('should have a "codeName" which is unique and whose length is 100.', async () => {
    const permission = new Permission();
    permission.name = '';

    await expect(getManager().save(permission))
      .to.be.rejectedWith(
        QueryFailedError,
        'ER_NO_DEFAULT_FOR_FIELD: Field \'codeName\' doesn\'t have a default value'
      );

    permission.codeName = 'this is a very long long long long long long long line'
      + 'this is a very long long long long long long long line';

    await expect(getManager().save(permission))
      .to.be.rejectedWith(
        QueryFailedError,
        'ER_DATA_TOO_LONG: Data too long for column \'codeName\' at row 1'
      );

    permission.codeName = 'foo';
    await getManager().save(permission);

    const permission2 = new Permission();
    permission2.name = '';
    permission2.codeName = 'foo';
    await expect(getManager().save(permission2))
      .to.be.rejectedWith(
        QueryFailedError,
        'ER_DUP_ENTRY: Duplicate entry \'foo\' for key '
      );
  });

});
