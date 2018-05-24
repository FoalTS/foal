import {
  AbstractUser,
  parsePassword
} from '@foal/authentication';
import { Service } from '@foal/core';
import { Entity } from 'typeorm';

@Entity()
export class User extends AbstractUser {}
