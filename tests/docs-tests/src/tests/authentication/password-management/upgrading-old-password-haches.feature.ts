// std
import { notStrictEqual, strictEqual} from 'assert';
import { pbkdf2, randomBytes } from 'crypto';
import { promisify } from 'util';

// FoalTS
import { HttpResponseOK, HttpResponseUnauthorized, isHttpResponseOK, PasswordService } from '@foal/core';
import { BaseEntity, Column, DataSource, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { createAndInitializeDataSource } from '../../../common';

describe('Feature: Upgrading passwords', () => {

  let dataSource: DataSource;

  afterEach(async () => {
    if (dataSource) {
      await dataSource.destroy();
    }
  });

  it('Example: simple example.', async () => {

    async function hashPasswordWithOldNumberOfIterations(plainTextPassword: string): Promise<string> {
      const saltBuffer = await promisify(randomBytes)(16);
      const iterations = 150000;
      const keylen = 32;
      const digest = 'sha256';
      const derivedKeyBuffer = await promisify(pbkdf2)(plainTextPassword, saltBuffer, iterations, keylen, digest);

      const salt = saltBuffer.toString('base64');
      const derivedKey = derivedKeyBuffer.toString('base64');
      return `pbkdf2_${digest}$${iterations}$${salt}$${derivedKey}`;
    }

    @Entity()
    class User extends BaseEntity {
      @PrimaryGeneratedColumn()
      id: number;

      @Column()
      email: string;

      @Column()
      password: string;
    }

    async function login(email: string, password: string): Promise<any> {

      /* ======================= DOCUMENTATION BEGIN ======================= */

      const passwordService = new PasswordService();

      const user = await User.findOneBy({ email });

      if (!user) {
        return new HttpResponseUnauthorized();
      }

      // highlight-start
      const isValid = await passwordService.verifyPassword(
        password,
        user.password,
        {
          onPasswordUpgrade: async newHash => {
            // Automatically save the upgraded hash
            user.password = newHash;
            await user.save();
          }
        }
      );
      // highlight-end

      if (!isValid) {
        return new HttpResponseUnauthorized();
      }

      // Log the user in.

      /* ======================= DOCUMENTATION END ========================= */

      return new HttpResponseOK();
    }

    dataSource = await createAndInitializeDataSource([ User ]);

    const plainTextPassword = 'password';

    const user = new User();
    user.email = 'foo@foalts.org';
    user.password = await hashPasswordWithOldNumberOfIterations(plainTextPassword);
    await user.save();

    const passwordHash = user.password;
    strictEqual(user.password.split('$')[1], '150000');

    const result = await login(user.email, plainTextPassword);
    if (!isHttpResponseOK(result)) {
      throw new Error('The function should have returned a HttpResponseOK.');
    }

    await user.reload();
    notStrictEqual(user.password, passwordHash);
    strictEqual(user.password.split('$')[1], '600000');

    const passwordHash2 = user.password;
    const result2 = await login(user.email, plainTextPassword);
    if (!isHttpResponseOK(result2)) {
      throw new Error('The function should have returned a HttpResponseOK.');
    }

    await user.reload();
    strictEqual(user.password, passwordHash2);
  });

});
