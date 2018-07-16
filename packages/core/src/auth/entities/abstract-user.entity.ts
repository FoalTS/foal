import { BaseEntity, Column, PrimaryGeneratedColumn } from 'typeorm';

export abstract class AbstractUser extends BaseEntity {

  @PrimaryGeneratedColumn()
  // @ts-ignore : Property 'id' has no initializer and is not definitely assigned in theconstructor.
  id: number;

  @Column('simple-array')
  // @ts-ignore : Property 'permissions' has no initializer and is not definitely assigned in theconstructor.
  permissions: string[];

  hasPerm(role: string): boolean {
    return this.permissions.includes(role);
  }

}
