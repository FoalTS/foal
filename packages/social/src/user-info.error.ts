/**
 * Error than can be thrown in `AbstractProvider.getUserFromTokens` if the request to the
 * resource server is unsuccessful.
 *
 * @export
 * @class UserInfoError
 * @extends {Error}
 */
export class UserInfoError extends Error {
  readonly name = 'UserInfoError';

  constructor(readonly error: any) {
    super(
      'The resource server returned an error. Impossible to access the user\'s information.\n'
      + JSON.stringify(error, null, 2)
    );
  }
}
