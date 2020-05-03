// import { hashPassword } from '@foal/core';
import { model, models, Schema } from 'mongoose';

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

export const User = models.User || model('User', userSchema);
