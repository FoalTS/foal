// 3p
import * as request from 'supertest';
import { Connection, createConnection, Entity, getConnection, PrimaryGeneratedColumn } from 'typeorm';

// FoalTS
import { controller, createApp, dependency, Get, HttpResponseOK, ServiceManager } from '@foal/core';

describe('[Docs] Architecture > Services', () => {

  it('Injecting other Instances', async () => {
    @Entity()
    class Product {
      @PrimaryGeneratedColumn()
      id: number;
    }

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

      const app = createApp(AppController, {
        serviceManager
      });

      return app;
    }

    return request(await main())
      .get('/api/products')
      .expect(200)
      .expect([]);
  });

  afterEach(() => getConnection().close());

});
