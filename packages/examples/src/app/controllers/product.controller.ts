import {
  ApiOperationDescription, ApiOperationSummary, ApiResponse,
  Context, Delete, Get, HttpResponseCreated,
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

  @Get()
  @ApiOperationSummary('Find products.')
  @ApiOperationDescription(
    'The query parameters "skip" and "take" can be used for pagination. The first ' +
    'is the offset and the second is the number of elements to be returned.'
  )
  @ApiResponse(400, { description: 'Invalid query parameters.' })
  @ApiResponse(200, { description: 'Returns a list of products.' })
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

  @Get('/:productId')
  @ApiOperationSummary('Find a product by ID.')
  @ApiResponse(404, { description: 'Product not found.' })
  @ApiResponse(200, { description: 'Returns the product.' })
  @ValidateParams({ properties: { productId: { type: 'number' } }, type: 'object' })
  async getById(ctx: Context) {
    const product = await getRepository(Product).findOne(ctx.request.params.productId);

    if (!product) {
      return new HttpResponseNotFound();
    }

    return new HttpResponseOK(product);
  }

  @Post()
  @ApiOperationSummary('Create a new product.')
  @ApiResponse(400, { description: 'Invalid product.' })
  @ApiResponse(201, { description: 'Product successfully created. Returns the product.' })
  @ValidateBody(productSchema)
  async post(ctx: Context) {
    const product = await getRepository(Product).save(ctx.request.body);
    return new HttpResponseCreated(product);
  }

  @Patch('/:productId')
  @ApiOperationSummary('Update/modify an existing product.')
  @ApiResponse(400, { description: 'Invalid product.' })
  @ApiResponse(404, { description: 'Product not found.' })
  @ApiResponse(200, { description: 'Product successfully updated. Returns the product.' })
  @ValidateParams({ properties: { productId: { type: 'number' } }, type: 'object' })
  @ValidateBody({ ...productSchema, required: [] })
  async patchById(ctx: Context) {
    const product = await getRepository(Product).findOne(ctx.request.params.productId);

    if (!product) {
      return new HttpResponseNotFound();
    }

    Object.assign(product, ctx.request.body);

    await getRepository(Product).save(product);

    return new HttpResponseOK(product);
  }

  @Put('/:productId')
  @ApiOperationSummary('Update/replace an existing product.')
  @ApiResponse(400, { description: 'Invalid product.' })
  @ApiResponse(404, { description: 'Product not found.' })
  @ApiResponse(200, { description: 'Product successfully updated. Returns the product.' })
  @ValidateParams({ properties: { productId: { type: 'number' } }, type: 'object' })
  @ValidateBody(productSchema)
  async putById(ctx: Context) {
    const product = await getRepository(Product).findOne(ctx.request.params.productId);

    if (!product) {
      return new HttpResponseNotFound();
    }

    Object.assign(product, ctx.request.body);

    await getRepository(Product).save(product);

    return new HttpResponseOK(product);
  }

  @Delete('/:productId')
  @ApiOperationSummary('Delete a product.')
  @ApiResponse(404, { description: 'Product not found.' })
  @ApiResponse(204, { description: 'Product successfully deleted.' })
  @ValidateParams({ properties: { productId: { type: 'number' } }, type: 'object' })
  async deleteById(ctx: Context) {
    const product = await getRepository(Product).findOne(ctx.request.params.productId);

    if (!product) {
      return new HttpResponseNotFound();
    }

    await getRepository(Product).delete(ctx.request.params.productId);

    return new HttpResponseNoContent();
  }

}
