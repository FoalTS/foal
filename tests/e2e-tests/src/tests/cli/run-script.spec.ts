import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

describe('The CLI "run" command', () => {
  it('should accept script arguments in key=value format.', async () => {
    await execAsync(
      'node ../../packages/cli/lib/index.js run test-script email=foo bar=123'
    );
  });
});