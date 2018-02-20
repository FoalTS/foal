import { ObjectType } from '@foal/core';

/**
 * Every model service that is connected to a table or a collection of a database should implement
 * this interface.
 * 
 * The `ModelService` is a common interface that is used by many components in FoalTS such as the
 * `rest` controller factory or some authenticators.
 * 
 * Each method can be synchronous or asynchronous which means that it can return a promise if needed.
 * 
 * Note: Services implemeting this interface should precise for each method if it is atomic or not,
 * namely if several accesses to the database are required when executing the function.
 * 
 * @export
 * @interface ModelService
 * @template IModel Interface to describe the fields of the objects without their ids and timestamps.
 * @template ICreatingModel Interface to describe the minimum required fields to pass to create an object.
 * Default to IModel.
 * @template IIdAndTimeStamps Interface to describe the field id and the timestamp fields of the objects.
 * Default to { id: string }.
 * @template IdType Type of the id (usually number or string). Default to string.
 * @example
 * interface Task {
 *   text: string;
 *   completed: boolean;
 * }
 * interface CreatingTask {
 *   text: string;
 *   // The model service automatically add the field `completed` with a default value if none was
 *   // specified.
 *   completed?: boolean;
 * }
 * interface IdAndTimeStamps {
 *   id: string;
 *   createdAt: Date;
 *   updateAt: Date;
 * }
 * class MyModelService implements ModelService<Task, CreatingTask, IdAndTimeStamps, string> {}
 */
