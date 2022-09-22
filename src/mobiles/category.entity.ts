import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  ManyToMany,
  Entity,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  category_id: number;

  @Column({ unique: true })
  category: string;
}
