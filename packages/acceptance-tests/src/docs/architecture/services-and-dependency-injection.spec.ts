// std
import { deepStrictEqual } from 'assert';

// 3p
import * as request from 'supertest';
import { Connection, createConnection, Entity, getConnection, PrimaryGeneratedColumn, Repository } from 'typeorm';

// FoalTS
import { controller, createApp, dependency, Dependency, Get, HttpResponseOK, ServiceManager } from '@foal/core';

describe('[Docs] Architecture > Services', () => {

  @Entity()
  class Product {
    @PrimaryGeneratedColumn()
    id: number;
  }

  afterEach(() => getConnection().close());

  it('Injecting other Instances', async () => {
    class ApiController {

      @dependency
      connection: Connection;

      @Get('/products')
      async readProducts() {
        const products = await this.connection.getRepository(Product).find();
        return new HttpResponseOK(products);
      }

    }

    class AppController {
      subControllers = [
        controller('/api', ApiController)
      ];
    }

    async function main() {
      const connection = await createConnection({
        database: 'test_db.sqlite',
        dropSchema: true,
        entities: [ Product ],
        synchronize: true,
        type: 'sqlite',
      });

      const serviceManager = new ServiceManager();
      serviceManager.set(Connection, connection);

      const app = await createApp(AppController, {
        serviceManager
      });

      return app;
    }

    return request(await main())
      .get('/api/products')
      .expect(200)
      .expect([]);
  });

  it('Usage with Interfaces and Generic Classes', async () => {
    interface ILogger {
      log(message: any): void;
    }

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

    class AppController {
      subControllers = [
        controller('/api', ApiController)
      ];
    }

    let msg: any = null;
    class ConsoleLogger implements ILogger {
      log(message: any): void {
        msg = message;
      }
    }

    async function main() {
      const connection = await createConnection({
        database: 'test_db.sqlite',
        dropSchema: true,
        entities: [ Product ],
        synchronize: true,
        type: 'sqlite',
      });
      const productRepository = connection.getRepository(Product);

      const serviceManager = new ServiceManager()
        .set('product', productRepository)
        .set('logger', new ConsoleLogger());

      const app = await createApp(AppController, {
        serviceManager
      });

      return app;
    }

    await request(await main())
      .get('/api/products')
      .expect(200)
      .expect([]);

    deepStrictEqual(msg, []);
  });

});
