import { strictEqual, throws } from 'assert';

import { checkAndConvertUserIdType } from './check-and-convert-user-id-type';

describe('checkAndConvertUserIdType', () => {
  context('given the user ID type is "string"', () => {
    it('should return the user ID.', () => {
      const userId = 'foobar';
      const userIdType = 'string';
      const actual = checkAndConvertUserIdType(userId, userIdType);

      strictEqual(actual, userId);
    });
  });
  context('given the user ID type is "number"', () => {
    it('should convert the user ID to a number and return it.', () => {
      const userId = '123';
      const userIdType = 'number';
      const actual = checkAndConvertUserIdType(userId, userIdType);

      strictEqual(actual, 123);
    });
    it('should throw an error if the user ID cannot be converted to a number.', () => {
      const userId = 'foobar';
      const userIdType = 'number';

      throws(
        () => checkAndConvertUserIdType(userId, userIdType),
        new Error('Suspicious operation: invalid user ID type.')
      );
    });
  });
  context('given the user ID type is undefined', () => {
    it('should convert the user ID to a number and return it.', () => {
      const userId = '123';
      const userIdType = undefined;
      const actual = checkAndConvertUserIdType(userId, userIdType);

      strictEqual(actual, 123);
    });
    it('should throw an error if the user ID cannot be converted to a number.', () => {
      const userId = 'foobar';
      const userIdType = undefined;

      throws(
        () => checkAndConvertUserIdType(userId, userIdType),
        new Error('Suspicious operation: invalid user ID type.')
      );
    });
  });
});