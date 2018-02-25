import { ObjectType } from '@foal/core';

export interface MultipleViewsService {
  render(name: string, locals: ObjectType): Promise<string>|string;
}
