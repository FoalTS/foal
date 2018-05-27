export interface IModelService {
  createOne(record: object);
  createMany(records: object[]);

  findOne(query: object);
  findMany(query: object);

  updateOne(query: object, record: object);

  removeOne(query: object);
}
