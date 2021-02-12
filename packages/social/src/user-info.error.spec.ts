// std
import { strictEqual } from 'assert';

// FoalTS
import { UserInfoError } from './user-info.error';

describe('UserInfoError', () => {

  it('should have a "message" property.', () => {
    const err = {
      foo: 'bar'
    };
    const error = new UserInfoError(err);

    strictEqual(
      error.message,
      `The resource server returned an error. Impossible to access the user's information.
{
  "foo": "bar"
}`
    );
  });

  it('should have a "name" property.', () => {
    const error = new UserInfoError({});

    strictEqual(error.name, 'UserInfoError');
  });

  it('should have an "error" property.', () => {
    const err = {
      foo: 'bar'
    };
    const error = new UserInfoError(err);

    strictEqual(error.error, err);
  });

});
