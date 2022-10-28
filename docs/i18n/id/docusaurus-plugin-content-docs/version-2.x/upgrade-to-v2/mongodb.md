---
title: Removal of Mongoose Support
---

Due to the amount of work needed to maintain Mongoose in the framework and the large number of problems we had to face in the past, FoalTS no longer provides tools for Mongoose starting from version 2. The recommended approach to use MongoDB is now via TypeORM.

However, it is still possible to use Mongoose in your application if you want to. If you were using the `fetchUser` function from the package `@foal/mongoose` (now removed), here is its definition so that you can copy/paste it in your code:

```typescript
function fetchUser(userModel: any): (id: number|string) => Promise<any> {
  return (id: number|string) => {
    if (typeof id === 'number') {
      throw new Error('Unexpected type for MongoDB user ID: number.');
    }
    return new Promise((resolve, reject) => {
      userModel.findOne({ _id: id }, (err: any, res: any) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(res || undefined);
      });
    });
  };
}
```