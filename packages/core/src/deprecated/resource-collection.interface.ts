/**
 * Service interface. Create, read, update or delete resources and return representations of them.
 *
 * @export
 * @interface IResourceCollection
 * @deprecated
 */
export interface IResourceCollection {
  create(user: any, data: object, params: { fields?: string[] });

  find(user: any, params: { query?: object, fields?: string[] });
  findById(user: any, id, params: { fields?: string[] });

  modifyById(user: any, id, data: object, params: { fields?: string[] });
  updateById(user: any, id, data: object, params: { fields?: string[] });

  deleteById(user: any, id, params: {});
}

/**
 * @deprecated
 */
export interface CollectionParams {
  query?: object;
  fields?: string[];
  // pagination?
  // sort?
}
