import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/**
 * Entity representing a permission.
 *
 * @export
 * @class Permission
 */
@Entity()
export class Permission extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ length: 100, unique: true })
  codeName: string;

}
