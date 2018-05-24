import { BaseEntity, Column, PrimaryGeneratedColumn } from 'typeorm';

export abstract class AbstractUser extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  isAdmin: boolean;

}
