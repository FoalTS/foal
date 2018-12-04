// std
import { strictEqual } from 'assert';

// 3p
import { existsSync, unlinkSync, writeFileSync } from 'fs';
import { isInFile } from './is-in-file.util';

describe('isInFile', () => {

  const path = './test-is-in-file-util';

  before(() => writeFileSync(path, 'token1\ntoken2\ntoken3', 'utf8'));

  after(() => {
    if (existsSync(path)) {
      unlinkSync(path);
    }
  });

  it('should return true if the given line is in the file.', async () => {
    strictEqual(await isInFile(path)('token2'), true);
  });

  it('should return false if the given line is not in the file.', async () => {
    strictEqual(await isInFile(path)('token4'), false);
  });

});
