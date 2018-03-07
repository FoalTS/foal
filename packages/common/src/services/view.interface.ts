import { ObjectType } from '@foal/core';

export interface IView {
  render(locals: ObjectType): Promise<string>|string;
}
