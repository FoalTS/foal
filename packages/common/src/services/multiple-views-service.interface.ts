import { ObjectType } from '@foal/core';

export interface MultipleViewsService<View> {
  render(name: View, locals: ObjectType): Promise<string>|string;
}
