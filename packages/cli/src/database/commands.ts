// 3p
import * as program from 'commander';

// FoalTS
import { createUser } from './create-user';

program
  .command('createuser')
  .description('Creates a new user in the default database.')
  .option('-g, --groups <groups>', 'Code names of the groups of the user (separated by commas with no spaces).')
  .option(
    '-u, --user-permissions <permissions>',
    'Code names of the permissions of the user (separated by commas with no spaces).'
  )
  .option('-p, --properties <mode>', 'A JSON object which defines the other properties of the user.')
  .action(options => {
    const groups = (options.groups || '').split(',');
    const userPermissions = (options.userPermissions || '').split(',');
    let properties: object;
    try {
      properties = JSON.parse(options.properties || '{}');
    } catch (err) {
      console.error('An error happened while parsing the "properties" json object. Make sure that is'
        + ' not a "quote" issue.');
      console.error(err.message);
      return;
    }
    createUser(groups, userPermissions, properties);
  });
