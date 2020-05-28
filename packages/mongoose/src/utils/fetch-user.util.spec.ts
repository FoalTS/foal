// std
import { notStrictEqual, strictEqual } from 'assert';

// 3p

import { connect, disconnect, model, Schema } from 'mongoose';

// FoalTS
import { fetchUser } from './fetch-user.util';

describe('fetchUser', () => {

  const UserSchema = new Schema({
    name: {
      type: String
    }
  });

  let user: any;
  const User = model('User', UserSchema);

  before(async () => {
    await connect('mongodb://localhost:27017/test_db', { useNewUrlParser: true });

    await new Promise((resolve, reject) => {
      User.deleteMany({}, (err: any) => err ? reject(err) : resolve());
    });

    user = new User({ name: 'Alex' });
    await user.save();
  });

  after(() => disconnect());

  it('should throw an Error if the ID is a number.', async () => {
    try {
      await fetchUser(User)(46);
      throw new Error('An error should have been thrown');
    } catch (error) {
      strictEqual(error.message, 'Unexpected type for MongoDB user ID: number.');
    }
  });

  it('should return the user fetched from the database.', async () => {
    const actual = await fetchUser(User)(user._id.toString());
    notStrictEqual(actual, undefined);
    strictEqual(user._id.equals(actual._id), true);
  });

  it('should return undefined if no user is found in the database.', async () => {
    const actual = await fetchUser(User)('5c584690ba14b143235f195d');
    strictEqual(actual, undefined);
  });

});
