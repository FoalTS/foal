// std
import { strictEqual } from 'assert';

// 3p
import { clearCommonPasswordsCache, isCommon } from './is-common.util';

describe('isCommon util', () => {
  describe('isCommon', () => {

    describe('default datasource', () => {
  
      it('should return true if the given password is part of the 10000 most common passwords.', async () => {
        strictEqual(await isCommon('12345'), true);
      });
    
      it('should return false if the given password is not part of the 10000 most common passwords.', async () => {
        strictEqual(await isCommon('a bird in the sky'), false);
      });
  
    });
  
    describe('10k datasource', () => {
  
      it('should return true if the given password is part of the 100000 most common passwords.', async () => {
        strictEqual(await isCommon('12345', 'TenMillionListTop10k'), true);
      });
    
      it('should return false if the given password is not part of the 100000 most common passwords.', async () => {
        strictEqual(await isCommon('a bird in the sky', 'TenMillionListTop10k'), false);
      });
  
    });
  
    describe('100k datasource', () => {
  
      it('should return true if the given password is part of the 100000 most common passwords.', async () => {
        strictEqual(await isCommon('Cinder', 'TenMillionListTop100k'), true);
      });
    
      it('should return false if the given password is not part of the 100000 most common passwords.', async () => {
        strictEqual(await isCommon('a bird in the sky', 'TenMillionListTop100k'), false);
      });
  
    });
  
  });

  describe('clearCommonPasswordsCache', () => {

    it('should not fail if it is empty',  () => {
      clearCommonPasswordsCache();
    });
  
    it('should not fail if it is full', async () => {
      await isCommon('12345', 'TenMillionListTop10k');
      
      clearCommonPasswordsCache();
    });
  });
});
