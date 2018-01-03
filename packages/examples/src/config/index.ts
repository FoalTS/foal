import { logOptions } from '@foal/express';

export const config = {
  db: {
    uri: 'postgres://postgres:password@localhost:5432/foal_examples'
  },
  errors: {
    logs: 'all' as logOptions,
    sendStack: true
  }
};
