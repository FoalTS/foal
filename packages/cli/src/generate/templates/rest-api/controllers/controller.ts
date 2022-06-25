import {
  ApiOperationDescription, ApiOperationId, ApiOperationSummary, ApiResponse,
  ApiUseTag, Context, Delete, Get, HttpResponseCreated,
  HttpResponseNoContent, HttpResponseNotFound, HttpResponseOK, Patch, Post,
  Put, ValidateBody, ValidatePathParam, ValidateQueryParam
} from '@foal/core';
import { getRepository } from 'typeorm';

import { /* upperFirstCamelName */ } from '/* entitiesPath */';

const /* camelName */Schema = {
  additionalProperties: false,
  properties: {
    text: { type: 'string', maxLength: 255 },
  },
  required: [ 'text' ],
  type: 'object',
};

@ApiUseTag('/* camelName */')
export class /* upperFirstCamelName */Controller {

  @Get()
  @ApiOperationId('find/* upperFirstCamelName */s')
  @ApiOperationSummary('Find /* camelName */s.')
  @ApiOperationDescription(
    'The query parameters "skip" and "take" can be used for pagination. The first ' +
    'is the offset and the second is the number of elements to be returned.'
  )
  @ApiResponse(400, { description: 'Invalid query parameters.' })
  @ApiResponse(200, { description: 'Returns a list of /* camelName */s.' })
  @ValidateQueryParam('skip', { type: 'number' }, { required: false })
  @ValidateQueryParam('take', { type: 'number' }, { required: false })
  async find/* upperFirstCamelName */s(ctx: Context) {
    const /* camelName */s = await getRepository(/* upperFirstCamelName */).find({
      skip: ctx.request.query.skip,
      take: ctx.request.query.take,
      where: {},
    });
    return new HttpResponseOK(/* camelName */s);
  }

  @Get('/:/* camelName */Id')
  @ApiOperationId('find/* upperFirstCamelName */ById')
  @ApiOperationSummary('Find a /* camelName */ by ID.')
  @ApiResponse(404, { description: '/* upperFirstCamelName */ not found.' })
  @ApiResponse(200, { description: 'Returns the /* camelName */.' })
  @ValidatePathParam('/* camelName */Id', { type: 'number' })
  async find/* upperFirstCamelName */ById(ctx: Context) {
    const /* camelName */ = await getRepository(/* upperFirstCamelName */).findOne(ctx.request.params./* camelName */Id);

    if (!/* camelName */) {
      return new HttpResponseNotFound();
    }

    return new HttpResponseOK(/* camelName */);
  }

  @Post()
  @ApiOperationId('create/* upperFirstCamelName */')
  @ApiOperationSummary('Create a new /* camelName */.')
  @ApiResponse(400, { description: 'Invalid /* camelName */.' })
  @ApiResponse(201, { description: '/* upperFirstCamelName */ successfully created. Returns the /* camelName */.' })
  @ValidateBody(/* camelName */Schema)
  async create/* upperFirstCamelName */(ctx: Context) {
    const /* camelName */ = await getRepository(/* upperFirstCamelName */).save(ctx.request.body);
    return new HttpResponseCreated(/* camelName */);
  }

  @Patch('/:/* camelName */Id')
  @ApiOperationId('modify/* upperFirstCamelName */')
  @ApiOperationSummary('Update/modify an existing /* camelName */.')
  @ApiResponse(400, { description: 'Invalid /* camelName */.' })
  @ApiResponse(404, { description: '/* upperFirstCamelName */ not found.' })
  @ApiResponse(200, { description: '/* upperFirstCamelName */ successfully updated. Returns the /* camelName */.' })
  @ValidatePathParam('/* camelName */Id', { type: 'number' })
  @ValidateBody({ .../* camelName */Schema, required: [] })
  async modify/* upperFirstCamelName */(ctx: Context) {
    const /* camelName */ = await getRepository(/* upperFirstCamelName */).findOne(ctx.request.params./* camelName */Id);

    if (!/* camelName */) {
      return new HttpResponseNotFound();
    }

    Object.assign(/* camelName */, ctx.request.body);

    await getRepository(/* upperFirstCamelName */).save(/* camelName */);

    return new HttpResponseOK(/* camelName */);
  }

  @Put('/:/* camelName */Id')
  @ApiOperationId('replace/* upperFirstCamelName */')
  @ApiOperationSummary('Update/replace an existing /* camelName */.')
  @ApiResponse(400, { description: 'Invalid /* camelName */.' })
  @ApiResponse(404, { description: '/* upperFirstCamelName */ not found.' })
  @ApiResponse(200, { description: '/* upperFirstCamelName */ successfully updated. Returns the /* camelName */.' })
  @ValidatePathParam('/* camelName */Id', { type: 'number' })
  @ValidateBody(/* camelName */Schema)
  async replace/* upperFirstCamelName */(ctx: Context) {
    const /* camelName */ = await getRepository(/* upperFirstCamelName */).findOne(ctx.request.params./* camelName */Id);

    if (!/* camelName */) {
      return new HttpResponseNotFound();
    }

    Object.assign(/* camelName */, ctx.request.body);

    await getRepository(/* upperFirstCamelName */).save(/* camelName */);

    return new HttpResponseOK(/* camelName */);
  }

  @Delete('/:/* camelName */Id')
  @ApiOperationId('delete/* upperFirstCamelName */')
  @ApiOperationSummary('Delete a /* camelName */.')
  @ApiResponse(404, { description: '/* upperFirstCamelName */ not found.' })
  @ApiResponse(204, { description: '/* upperFirstCamelName */ successfully deleted.' })
  @ValidatePathParam('/* camelName */Id', { type: 'number' })
  async delete/* upperFirstCamelName */(ctx: Context) {
    const /* camelName */ = await getRepository(/* upperFirstCamelName */).findOne(ctx.request.params./* camelName */Id);

    if (!/* camelName */) {
      return new HttpResponseNotFound();
    }

    await getRepository(/* upperFirstCamelName */).delete(ctx.request.params./* camelName */Id);

    return new HttpResponseNoContent();
  }

}
