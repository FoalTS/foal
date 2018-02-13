import { ObjectType } from '@foal/core';

export interface MultipleViewsService {
  names(): string[];
  render(name: string, locals: ObjectType): Promise<string>|string;
}
