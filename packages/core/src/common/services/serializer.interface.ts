/**
 * Service interface. Create, read, update or delete resources and return representations of them.
 *
 * @export
 * @interface ISerializer
 */
export interface ISerializer {
  createOne(record: object);
  createMany(records: object[]);

  findOne(query: object);
  findMany(query: object);

  updateOne(query: object, record: object);

  removeOne(query: object);
}
