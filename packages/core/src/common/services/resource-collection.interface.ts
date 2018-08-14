import { AbstractUser } from '../../auth';

/**
 * Service interface. Create, read, update or delete resources and return representations of them.
 *
 * @export
 * @interface IResourceCollection
 */
export interface IResourceCollection {
  createOne(user: AbstractUser|undefined, record: object);
  createMany(user: AbstractUser|undefined, records: object[]);

  findById(user: AbstractUser|undefined, query: object);
  find(user: AbstractUser|undefined, query: object);

  updateById(user: AbstractUser|undefined, query: object, record: object);

  deleteById(user: AbstractUser|undefined, query: object);
}
