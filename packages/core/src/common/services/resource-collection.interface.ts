import { AbstractUser } from '../../auth';

/**
 * Service interface. Create, read, update or delete resources and return representations of them.
 *
 * @export
 * @interface IResourceCollection
 */
export interface IResourceCollection {
  create(user: AbstractUser|undefined, data: object, params: { fields?: string[] });

  find(user: AbstractUser|undefined, params: { query?: object, fields?: string[] });
  findById(user: AbstractUser|undefined, id, params: { fields?: string[] });

  modifyById(user: AbstractUser|undefined, id, data: object, params: { fields?: string[] });
  updateById(user: AbstractUser|undefined, id, data: object, params: { fields?: string[] });

  deleteById(user: AbstractUser|undefined, id, params: {});
}

export interface CollectionParams {
  query?: object;
  fields?: string[];
}
