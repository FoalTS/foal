// 3p
import * as request from 'supertest';
import { BaseEntity, Column, Entity, DataSource, PrimaryGeneratedColumn } from 'typeorm';

// FoalTS
import { Context, createApp, HttpResponseCreated, Post } from '@foal/core';
import { ValidateBody } from '@foal/typestack';
import { IsNumber, IsString } from 'class-validator';
import { createAndInitializeDataSource } from '../common';

describe('ValidateBody hook', () => {

  let dataSource: DataSource;

  @Entity()
  class Product extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsString()
    name: string;

    @Column()
    @IsNumber()
    price: number;
  }

  before(async () => {
    dataSource = await createAndInitializeDataSource([ Product ]);
  });

  after(async () => {
    if (dataSource) {
      await dataSource.destroy();
    }
  });

  it('should unserialize and validate HTTP request bodies', async () => {
    class AppController {
      @Post('/products')
      @ValidateBody(Product)
      async createProduct(ctx: Context) {
        const product = ctx.request.body as Product;
        await product.save();
        return new HttpResponseCreated(product);
      }
    }

    const app = await createApp(AppController);

    await request(app)
      .post('/products')
      .send({})
      .expect(400)
      .expect([
        {
          children: [],
          constraints: { isString: 'name must be a string' },
          property: 'name',
          target: {},
        },
        {
          children: [],
          constraints: { isNumber: 'price must be a number conforming to the specified constraints' },
          property: 'price',
          target: {},
        }
      ]);
  });
});
