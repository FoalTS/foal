// 3p
import { IUserWithPermissions } from '@foal/core';
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
export abstract class UserWithPermissions extends BaseEntity implements IUserWithPermissions {

  /**
   * Get all users with a given permission.
   *
   * This method returns all users that have this permission on their own or through the groups they belong to.
   *
   * @static
   * @template T
   * @param {string} codeName - The permission codename.
   * @returns {Promise<T[]>}
   * @memberof UserWithPermissions
   */
  static async withPerm<T extends UserWithPermissions>(this: (new () => T) & typeof UserWithPermissions, codeName: string): Promise<T[]> {
    const userWithUserPermissionsQb = this
      .createQueryBuilder<T>('user1')
      .select('user1.id')
      .innerJoin('user1.userPermissions', 'userPermission')
      .where('userPermission.codeName = :codeName');

    const userWithGroupPermissionsQb = this
      .createQueryBuilder<T>('user2')
      .select('user2.id')
      .innerJoin('user2.groups', 'group')
      .innerJoin('group.permissions', 'groupPermission')
      .where('groupPermission.codeName = :codeName');

    return await this
      .createQueryBuilder<T>('user')
      .where('user.id IN (' + userWithUserPermissionsQb.getQuery() + ')')
      .orWhere('user.id IN (' + userWithGroupPermissionsQb.getQuery() + ')')
      .setParameters({ codeName })
      .getMany();
  }

  static async findOneWithPermissionsBy<T extends UserWithPermissions>(this: (new () => T) & typeof UserWithPermissions, { id }: { id: number }): Promise<T|null> {
    return (await this
      .getRepository<UserWithPermissions>()
      .findOne(
        {
          where: { id },
          relations: {
            userPermissions: true,
            groups: {
              permissions: true,
            }
          }
        }
      )) as T|null;
  }

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
