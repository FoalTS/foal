// std
import { deepStrictEqual } from 'assert';

// 3p
import * as request from 'supertest';

// FoalTS
import { controller, createApp, Dependency, Get, HttpResponseOK, IAppController, ServiceManager } from '@foal/core';
import { Entity, DataSource, PrimaryGeneratedColumn, Repository } from 'typeorm';
import { createAndInitializeDataSource } from '../../../common';

describe('Feature: Using interfaces and generic classes for services', () => {

  let dataSource: DataSource;

  afterEach(async () => {
    if (dataSource) {
      await dataSource.destroy();
    }
  });

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
      dataSource = await createAndInitializeDataSource([ Product ]);
      const productRepository = dataSource.getRepository(Product);

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
