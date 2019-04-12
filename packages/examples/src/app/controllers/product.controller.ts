import {
  Context, Delete, Get, HttpResponseCreated, HttpResponseMethodNotAllowed,
  HttpResponseNoContent, HttpResponseNotFound, HttpResponseOK, Patch, Post,
  Put, ValidateBody, ValidateParams, ValidateQuery
} from '@foal/core';
import { getRepository } from 'typeorm';

import { Product } from '../entities';

const productSchema = {
  additionalProperties: false,
  properties: {
    text: { type: 'string', maxLength: 255 },
  },
  required: [ 'text' ],
  type: 'object',
};

export class ProductController {

  @Get('/')
  @ValidateQuery({
    properties: {
      skip: { type: 'number' },
      take: { type: 'number' },
    },
    type: 'object',
  })
  async get(ctx: Context) {
    const products = await getRepository(Product).find({
      skip: ctx.request.query.skip,
      take: ctx.request.query.take
    });
    return new HttpResponseOK(products);
  }

  @Get('/:id')
  @ValidateParams({ properties: { id: { type: 'number' } }, type: 'object' })
  async getById(ctx: Context) {
    const product = await getRepository(Product).findOne(ctx.request.params.id);

    if (!product) {
      return new HttpResponseNotFound();
    }

    return new HttpResponseOK(product);
  }

  @Post('/')
  @ValidateBody(productSchema)
  async post(ctx: Context) {
    const product = await getRepository(Product).save(ctx.request.body);
    return new HttpResponseCreated(product);
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
  @ValidateBody({ ...productSchema, required: [] })
  async patchById(ctx: Context) {
    const product = await getRepository(Product).findOne(ctx.request.params.id);

    if (!product) {
      return new HttpResponseNotFound();
    }

    Object.assign(product, ctx.request.body);

    await getRepository(Product).save(product);

    return new HttpResponseOK(product);
  }

  @Put('/')
  put() {
    return new HttpResponseMethodNotAllowed();
  }

  @Put('/:id')
  @ValidateParams({ properties: { id: { type: 'number' } }, type: 'object' })
  @ValidateBody(productSchema)
  async putById(ctx: Context) {
    const product = await getRepository(Product).findOne(ctx.request.params.id);

    if (!product) {
      return new HttpResponseNotFound();
    }

    Object.assign(product, ctx.request.body);

    await getRepository(Product).save(product);

    return new HttpResponseOK(product);
  }

  @Delete('/')
  delete() {
    return new HttpResponseMethodNotAllowed();
  }

  @Delete('/:id')
  @ValidateParams({ properties: { id: { type: 'number' } }, type: 'object' })
  async deleteById(ctx: Context) {
    const product = await getRepository(Product).findOne(ctx.request.params.id);

    if (!product) {
      return new HttpResponseNotFound();
    }

    await getRepository(Product).delete(ctx.request.params.id);

    return new HttpResponseNoContent();
  }

}
