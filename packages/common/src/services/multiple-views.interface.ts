import { ObjectType } from '@foal/core';

export interface IMultipleViews {
  render(name: string, locals: ObjectType): Promise<string>|string;
}
