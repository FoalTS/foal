// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TestFooBar {

  @PrimaryGeneratedColumn()
  id: number;

}
