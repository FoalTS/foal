import { newExpressDecorator } from '../factories';

export function logger(message: string) {
  return newExpressDecorator((req, res, next) => {
    console.log(`Log: ${message}`);
    next();
  });
}
