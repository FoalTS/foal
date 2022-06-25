// 3p
import * as request from 'supertest';
import { BaseEntity, Column, DataSource, Entity, PrimaryGeneratedColumn } from 'typeorm';

// FoalTS
import { Context, HttpResponseCreated, Post } from '@foal/core';
import { ValidateBody } from '@foal/typestack';
import { IsNumber, IsString } from '@foal/typestack/node_modules/class-validator';
import { createAppAndSetUpDB } from '../common';

describe('ValidateBody hook', () => {

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

  let dataSource: DataSource;
  let app: any;

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

    ({ app, dataSource} = await createAppAndSetUpDB(AppController, [ Product ]));

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
