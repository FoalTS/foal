// 3p
import { Column, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

// FoalTS
import { Group } from './group.entity';
import { Permission } from './permission.entity';

export abstract class AbstractUser {

  @PrimaryGeneratedColumn()
  // @ts-ignore : Property 'id' has no initializer and is not definitely assigned in theconstructor.
  id: number;

  // TODO: remove this
  permissions: string[] = [];

  @ManyToMany(type => Group)
  @JoinTable()
  // @ts-ignore : Property 'groups' has no initializer and is not definitely assigned in theconstructor.
  groups: Group[];

  @ManyToMany(type => Permission)
  @JoinTable()
  // @ts-ignore : Property 'userPermissions' has no initializer and is not definitely assigned in theconstructor.
  userPermissions: Permission[];

  hasPerm(codeName: string): boolean {
    // return this.permissions.includes(codeName);
    for (const permission of this.userPermissions || []) {
      if (permission.codeName === codeName) {
        return true;
      }
    }
    for (const group of this.groups || []) {
      for (const permission of group.permissions || []) {
        if (permission.codeName === codeName) {
          return true;
        }
      }
    }
    return false;
  }

}
