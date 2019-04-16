import { IApiTag } from '../interfaces';

export function mergeTags(tags1: IApiTag[] | undefined, tags2: IApiTag[] | undefined): IApiTag[] | undefined {
  if (!tags1 && !tags2) {
    return undefined;
  }
  return (tags1 || []).concat(tags2 || []);
}
