import { ObjectType } from '../../index';

export interface ViewService {
  render(locals: ObjectType): Promise<string>|string;
}