export interface ModelService<IModel, ICreatingModel = IModel, IIdAndTimeStamps = { id: string },
    IdType = string> {

  // Create

  /**
   * Creates one object in the database and returns it with its id and timestamps.
   * 
   * @param {ICreatingModel} data Support data that is used to create the object.
   * @returns {(IModel & IIdAndTimeStamps) | Promise<IModel & IIdAndTimeStamps>} The created object with
   * its id and timestamps.
   * @memberof ModelService
   */
  createOne(data: ICreatingModel): (IModel & IIdAndTimeStamps) | Promise<IModel & IIdAndTimeStamps>;

  /**
   * Creates several objects in the database and returns them with their ids and timestamps.
   * 
   * @param {ICreatingModel[]} records Array of support data that is used to create the objects.
   * @returns {((IModel & IIdAndTimeStamps)[] | Promise<(IModel & IIdAndTimeStamps)[]>)} The created objects
   * with their ids and timestamps.
   * @memberof ModelService
   */
  createMany(records: ICreatingModel[]): (IModel & IIdAndTimeStamps)[] | Promise<(IModel & IIdAndTimeStamps)[]>;

  // Read

  /**
   * Finds the object in the database matching the given id and returns it with its id and timestamps.
   * 
   * @param {IdType} id Unique id used to unambiguously find the object.
   * @returns {((IModel & IIdAndTimeStamps) | Promise<IModel & IIdAndTimeStamps>)} The matching object
   * with its id and timestamps.
   * @throws {NotFoundError} Throws an error if no object was found in the database for the given id.
   * @memberof ModelService
   */
  findById(id: IdType): (IModel & IIdAndTimeStamps) | Promise<IModel & IIdAndTimeStamps>;

  /**
   * Finds an object in the database matching the given query and returns it with its id and timestamps.
   * 
   * Note that if several objects match the given paramaters an exception may or may not be thrown
   * depending on the service implementation. In any case, `findOne` always returns an object and does
   * not return an array of objects.
   * 
   * @param {ObjectType} query Query used to unambiguously find the object.
   * @returns {((IModel & IIdAndTimeStamps) | Promise<IModel & IIdAndTimeStamps>)} The matching object
   * with its id and timestamps.
   * @throws {NotFoundError} Throws an error if no object was found in the database for the given query.
   * @memberof ModelService
   */
  findOne(query: ObjectType): (IModel & IIdAndTimeStamps) | Promise<IModel & IIdAndTimeStamps>;

  /**
   * Finds all the objects in the database matching the given query and returns them with their ids and
   * timestamps.
   * 
   * Note that no error is thrown if no object is found. The method returns an empty array in this case.
   * 
   * @param {ObjectType} query Query used to find the objects.
   * @returns {((IModel & IIdAndTimeStamps)[] | Promise<(IModel & IIdAndTimeStamps)[]>)} The matching
   * objects with their ids and timestamps.
   * @memberof ModelService
   */
  findAll(query: ObjectType): (IModel & IIdAndTimeStamps)[] | Promise<(IModel & IIdAndTimeStamps)[]>;

  // Update

  /**
   * Finds and updates the object in the database matching the given id and returns it with its id and
   * timestamps.
   * 
   * You can use this method to update only a few fields of the object.
   * 
   * @param {IdType} id Unique id used to unambiguously find the object.
   * @param {(Partial<IModel & IIdAndTimeStamps>)} data Object with the keys/values to update.
   * @returns {((IModel & IIdAndTimeStamps) | Promise<IModel & IIdAndTimeStamps>)} The updated object
   * with its id and timestamps.
   * @throws {NotFoundError} Throws an error if no object was found in the database for the given id.
   * @memberof ModelService
   */
  findByIdAndUpdate(id: IdType, data: Partial<IModel & IIdAndTimeStamps>):
    (IModel & IIdAndTimeStamps) | Promise<IModel & IIdAndTimeStamps>;

  /**
   * Finds and updates an object in the database matching the given query and returns it with its id and
   * timestamps.
   * 
   * You can use this method to update only a few fields of the object.
   * 
   * Note that this method makes no assumption on what happens if several objects match the given query.
   * An exception may or may not be thrown. All objects matching the query might be updated as well. It
   * depends on the service implementation. In any case, `findOneAndUpdate` always returns an object and does
   * not return an array of objects.
   * 
   * @param {ObjectType} query Query used to unambiguously find the object.
   * @param {(Partial<IModel & IIdAndTimeStamps>)} data Object with the keys/values to update.
   * @returns {((IModel & IIdAndTimeStamps) | Promise<IModel & IIdAndTimeStamps>)} The updated object
   * with its id and timestamps.
   * @throws {NotFoundError} Throws an error if no object was found in the database for the given query.
   * @memberof ModelService
   */
  findOneAndUpdate(query: ObjectType, data: Partial<IModel & IIdAndTimeStamps>):
    (IModel & IIdAndTimeStamps) | Promise<IModel & IIdAndTimeStamps>;
  
  /**
   * Update all the objects in the database matching the given query.
   * 
   * You can use this method to update only a few fields of the objects.
   * 
   * Note that no error is thrown if no object is found.
   * 
   * @param {ObjectType} query Query used to find the objects.
   * @param {(Partial<IModel & IIdAndTimeStamps>)} data Object with the keys/values to update.
   * @returns {(void | Promise<void>)} Returns nothing.
   * @memberof ModelService
   */
  updateMany(query: ObjectType, data: Partial<IModel & IIdAndTimeStamps>): void | Promise<void>;

  // Replace

  /**
   * Finds and replaces the object in the database matching the given id and returns it with its id and
   * timestamps.
   * 
   * @param {IdType} id Unique id used to unambiguously find the object.
   * @param {(IModel & Partial<IIdAndTimeStamps>)} data The new object to replace the current one.
   * @returns {((IModel & IIdAndTimeStamps) | Promise<IModel & IIdAndTimeStamps>)} The new object with
   * its id and timestamps.
   * @throws {NotFoundError} Throws an error if no object was found in the database for the given id.
   * @memberof ModelService
   */
  findByIdAndReplace(id: IdType, data: IModel & Partial<IIdAndTimeStamps>):
    (IModel & IIdAndTimeStamps) | Promise<IModel & IIdAndTimeStamps>;
  
  /**
   * Finds and replaces an object in the database matching the given query and returns it with its id and
   * timestamps.
   * 
   * Note that this method makes no assumption on what happens if several objects match the given query.
   * An exception may or may not be thrown. All objects matching the query might be replaced as well. It
   * depends on the service implementation. In any case, `findOneAndReplace` always returns an object and does
   * not return an array of objects.
   * 
   * @param {ObjectType} query Query used to unambiguously find the object.
   * @param {(IModel & Partial<IIdAndTimeStamps>)} data The new object to replace the current one.
   * @returns {((IModel & IIdAndTimeStamps) | Promise<IModel & IIdAndTimeStamps>)} The new object with
   * its id and timestamps.
   * @throws {NotFoundError} Throws an error if no object was found in the database for the given query.
   * @memberof ModelService
   */
  findOneAndReplace(query: ObjectType, data: IModel & Partial<IIdAndTimeStamps>):
    (IModel & IIdAndTimeStamps) | Promise<IModel & IIdAndTimeStamps>;

  // Delete

  /**
   * Finds and removes the object from the database matching the given id.
   * 
   * @param {IdType} id Unique id used to unambiguously find the object.
   * @returns {(void | Promise<void>)} Returns nothing.
   * @throws {NotFoundError} Throws an error if no object was found in the database for the given id.
   * @memberof ModelService
   */
  findByIdAndRemove(id: IdType): void | Promise<void>;

  /**
   * Finds and removes an object from the database matching the given query.
   * 
   * Note that this method makes no assumption on what happens if several objects match the given query.
   * An exception may or may not be thrown. All objects matching the query might be removed as well. It
   * depends on the service implementation.
   * 
   * @param {ObjectType} query Query used to unambiguously find the object.
   * @returns {(void | Promise<void>)} Returns nothing.
   * @throws {NotFoundError} Throws an error if no object was found in the database for the given query.
   * @memberof ModelService
   */
  findOneAndRemove(query: ObjectType): void | Promise<void>;

  /**
   * Removes all the objects from the database matching the given query.
   * 
   * Note that no error is thrown if no object is found.
   * 
   * @param {ObjectType} query Query use to find the objects.
   * @returns {(void | Promise<void>)} Returns nothing.
   * @memberof ModelService
   */
  removeMany(query: ObjectType): void | Promise<void>;
}
