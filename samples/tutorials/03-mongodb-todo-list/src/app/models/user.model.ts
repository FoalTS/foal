// import { hashPassword } from '@foal/core';
import { Document, model, Model, models, Schema } from 'mongoose';

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
//   this.password = await hashPassword(password);
// };

export interface IUser extends Document {
  email: string;
  password: string;
  // setPassword: (password: string) => Promise<void>;
}

export const User: Model<IUser> = models.User || model<IUser>('User', userSchema);
