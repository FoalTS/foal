// 3p
import { BaseEntity, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

// FoalTS
import { Permission } from './permission.entity';

/**
 * Entity representing a group. A group can have permissions.
 *
 * @export
 * @class Group
 */
@Entity()
export class Group extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 80 })
  name: string;

  @Column({ length: 100, unique: true })
  codeName: string;

  @ManyToMany(type => Permission)
  @JoinTable()
  permissions: Permission[];

}
