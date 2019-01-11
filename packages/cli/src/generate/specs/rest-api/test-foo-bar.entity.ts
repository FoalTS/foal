import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TestFooBar {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

}
