import { ReadService } from '@foal/common';

export interface Strategy {
  passportStrategy: any;
  init(userService: ReadService): void;
  verify(...args: any[]): Promise<any>;
}
