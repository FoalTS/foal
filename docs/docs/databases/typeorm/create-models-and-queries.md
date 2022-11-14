---
title: Models & Queries
---


```shell
foal generate entity my-entity
```

## Entities

Simple models are called *entities* in TypeORM. You can generate one with the above command.

*Example:*
```typescript
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product extends BaseEntity {

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

### Using Entities

```typescript
const product = new Product();
product.name = 'chair';
product.price = 60;
await product.save();

const products = await Product.find();
// find by id:
const firstProduct = await Product.findOneBy({ id: 1 });
const chair = await Product.findOneBy({ name: 'chair' });

await chair.remove();
```

## Queries

```typescript
const firstProduct = await Product
  .createQueryBuilder('product')
  .where('product.id = :id', { id: 1 })
  .getOne();
```
