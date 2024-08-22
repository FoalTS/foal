// std
import { strictEqual } from 'assert';

// FoalTS
import { ConfigNotFoundError } from './config-not-found.error';

describe('ConfigNotFoundError', () => {

  it('should set the property "key" and "msg" from the constructor.', () => {
    const err = new ConfigNotFoundError('settings.xxx');
    strictEqual(err.key, 'settings.xxx');
    strictEqual(err.msg, undefined);

    const err2 = new ConfigNotFoundError('settings.xxx', 'You must provide a secret.');
    strictEqual(err2.msg, 'You must provide a secret.');
  });

  it('should have the proper message.', () => {
    const err = new ConfigNotFoundError('settings.session.store');
    strictEqual(err.message, `No value found for the configuration key "settings.session.store".`);
  });

  it('should have the proper message (custom message).', () => {
    const err = new ConfigNotFoundError('settings.session.store', 'Custom message');
    strictEqual(err.message, `No value found for the configuration key "settings.session.store". Custom message`);
  });

});
