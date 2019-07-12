// 3p
import { Model } from 'mongoose';

/**
 * Create a function that finds the first document that matches some id.
 *
 * It returns undefined if no document can be found.
 *
 * This function is usually used by:
 * - TokenRequired (@foal/core)
 * - TokenOptional (@foal/core)
 * - JWTRequired (@foal/jwt)
 * - JWTOptional (@foal/jwt)
 *
 * @export
 * @param {Model<any>} userModel - The Mongoose Model
 * @returns {((id: number|string) => Promise<any>)} The returned function expecting an id.
 */
export function fetchUser(userModel: Model<any>): (id: number|string) => Promise<any> {
  return (id: number|string) => {
    return new Promise((resolve, reject) => {
      userModel.findOne({ _id: id }, (err: any, res: Model<any>|null) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(res || undefined);
      });
    });
  };
}
