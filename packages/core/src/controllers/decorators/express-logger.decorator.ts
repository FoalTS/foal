import { newExpressDecorator } from '../factories';

export function expressLogger(message: string) {
  return newExpressDecorator((req, res, next) => {
    console.log(`Log: ${message}`);
    next();
  });
}
