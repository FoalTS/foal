/**
 * Service interface. Create, read, update or delete resources and return representations of them.
 *
 * @export
 * @interface IResourceCollection
 */
export interface IResourceCollection {
  createOne(record: object);
  createMany(records: object[]);

  findOne(query: object);
  findMany(query: object);

  updateOne(query: object, record: object);

  removeOne(query: object);
}
