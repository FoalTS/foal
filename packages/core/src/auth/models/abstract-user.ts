import { BaseEntity, Column, PrimaryGeneratedColumn } from 'typeorm';

export abstract class AbstractUser extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column('simple-array')
  roles: string[];

  hasRole(role: string): boolean {
    return this.roles.includes(role);
  }

}
