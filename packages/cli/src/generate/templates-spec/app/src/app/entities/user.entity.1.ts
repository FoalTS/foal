import { AbstractUser } from '@foal/core';
import { Entity } from 'typeorm';

@Entity()
export class User extends AbstractUser {

}
