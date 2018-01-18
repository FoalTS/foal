import { Service } from '@foal/core';
import { SequelizeConnectionService } from '@foal/sequelize';

import { config } from '../../config';

@Service()
export class ConnectionService extends SequelizeConnectionService {
  constructor() {
    super(config.db.dbName, config.db.user, config.db.password, config.db.options);
  }
}
