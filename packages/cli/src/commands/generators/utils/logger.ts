// 3p
import { Spinner } from 'cli-spinner';
import { cyan } from 'colors/safe';

export const logger = {
  log(msg = '', spinner = false): any {
    // Do not print logs during testing.
    if (process.env.P1Z7kEbSUUPMxF8GqPwD8Gx_FOAL_CLI_TEST === 'true') {
      return;
    }

    if (spinner) {
      const spinner = new Spinner(msg);
      spinner.setSpinnerString(18);
      spinner.start();
      return spinner;
    }

    console.log(msg);
  },
  logCommand(msg: string) {
    this.log(`    $ ${cyan(msg)}`);
  }
}