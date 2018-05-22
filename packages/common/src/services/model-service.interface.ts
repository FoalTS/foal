export interface IModelService {
  createOne(record: object);
  createMany(records: object[]);

  findOne(query: object);
  findMany(query: object);

  updateOne(record: object, query: object);
  updateMany(records: object[], queries: object[]);

  removeOne(query: object);
  removeMany(query: object);
}
