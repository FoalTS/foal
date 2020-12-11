---
title: Create Models & Queries
---

```shell
foal generate entity my-entity
```

## Entities

Simple models are called *entities* in TypeORM. You can generate one with the above command.

*Example:*
```typescript
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  price: number;

}

```

The class `Product` represents the database table and its instances represent the table rows.

> In FoalTS, entity files should always be named with the extension `.entity.ts`. This way the CLI can find the entities when automatically generating migrations.

## Using Entities

```typescript
import { getRepository } from 'typeorm';

const repository = getRepository(Product);

const product = new Product();
product.name = 'chair';
product.price = 60;
await repository.save(product);

const products = await repository.find();
// find by id:
const firstProduct = await repository.findOne(1);
const chair = await repository.findOne({ name: 'chair' });

await repository.remove(chair);
```

## Queries

```typescript
import { getRepository } from 'typeorm';

const firstProduct = await getRepository(Product)
  .createQueryBuilder('product')
  .where('product.id = :id', { id: 1 })
  .getOne();
```
