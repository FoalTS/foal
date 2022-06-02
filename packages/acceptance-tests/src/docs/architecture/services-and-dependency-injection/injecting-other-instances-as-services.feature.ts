// 3p
import * as request from 'supertest';

// FoalTS
import { controller, createApp, dependency, Get, HttpResponseOK, IAppController, ServiceManager } from '@foal/core';
import { Entity, DataSource, PrimaryGeneratedColumn } from '@foal/typeorm/node_modules/typeorm';
import { createTestDataSource } from '../../../common';

describe('Feature: Injecting other instances as services', () => {

  let dataSource: DataSource;

  afterEach(async () => {
    if (dataSource) {
      await dataSource.destroy();
    }
  });

  it('Example: Injection a TypeORM connection', async () => {

    @Entity()
    class Product {
      @PrimaryGeneratedColumn()
      id: number;
    }

    /* ======================= DOCUMENTATION BEGIN ======================= */

    class ApiController {

      @dependency
      dataSource: DataSource;

      @Get('/products')
      async readProducts() {
        const products = await this.dataSource.getRepository(Product).find();
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

    async function main() {
      dataSource = createTestDataSource([ Product ]);
      await dataSource.initialize();

      const serviceManager = new ServiceManager();
      serviceManager.set(DataSource, dataSource);

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
  });

});
