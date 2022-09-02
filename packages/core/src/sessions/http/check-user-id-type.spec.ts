import { strictEqual, throws } from 'assert';

import { checkUserIdType } from './check-user-id-type';

describe('checkUserIdType', () => {
  context('given the user ID type is "string"', () => {
    it('should return the user ID if it is a string.', () => {
      const userId = '123';
      const userIdType = 'string';
      const actual = checkUserIdType(userId, userIdType);

      strictEqual(actual, userId);
    });
    it('should throw an error if the user ID is not a string.', () => {
      const userId = 123;
      const userIdType = 'string';

      throws(
        () => checkUserIdType(userId, userIdType),
        new Error('Invalid user ID type: number')
      );
    });
  });
  context('given the user ID type is "number"', () => {
    it('should return the user ID if it is a number.', () => {
      const userId = 123;
      const userIdType = 'number';
      const actual = checkUserIdType(userId, userIdType);

      strictEqual(actual, userId);
    });
    it('should throw an error if the user ID is not a number.', () => {
      const userId = '123';
      const userIdType = 'number';

      throws(
        () => checkUserIdType(userId, userIdType),
        new Error('Invalid user ID type: string')
      );
    });
  });
  context('given the user ID type is undefined', () => {
    it('should return the user ID if it is a number.', () => {
      const userId = 123;
      const userIdType = undefined;
      const actual = checkUserIdType(userId, userIdType);

      strictEqual(actual, userId);
    });
    it('should throw an error if the user ID is not a number.', () => {
      const userId = '123';
      const userIdType = undefined;

      throws(
        () => checkUserIdType(userId, userIdType),
        new Error('Invalid user ID type: string')
      );
    });
  });
});