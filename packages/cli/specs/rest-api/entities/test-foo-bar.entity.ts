import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TestFooBar extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

}
