import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from '@foal/typeorm/node_modules/typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;
}
