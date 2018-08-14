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
  find(query: object);

  updateOne(query: object, record: object);

  deleteById(query: object);
}
