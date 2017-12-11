import { ConnectionService } from './connection.service';
import { UserService } from './user.service';

describe('UserService', () => {

  let service: UserService;
  let connection: ConnectionService;

  it('should instantiate.', () => {
    connection = new ConnectionService();
    service = new UserService(connection);
  });
});
