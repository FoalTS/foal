export class UserInfoError extends Error {
  readonly name = 'UserInfoError';

  constructor(readonly error: any) {
    super(
      'The resource server returned an error. Impossible to access the user\'s information.\n'
      + JSON.stringify(error, null, 2)
    );
  }
}
