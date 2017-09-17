import { ExtendedRequest, newExpressDecorator } from '@foal/core';

export function restrictToAdmin() {
  return newExpressDecorator((req: ExtendedRequest, res, next) => {
    const user = req.user;
    if (!user) {
      throw new Error('You should use the @authenticate before');
    }
    // includes is es7
    if (user.roles.includes('admin')) {
      next();
    } else {
      res.sendStatus(403);
    }
  });
}
