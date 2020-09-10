// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TestFooBar extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

}
