import { AbstractUser } from '../../auth';

/**
 * Service interface. Create, read, update or delete resources and return representations of them.
 *
 * @export
 * @interface IResourceCollection
 */
export interface IResourceCollection {
  create(user: AbstractUser|undefined, data: object);

  findById(user: AbstractUser|undefined, id, query: object);
  find(user: AbstractUser|undefined, params: { query: object });

  modifyById(user: AbstractUser|undefined, id, query: object, data: object);
  updateById(user: AbstractUser|undefined, id, query: object, data: object);

  deleteById(user: AbstractUser|undefined, id, query: object);
}
