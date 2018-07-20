// 3p
import { BaseEntity, Column, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

// FoalTS
import { Group } from './group.entity';
import { Permission } from './permission.entity';

export abstract class AbstractUser extends BaseEntity {

  @PrimaryGeneratedColumn()
  // @ts-ignore : Property 'id' has no initializer and is not definitely assigned in theconstructor.
  id: number;

  @Column('simple-array')
  // @ts-ignore : Property 'permissions' has no initializer and is not definitely assigned in theconstructor.
  permissions: string[];

  @ManyToMany(type => Group)
  @JoinTable()
  // @ts-ignore : Property 'groups' has no initializer and is not definitely assigned in theconstructor.
  groups: Group[];

  @ManyToMany(type => Permission)
  @JoinTable()
  // @ts-ignore : Property 'userPermissions' has no initializer and is not definitely assigned in theconstructor.
  userPermissions: Permission[];

  @Column({ default: false })
  // @ts-ignore : Property 'isSuperUser' has no initializer and is not definitely assigned in theconstructor.
  isSuperUser: boolean;

  getGroupPermissions(): string[] {
    // SELECT permission.codeName from Permission
    // Where (permission.id = permGroup.permId AND permGroup.groupID = userGroup.groupId AND userGroup.userId = :id)
    //  OR (permission.id = permUser.permId AND permUser.userId = :id)
    // const user = await AbstractUser.createQueryBuilder('user')
    //   .innerJoin('user.groups', 'group')
    //   .innerJoin('group.permissions', 'permission')
    //   .where('user.id = :id', { id: 1 })
    //   .getOne();
    // return user.permissions;
    return [];
  }

  getAllPermissions(): string[] {
    return this.permissions;
  }

  hasPerm(perm: string): boolean {
    return this.getAllPermissions().includes(perm);
  }

}
