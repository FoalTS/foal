import { UserWithPermissions } from '../../auth';

/**
 * Service interface. Create, read, update or delete resources and return representations of them.
 *
 * @export
 * @interface IResourceCollection
 */
export interface IResourceCollection {
  create(user: UserWithPermissions|undefined, data: object, params: { fields?: string[] });

  find(user: UserWithPermissions|undefined, params: { query?: object, fields?: string[] });
  findById(user: UserWithPermissions|undefined, id, params: { fields?: string[] });

  modifyById(user: UserWithPermissions|undefined, id, data: object, params: { fields?: string[] });
  updateById(user: UserWithPermissions|undefined, id, data: object, params: { fields?: string[] });

  deleteById(user: UserWithPermissions|undefined, id, params: {});
}

export interface CollectionParams {
  query?: object;
  fields?: string[];
  // pagination?
  // sort?
}
