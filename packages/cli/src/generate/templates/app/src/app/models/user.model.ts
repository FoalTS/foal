// import { encryptPassword } from '@foal/core';
import { Document, model, Model, Schema } from 'mongoose';

const userSchema: Schema = new Schema({
  // email: {
  //   required: true,
  //   type: String,
  //   unique: true
  // },
  // password: {
  //   required: true,
  //   type: String,
  // }
});

// userSchema.methods.setPassword = async function(password: string) {
//   this.model('User').password = await encryptPassword(password);
// };

export interface IUser extends Document {
  email: string;
  password: string;
}

export const User: Model<IUser> = model<IUser>('User', userSchema);
