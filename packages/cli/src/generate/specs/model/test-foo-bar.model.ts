import { model, models, Schema } from 'mongoose';

const testFooBarSchema: Schema = new Schema({

});

export const TestFooBar = models.TestFooBar || model('TestFooBar', testFooBarSchema);
