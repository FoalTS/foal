import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class /* upperFirstCamelName */ extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

}
