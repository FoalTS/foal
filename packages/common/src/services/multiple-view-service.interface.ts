import { ObjectType } from '@foal/core';

export interface MultipleViewService {
  names(): string[];
  render(name: string, locals: ObjectType): Promise<string>|string;
}
