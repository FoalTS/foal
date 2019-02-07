import {
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

  @Get('/:id')
  @ValidateParams({ properties: { id: { type: 'number' } }, type: 'object' })
  async getById(ctx: Context) {
    const /* camelName */ = await getRepository(/* upperFirstCamelName */).findOne(ctx.request.params.id);

    if (!/* camelName */) {
      return new HttpResponseNotFound();
    }

    return new HttpResponseOK(/* camelName */);
  }

  @Post('/')
  @ValidateBody(/* camelName */Schema)
  async post(ctx: Context) {
    const /* camelName */ = await getRepository(/* upperFirstCamelName */).save(ctx.request.body);
    return new HttpResponseCreated(/* camelName */);
  }

  @Post('/:id')
  postById() {
    return new HttpResponseMethodNotAllowed();
  }

  @Patch('/')
  patch() {
    return new HttpResponseMethodNotAllowed();
  }

  @Patch('/:id')
  @ValidateParams({ properties: { id: { type: 'number' } }, type: 'object' })
  @ValidateBody({ .../* camelName */Schema, required: [] })
  async patchById(ctx: Context) {
    const /* camelName */ = await getRepository(/* upperFirstCamelName */).findOne(ctx.request.params.id);

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

  @Put('/:id')
  @ValidateParams({ properties: { id: { type: 'number' } }, type: 'object' })
  @ValidateBody(/* camelName */Schema)
  async putById(ctx: Context) {
    const /* camelName */ = await getRepository(/* upperFirstCamelName */).findOne(ctx.request.params.id);

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

  @Delete('/:id')
  @ValidateParams({ properties: { id: { type: 'number' } }, type: 'object' })
  async deleteById(ctx: Context) {
    const /* camelName */ = await getRepository(/* upperFirstCamelName */).findOne(ctx.request.params.id);

    if (!/* camelName */) {
      return new HttpResponseNotFound();
    }

    await getRepository(/* upperFirstCamelName */).delete(ctx.request.params.id);

    return new HttpResponseNoContent();
  }

}
