import {
  ApiOperationDescription, ApiOperationSummary, ApiResponse,
  Context, Delete, Get, HttpResponseCreated,
  HttpResponseNoContent, HttpResponseNotFound, HttpResponseOK, Patch, Post,
  Put, ValidateBody, ValidateParams, ValidateQuery
} from '@foal/core';
import { getRepository } from 'typeorm';

import { TestFooBar } from './test-foo-bar.entity';

const testFooBarSchema = {
  additionalProperties: false,
  properties: {
    text: { type: 'string', maxLength: 255 },
  },
  required: [ 'text' ],
  type: 'object',
};

export class TestFooBarController {

  @Get()
  @ApiOperationSummary('Find testFooBars.')
  @ApiOperationDescription(
    'The query parameters "skip" and "take" can be used for pagination. The first ' +
    'is the offset and the second is the number of elements to be returned.'
  )
  @ApiResponse(400, { description: 'Invalid query parameters.' })
  @ApiResponse(200, { description: 'Returns a list of testFooBars.' })
  @ValidateQuery({
    properties: {
      skip: { type: 'number' },
      take: { type: 'number' },
    },
    type: 'object',
  })
  async get(ctx: Context) {
    const testFooBars = await getRepository(TestFooBar).find({
      skip: ctx.request.query.skip,
      take: ctx.request.query.take
    });
    return new HttpResponseOK(testFooBars);
  }

  @Get('/:testFooBarId')
  @ApiOperationSummary('Find a testFooBar by ID.')
  @ApiResponse(404, { description: 'TestFooBar not found.' })
  @ApiResponse(200, { description: 'Returns the testFooBar.' })
  @ValidateParams({ properties: { testFooBarId: { type: 'number' } }, type: 'object' })
  async getById(ctx: Context) {
    const testFooBar = await getRepository(TestFooBar).findOne(ctx.request.params.testFooBarId);

    if (!testFooBar) {
      return new HttpResponseNotFound();
    }

    return new HttpResponseOK(testFooBar);
  }

  @Post()
  @ApiOperationSummary('Create a new testFooBar.')
  @ApiResponse(400, { description: 'Invalid testFooBar.' })
  @ApiResponse(201, { description: 'TestFooBar successfully created. Returns the testFooBar.' })
  @ValidateBody(testFooBarSchema)
  async post(ctx: Context) {
    const testFooBar = await getRepository(TestFooBar).save(ctx.request.body);
    return new HttpResponseCreated(testFooBar);
  }

  @Patch('/:testFooBarId')
  @ApiOperationSummary('Update/modify an existing testFooBar.')
  @ApiResponse(400, { description: 'Invalid testFooBar.' })
  @ApiResponse(404, { description: 'TestFooBar not found.' })
  @ApiResponse(200, { description: 'TestFooBar successfully updated. Returns the testFooBar.' })
  @ValidateParams({ properties: { testFooBarId: { type: 'number' } }, type: 'object' })
  @ValidateBody({ ...testFooBarSchema, required: [] })
  async patchById(ctx: Context) {
    const testFooBar = await getRepository(TestFooBar).findOne(ctx.request.params.testFooBarId);

    if (!testFooBar) {
      return new HttpResponseNotFound();
    }

    Object.assign(testFooBar, ctx.request.body);

    await getRepository(TestFooBar).save(testFooBar);

    return new HttpResponseOK(testFooBar);
  }

  @Put('/:testFooBarId')
  @ApiOperationSummary('Update/replace an existing testFooBar.')
  @ApiResponse(400, { description: 'Invalid testFooBar.' })
  @ApiResponse(404, { description: 'TestFooBar not found.' })
  @ApiResponse(200, { description: 'TestFooBar successfully updated. Returns the testFooBar.' })
  @ValidateParams({ properties: { testFooBarId: { type: 'number' } }, type: 'object' })
  @ValidateBody(testFooBarSchema)
  async putById(ctx: Context) {
    const testFooBar = await getRepository(TestFooBar).findOne(ctx.request.params.testFooBarId);

    if (!testFooBar) {
      return new HttpResponseNotFound();
    }

    Object.assign(testFooBar, ctx.request.body);

    await getRepository(TestFooBar).save(testFooBar);

    return new HttpResponseOK(testFooBar);
  }

  @Delete('/:testFooBarId')
  @ApiOperationSummary('Delete a testFooBar.')
  @ApiResponse(404, { description: 'TestFooBar not found.' })
  @ApiResponse(204, { description: 'TestFooBar successfully deleted.' })
  @ValidateParams({ properties: { testFooBarId: { type: 'number' } }, type: 'object' })
  async deleteById(ctx: Context) {
    const testFooBar = await getRepository(TestFooBar).findOne(ctx.request.params.testFooBarId);

    if (!testFooBar) {
      return new HttpResponseNotFound();
    }

    await getRepository(TestFooBar).delete(ctx.request.params.testFooBarId);

    return new HttpResponseNoContent();
  }

}
