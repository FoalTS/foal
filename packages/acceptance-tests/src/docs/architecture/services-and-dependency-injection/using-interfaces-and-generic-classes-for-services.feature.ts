// std
import { deepStrictEqual } from 'assert';

// 3p
import * as request from 'supertest';

// FoalTS
import { controller, createApp, Dependency, Get, HttpResponseOK, IAppController, ServiceManager } from '@foal/core';
import { Entity, getConnection, PrimaryGeneratedColumn, Repository } from '@foal/typeorm/node_modules/typeorm';
import { createTestConnection } from '../../../common';

describe('Feature: Using interfaces and generic classes for services', () => {

  afterEach(() => getConnection().close());

  it('Example: A logger interface and a TypeORM repository', async () => {

    @Entity()
    class Product {
      @PrimaryGeneratedColumn()
      id: number;
    }

    let msg: any = 'not called';

    /* ======================= DOCUMENTATION BEGIN ======================= */

    class ApiController {

      @Dependency('product')
      productRepository: Repository<Product>;

      @Dependency('logger')
      logger: ILogger;

      @Get('/products')
      async readProducts() {
        const products = await this.productRepository.find();
        this.logger.log(products);
        return new HttpResponseOK(products);
      }

    }

    /* ======================= DOCUMENTATION END ========================= */

    class AppController implements IAppController {
      subControllers = [
        controller('/api', ApiController),
      ];
    }

    /* ======================= DOCUMENTATION BEGIN ======================= */

    interface ILogger {
      log(message: any): void;
    }

    class ConsoleLogger implements ILogger {
      log(message: any): void {
        msg = message;
      }
    }

    async function main() {
      const connection = await createTestConnection([ Product ]);
      const productRepository = connection.getRepository(Product);

      const serviceManager = new ServiceManager()
        .set('product', productRepository)
        .set('logger', new ConsoleLogger());

      return await createApp(AppController, {
        serviceManager
      });
    }

    /* ======================= DOCUMENTATION END ========================= */

    const app = await main();

    await request(app)
      .get('/api/products')
      .expect(200)
      .expect([]);

    deepStrictEqual(msg, []);
  });

});
