import {
  ApiOperationDescription, ApiOperationSummary, ApiResponse,
  Context, Delete, Get, HttpResponseCreated, HttpResponseMethodNotAllowed,
  HttpResponseNoContent, HttpResponseNotFound, HttpResponseOK, Patch, Post,
  Put, ValidateBody, ValidateParams, ValidateQuery
} from '@foal/core';
import { getRepository } from 'typeorm';

import { /* upperFirstCamelName */ } from './/* kebabName */.entity';

const /* camelName */Schema = {
  additionalProperties: false,
  properties: {
    text: { type: 'string', maxLength: 255 },
  },
  required: [ 'text' ],
  type: 'object',
};

export class /* upperFirstCamelName */Controller {

  @Get('/')
  @ApiOperationSummary('Find /* camelName */s.')
  @ApiOperationDescription(
    'The query parameters "skip" and "take" can be used for pagination. The first ' +
    'is the offset and the second is the number of elements to be returned.'
  )
  @ApiResponse(400, { description: 'Invalid query parameters.' })
  @ApiResponse(200, { description: 'Returns a list of /* camelName */s.' })
  @ValidateQuery({
    properties: {
      skip: { type: 'number' },
      take: { type: 'number' },
    },
    type: 'object',
  })
  async get(ctx: Context) {
    const /* camelName */s = await getRepository(/* upperFirstCamelName */).find({
      skip: ctx.request.query.skip,
      take: ctx.request.query.take
    });
    return new HttpResponseOK(/* camelName */s);
  }

  @Get('/:/* camelName */Id')
  @ApiOperationSummary('Find a /* camelName */ by ID.')
  @ApiResponse(404, { description: '/* upperFirstCamelName */ not found.' })
  @ApiResponse(200, { description: 'Returns the /* camelName */.' })
  @ValidateParams({ properties: { /* camelName */Id: { type: 'number' } }, type: 'object' })
  async getById(ctx: Context) {
    const /* camelName */ = await getRepository(/* upperFirstCamelName */).findOne(ctx.request.params./* camelName */Id);

    if (!/* camelName */) {
      return new HttpResponseNotFound();
    }

    return new HttpResponseOK(/* camelName */);
  }

  @Post('/')
  @ApiOperationSummary('Create a new /* camelName */.')
  @ApiResponse(400, { description: 'Invalid /* camelName */.' })
  @ApiResponse(201, { description: '/* upperFirstCamelName */ successfully created. Returns the /* camelName */.' })
  @ValidateBody(/* camelName */Schema)
  async post(ctx: Context) {
    const /* camelName */ = await getRepository(/* upperFirstCamelName */).save(ctx.request.body);
    return new HttpResponseCreated(/* camelName */);
  }

  @Post('/:/* camelName */Id')
  postById() {
    return new HttpResponseMethodNotAllowed();
  }

  @Patch('/')
  patch() {
    return new HttpResponseMethodNotAllowed();
  }

  @Patch('/:/* camelName */Id')
  @ApiOperationSummary('Update/modify an existing /* camelName */.')
  @ApiResponse(400, { description: 'Invalid /* camelName */.' })
  @ApiResponse(404, { description: '/* upperFirstCamelName */ not found.' })
  @ApiResponse(200, { description: '/* upperFirstCamelName */ successfully updated. Returns the /* camelName */.' })
  @ValidateParams({ properties: { /* camelName */Id: { type: 'number' } }, type: 'object' })
  @ValidateBody({ .../* camelName */Schema, required: [] })
  async patchById(ctx: Context) {
    const /* camelName */ = await getRepository(/* upperFirstCamelName */).findOne(ctx.request.params./* camelName */Id);

    if (!/* camelName */) {
      return new HttpResponseNotFound();
    }

    Object.assign(/* camelName */, ctx.request.body);

    await getRepository(/* upperFirstCamelName */).save(/* camelName */);

    return new HttpResponseOK(/* camelName */);
  }

  @Put('/')
  put() {
    return new HttpResponseMethodNotAllowed();
  }

  @Put('/:/* camelName */Id')
  @ApiOperationSummary('Update/replace an existing /* camelName */.')
  @ApiResponse(400, { description: 'Invalid /* camelName */.' })
  @ApiResponse(404, { description: '/* upperFirstCamelName */ not found.' })
  @ApiResponse(200, { description: '/* upperFirstCamelName */ successfully updated. Returns the /* camelName */.' })
  @ValidateParams({ properties: { /* camelName */Id: { type: 'number' } }, type: 'object' })
  @ValidateBody(/* camelName */Schema)
  async putById(ctx: Context) {
    const /* camelName */ = await getRepository(/* upperFirstCamelName */).findOne(ctx.request.params./* camelName */Id);

    if (!/* camelName */) {
      return new HttpResponseNotFound();
    }

    Object.assign(/* camelName */, ctx.request.body);

    await getRepository(/* upperFirstCamelName */).save(/* camelName */);

    return new HttpResponseOK(/* camelName */);
  }

  @Delete('/')
  delete() {
    return new HttpResponseMethodNotAllowed();
  }

  @Delete('/:/* camelName */Id')
  @ApiOperationSummary('Delete a /* camelName */.')
  @ApiResponse(404, { description: '/* upperFirstCamelName */ not found.' })
  @ApiResponse(204, { description: '/* upperFirstCamelName */ successfully deleted.' })
  @ValidateParams({ properties: { /* camelName */Id: { type: 'number' } }, type: 'object' })
  async deleteById(ctx: Context) {
    const /* camelName */ = await getRepository(/* upperFirstCamelName */).findOne(ctx.request.params./* camelName */Id);

    if (!/* camelName */) {
      return new HttpResponseNotFound();
    }

    await getRepository(/* upperFirstCamelName */).delete(ctx.request.params./* camelName */Id);

    return new HttpResponseNoContent();
  }

}
