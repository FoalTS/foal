// 3p
import { Model } from 'mongoose';

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
