import { Document, model, Model, Schema } from 'mongoose';

const testFooBarSchema: Schema = new Schema({

});

export interface ITestFooBar extends Document {

}

export const TestFooBar: Model<ITestFooBar> = model<ITestFooBar>('TestFooBar', testFooBarSchema);
