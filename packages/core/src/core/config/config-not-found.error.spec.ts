// std
import { strictEqual } from 'assert';

// FoalTS
import { ConfigNotFoundError } from './config-not-found.error';

describe('ConfigNotFoundError', () => {

  afterEach(() => delete process.env.NODE_ENV);

  it('should set the property "key" and "msg" from the constructor.', () => {
    const err = new ConfigNotFoundError('settings.xxx');
    strictEqual(err.key, 'settings.xxx');
    strictEqual(err.msg, undefined);

    const err2 = new ConfigNotFoundError('settings.xxx', 'You must provide a secret.');
    strictEqual(err2.msg, 'You must provide a secret.');
  });

  it('should have the proper message (no NODE_ENV, no msg).', () => {
    const err = new ConfigNotFoundError('settings.xxx');
    strictEqual(
      err.message,
      'No value found for the configuration key "settings.xxx".\n'
      + '\n'
      + 'To pass a value, you can use:\n'
      + '- the environment variable SETTINGS_XXX,\n'
      + '- the ".env" file with the variable SETTINGS_XXX,\n'
      + '- the JSON file "config/development.json" with the path "settings.xxx",\n'
      + '- the YAML file "config/development.yml" with the path "settings.xxx",\n'
      + '- the JSON file "config/default.json" with the path "settings.xxx", or\n'
      + '- the YAML file "config/default.yml" with the path "settings.xxx".'
    );
  });

  it('should have the proper message (custom msg).', () => {
    const err = new ConfigNotFoundError('settings.xxx', 'You must provide a secret.');
    strictEqual(
      err.message,
      'No value found for the configuration key "settings.xxx".\n'
      + '\n'
      + 'You must provide a secret.\n'
      + '\n'
      + 'To pass a value, you can use:\n'
      + '- the environment variable SETTINGS_XXX,\n'
      + '- the ".env" file with the variable SETTINGS_XXX,\n'
      + '- the JSON file "config/development.json" with the path "settings.xxx",\n'
      + '- the YAML file "config/development.yml" with the path "settings.xxx",\n'
      + '- the JSON file "config/default.json" with the path "settings.xxx", or\n'
      + '- the YAML file "config/default.yml" with the path "settings.xxx".'
    );
  });

  it('should have the proper message (custom NODE_ENV).', () => {
    process.env.NODE_ENV = 'production';
    const err = new ConfigNotFoundError('settings.xxx');
    strictEqual(
      err.message,
      'No value found for the configuration key "settings.xxx".\n'
      + '\n'
      + 'To pass a value, you can use:\n'
      + '- the environment variable SETTINGS_XXX,\n'
      + '- the ".env" file with the variable SETTINGS_XXX,\n'
      + '- the JSON file "config/production.json" with the path "settings.xxx",\n'
      + '- the YAML file "config/production.yml" with the path "settings.xxx",\n'
      + '- the JSON file "config/default.json" with the path "settings.xxx", or\n'
      + '- the YAML file "config/default.yml" with the path "settings.xxx".'
    );
  });

});
