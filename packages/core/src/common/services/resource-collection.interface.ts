import { AbstractUser } from '../../auth';

/**
 * Service interface. Create, read, update or delete resources and return representations of them.
 *
 * @export
 * @interface IResourceCollection
 */
export interface IResourceCollection {
  create(user: AbstractUser|undefined, data: object, params: {});

  find(user: AbstractUser|undefined, params: { query: object });
  findById(user: AbstractUser|undefined, id, params: {});

  modifyById(user: AbstractUser|undefined, id, data: object, query: object);
  updateById(user: AbstractUser|undefined, id, data: object, query: object);

  deleteById(user: AbstractUser|undefined, id, params: {});
}
