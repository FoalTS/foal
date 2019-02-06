import { Document, model, Model, models, Schema } from 'mongoose';

const testFooBarSchema: Schema = new Schema({

});

export interface ITestFooBar extends Document {

}

export const TestFooBar: Model<ITestFooBar> = models.TestFooBar || model<ITestFooBar>('TestFooBar', testFooBarSchema);
