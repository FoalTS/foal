// std
import { notStrictEqual, strictEqual } from 'assert';

// 3p
import { connect, disconnect, Document, Model, model, Schema } from 'mongoose';

// FoalTS
import { fetchUser } from './fetch-user.util';

describe('fetchUser', () => {

  const UserSchema: Schema = new Schema({
    name: {
      type: String
    }
  });

  interface IUser extends Document {
    name: string;
  }

  const User: Model<IUser> = model<IUser>('User', UserSchema);

  let user: IUser;

  before(async () => {
    await connect('mongodb://localhost:27017/test_db', { useNewUrlParser: true });

    await new Promise((resolve, reject) => {
      User.deleteMany({}, err => err ? reject(err) : resolve());
    });

    user = new User({ name: 'Alex' });
    await user.save();
  });

  after(() => disconnect());

  it('should return the user fetched from the database.', async () => {
    const actual = await fetchUser(User)(user._id.toString());
    notStrictEqual(actual, undefined);
    strictEqual(user._id.equals((actual as IUser)._id), true);
  });

  it('should return undefined if no user is found in the database.', async () => {
    const actual = await fetchUser(User)('5c584690ba14b143235f195d');
    strictEqual(actual, undefined);
  });

});
