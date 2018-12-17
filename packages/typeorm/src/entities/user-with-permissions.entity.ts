// 3p
import { JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

// FoalTS
import { Group } from './group.entity';
import { Permission } from './permission.entity';

export abstract class UserWithPermissions {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(type => Group)
  @JoinTable()
  groups: Group[];

  @ManyToMany(type => Permission)
  @JoinTable()
  userPermissions: Permission[];

  hasPerm(codeName: string): boolean {
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
