// 3p
import { BaseEntity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

// FoalTS
import { Group } from './group.entity';
import { Permission } from './permission.entity';

/**
 * Abstract class to define a user entity with a system of groups and permissions.
 *
 * A group can have permissions.
 * A user can have permissions and belong to groups that have also permissions.
 *
 * @export
 * @abstract
 * @class UserWithPermissions
 */
export abstract class UserWithPermissions extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(type => Group)
  @JoinTable()
  groups: Group[];

  @ManyToMany(type => Permission)
  @JoinTable()
  userPermissions: Permission[];

  /**
   * Check if a user has a given permission. The user must have been retreived from the db
   * with their groups and permissions. Otherwise, the method will always return false.
   *
   * @param {string} codeName - Name of the permission.
   * @returns {boolean} True if the user has the permission. False otherwise.
   * @memberof UserWithPermissions
   */
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
