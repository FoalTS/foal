import {
  ApiOperationDescription, ApiOperationId, ApiOperationSummary, ApiResponse,
  ApiUseTag, Context, Delete, Get, HttpResponseCreated,
  HttpResponseNoContent, HttpResponseNotFound, HttpResponseOK, Patch, Post,
  Put, ValidateBody, ValidatePathParam, ValidateQueryParam
} from '@foal/core';
import { getRepository } from '@foal/typeorm/node_modules/typeorm';

import { Product } from './product.entity';

const productSchema = {
  additionalProperties: false,
  properties: {
    text: { type: 'string', maxLength: 255 },
  },
  required: [ 'text' ],
  type: 'object',
};

@ApiUseTag('product')
export class ProductController {

  @Get()
  @ApiOperationId('findProducts')
  @ApiOperationSummary('Find products.')
  @ApiOperationDescription(
    'The query parameters "skip" and "take" can be used for pagination. The first ' +
    'is the offset and the second is the number of elements to be returned.'
  )
  @ApiResponse(400, { description: 'Invalid query parameters.' })
  @ApiResponse(200, { description: 'Returns a list of products.' })
  @ValidateQueryParam('skip', { type: 'number' }, { required: false })
  @ValidateQueryParam('take', { type: 'number' }, { required: false })
  async findProducts(ctx: Context) {
    const products = await getRepository(Product).find({
      skip: ctx.request.query.skip,
      take: ctx.request.query.take,
      where: {},
    });
    return new HttpResponseOK(products);
  }

  @Get('/:productId')
  @ApiOperationId('findProductById')
  @ApiOperationSummary('Find a product by ID.')
  @ApiResponse(404, { description: 'Product not found.' })
  @ApiResponse(200, { description: 'Returns the product.' })
  @ValidatePathParam('productId', { type: 'number' })
  async findProductById(ctx: Context) {
    const product = await getRepository(Product).findOne(ctx.request.params.productId);

    if (!product) {
      return new HttpResponseNotFound();
    }

    return new HttpResponseOK(product);
  }

  @Post()
  @ApiOperationId('createProduct')
  @ApiOperationSummary('Create a new product.')
  @ApiResponse(400, { description: 'Invalid product.' })
  @ApiResponse(201, { description: 'Product successfully created. Returns the product.' })
  @ValidateBody(productSchema)
  async createProduct(ctx: Context) {
    const product = await getRepository(Product).save(ctx.request.body);
    return new HttpResponseCreated(product);
  }

  @Patch('/:productId')
  @ApiOperationId('modifyProduct')
  @ApiOperationSummary('Update/modify an existing product.')
  @ApiResponse(400, { description: 'Invalid product.' })
  @ApiResponse(404, { description: 'Product not found.' })
  @ApiResponse(200, { description: 'Product successfully updated. Returns the product.' })
  @ValidatePathParam('productId', { type: 'number' })
  @ValidateBody({ ...productSchema, required: [] })
  async modifyProduct(ctx: Context) {
    const product = await getRepository(Product).findOne(ctx.request.params.productId);

    if (!product) {
      return new HttpResponseNotFound();
    }

    Object.assign(product, ctx.request.body);

    await getRepository(Product).save(product);

    return new HttpResponseOK(product);
  }

  @Put('/:productId')
  @ApiOperationId('replaceProduct')
  @ApiOperationSummary('Update/replace an existing product.')
  @ApiResponse(400, { description: 'Invalid product.' })
  @ApiResponse(404, { description: 'Product not found.' })
  @ApiResponse(200, { description: 'Product successfully updated. Returns the product.' })
  @ValidatePathParam('productId', { type: 'number' })
  @ValidateBody(productSchema)
  async replaceProduct(ctx: Context) {
    const product = await getRepository(Product).findOne(ctx.request.params.productId);

    if (!product) {
      return new HttpResponseNotFound();
    }

    Object.assign(product, ctx.request.body);

    await getRepository(Product).save(product);

    return new HttpResponseOK(product);
  }

  @Delete('/:productId')
  @ApiOperationId('deleteProduct')
  @ApiOperationSummary('Delete a product.')
  @ApiResponse(404, { description: 'Product not found.' })
  @ApiResponse(204, { description: 'Product successfully deleted.' })
  @ValidatePathParam('productId', { type: 'number' })
  async deleteProduct(ctx: Context) {
    const product = await getRepository(Product).findOne(ctx.request.params.productId);

    if (!product) {
      return new HttpResponseNotFound();
    }

    await getRepository(Product).delete(ctx.request.params.productId);

    return new HttpResponseNoContent();
  }

}
