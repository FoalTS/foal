import { ObjectType } from '@foal/core';

// In the docs, precise if a method is atomic.

export type SyncOrAsync<T> = T | Promise<T>;

export interface ModelService<IModel, ICreatingModel = IModel, IIdAndTimeStamps = { id: string }, IdType = string> {
  // Create
  createOne(data: ICreatingModel): SyncOrAsync<IModel & IIdAndTimeStamps>;
  createMany(records: ICreatingModel[]): SyncOrAsync<(IModel & IIdAndTimeStamps)[]>;

  // Read
  findById(id: IdType): SyncOrAsync<IModel & IIdAndTimeStamps>;
  findOne(query: ObjectType): SyncOrAsync<IModel & IIdAndTimeStamps>;
  findAll(query: ObjectType): SyncOrAsync<(IModel & IIdAndTimeStamps)[]>;

  // Update
  findByIdAndUpdate(id: IdType, data: Partial<IModel & IIdAndTimeStamps>): SyncOrAsync<IModel & IIdAndTimeStamps>;
  findOneAndUpdate(query: ObjectType, data: Partial<IModel & IIdAndTimeStamps>): SyncOrAsync<IModel & IIdAndTimeStamps>;
  updateMany(query: ObjectType, data: Partial<IModel & IIdAndTimeStamps>): SyncOrAsync<void>;

  // Replace
  findByIdAndReplace(id: IdType, data: IModel & Partial<IIdAndTimeStamps>): SyncOrAsync<IModel & IIdAndTimeStamps>;
  findOneAndReplace(query: ObjectType, data: IModel & Partial<IIdAndTimeStamps>):
    SyncOrAsync<IModel & IIdAndTimeStamps>;

  // Delete
  findByIdAndRemove(id: IdType): SyncOrAsync<void>;
  findOneAndRemove(query: ObjectType): SyncOrAsync<void>;
  removeMany(query: ObjectType): SyncOrAsync<void>;
}
