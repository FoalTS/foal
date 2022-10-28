import {
  ApiOperationDescription, ApiOperationId, ApiOperationSummary, ApiResponse,
  ApiUseTag, Context, Delete, Get, HttpResponseCreated,
  HttpResponseNoContent, HttpResponseNotFound, HttpResponseOK, Patch, Post,
  Put, ValidateBody, ValidatePathParam, ValidateQueryParam
} from '@foal/core';

import { TestFooBar, User } from '../entities';

const testFooBarSchema = {
  additionalProperties: false,
  properties: {
    text: { type: 'string', maxLength: 255 },
  },
  required: [ 'text' ],
  type: 'object',
};

@ApiUseTag('testFooBar')
export class TestFooBarController {

  @Get()
  @ApiOperationId('findTestFooBars')
  @ApiOperationSummary('Find testFooBars.')
  @ApiOperationDescription(
    'The query parameters "skip" and "take" can be used for pagination. The first ' +
    'is the offset and the second is the number of elements to be returned.'
  )
  @ApiResponse(400, { description: 'Invalid query parameters.' })
  @ApiResponse(200, { description: 'Returns a list of testFooBars.' })
  @ValidateQueryParam('skip', { type: 'number' }, { required: false })
  @ValidateQueryParam('take', { type: 'number' }, { required: false })
  async findTestFooBars(ctx: Context<User>) {
    const testFooBars = await TestFooBar.find({
      skip: ctx.request.query.skip,
      take: ctx.request.query.take,
      where: {
        owner: { id: ctx.user.id }
      }
    });
    return new HttpResponseOK(testFooBars);
  }

  @Get('/:testFooBarId')
  @ApiOperationId('findTestFooBarById')
  @ApiOperationSummary('Find a testFooBar by ID.')
  @ApiResponse(404, { description: 'TestFooBar not found.' })
  @ApiResponse(200, { description: 'Returns the testFooBar.' })
  @ValidatePathParam('testFooBarId', { type: 'number' })
  async findTestFooBarById(ctx: Context<User>) {
    const testFooBar = await TestFooBar.findOneBy({
      id: ctx.request.params.testFooBarId,
      owner: { id: ctx.user.id }
    });

    if (!testFooBar) {
      return new HttpResponseNotFound();
    }

    return new HttpResponseOK(testFooBar);
  }

  @Post()
  @ApiOperationId('createTestFooBar')
  @ApiOperationSummary('Create a new testFooBar.')
  @ApiResponse(400, { description: 'Invalid testFooBar.' })
  @ApiResponse(201, { description: 'TestFooBar successfully created. Returns the testFooBar.' })
  @ValidateBody(testFooBarSchema)
  async createTestFooBar(ctx: Context<User>) {
    const testFooBar = await TestFooBar.save({
      ...ctx.request.body,
      owner: { id: ctx.user.id }
    });
    return new HttpResponseCreated(testFooBar);
  }

  @Patch('/:testFooBarId')
  @ApiOperationId('modifyTestFooBar')
  @ApiOperationSummary('Update/modify an existing testFooBar.')
  @ApiResponse(400, { description: 'Invalid testFooBar.' })
  @ApiResponse(404, { description: 'TestFooBar not found.' })
  @ApiResponse(200, { description: 'TestFooBar successfully updated. Returns the testFooBar.' })
  @ValidatePathParam('testFooBarId', { type: 'number' })
  @ValidateBody({ ...testFooBarSchema, required: [] })
  async modifyTestFooBar(ctx: Context<User>) {
    const testFooBar = await TestFooBar.findOneBy({
      id: ctx.request.params.testFooBarId,
      owner: { id: ctx.user.id }
    });

    if (!testFooBar) {
      return new HttpResponseNotFound();
    }

    Object.assign(testFooBar, ctx.request.body);

    await TestFooBar.save(testFooBar);

    return new HttpResponseOK(testFooBar);
  }

  @Put('/:testFooBarId')
  @ApiOperationId('replaceTestFooBar')
  @ApiOperationSummary('Update/replace an existing testFooBar.')
  @ApiResponse(400, { description: 'Invalid testFooBar.' })
  @ApiResponse(404, { description: 'TestFooBar not found.' })
  @ApiResponse(200, { description: 'TestFooBar successfully updated. Returns the testFooBar.' })
  @ValidatePathParam('testFooBarId', { type: 'number' })
  @ValidateBody(testFooBarSchema)
  async replaceTestFooBar(ctx: Context<User>) {
    const testFooBar = await TestFooBar.findOneBy({
      id: ctx.request.params.testFooBarId,
      owner: { id: ctx.user.id }
    });

    if (!testFooBar) {
      return new HttpResponseNotFound();
    }

    Object.assign(testFooBar, ctx.request.body);

    await TestFooBar.save(testFooBar);

    return new HttpResponseOK(testFooBar);
  }

  @Delete('/:testFooBarId')
  @ApiOperationId('deleteTestFooBar')
  @ApiOperationSummary('Delete a testFooBar.')
  @ApiResponse(404, { description: 'TestFooBar not found.' })
  @ApiResponse(204, { description: 'TestFooBar successfully deleted.' })
  @ValidatePathParam('testFooBarId', { type: 'number' })
  async deleteTestFooBar(ctx: Context<User>) {
    const testFooBar = await TestFooBar.findOneBy({
      id: ctx.request.params.testFooBarId,
      owner: { id: ctx.user.id }
    });

    if (!testFooBar) {
      return new HttpResponseNotFound();
    }

    await TestFooBar.delete({ id: ctx.request.params.testFooBarId });

    return new HttpResponseNoContent();
  }

}
