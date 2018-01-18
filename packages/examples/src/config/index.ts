import { logOptions } from '@foal/express';

export const config = {
  db: {
    dbName: 'foal_examples',
    options: {
      dialect: 'postgres'
    },
    password: 'password',
    user: 'postgres',
  },
  errors: {
    logs: 'all' as logOptions,
    sendStack: true
  }
};
