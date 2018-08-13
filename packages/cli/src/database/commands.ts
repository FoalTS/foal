// 3p
import * as program from 'commander';

// FoalTS
import { createGroup } from './create-group';
import { createPermission } from './create-permission';
import { createUser } from './create-user';

program
  .command('createpermission <name> <codeName>')
  .description('Creates a new permission in the default database.')
  .action(async (name: string, codeName: string) => {
    console.log(
      await createPermission(name, codeName)
    );
  });

program
  .command('creategroup <name> <codeName>')
  .description('Creates a new user group in the default database.')
  .option(
    '-p, --permissions <permissions>',
    'Code names of the group permissions (separated by commas with no spaces).'
  )
  .action(async (name: string, codeName: string, options) => {
    const permissions = (options.permissions as string || '').split(',').filter(s => s !== '');
    console.log(
      await createGroup(name, codeName, permissions)
    );
  });

program
  .command('createuser')
  .description('Creates a new user in the default database.')
  .option('-g, --groups <groups>', 'Code names of the groups of the user (separated by commas with no spaces).')
  .option(
    '-u, --user-permissions <permissions>',
    'Code names of the user permissions (separated by commas with no spaces).'
  )
  .option('-p, --properties <mode>', 'A JSON object which defines the other properties of the user.')
  .action(async options => {
    const groups = (options.groups as string || '').split(',').filter(s => s !== '');
    const userPermissions = (options.userPermissions as string || '').split(',').filter(s => s !== '');
    let properties: object;
    try {
      properties = JSON.parse(options.properties as string || '{}');
    } catch (err) {
      console.log('An error happened while parsing the "properties" json object. Make sure that is'
        + ' not a "quote" issue.');
      console.log(err.message);
      return;
    }
    console.log(
      await createUser(groups, userPermissions, properties)
    );
  });
