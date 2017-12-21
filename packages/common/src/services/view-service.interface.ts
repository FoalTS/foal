import { ObjectType } from '@foal/core';

export interface ViewService {
  render(locals: ObjectType): Promise<string>|string;
}
