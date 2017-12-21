import { ObjectType } from '../../interfaces';

export interface ViewService {
  render(locals: ObjectType): Promise<string>|string;
}
