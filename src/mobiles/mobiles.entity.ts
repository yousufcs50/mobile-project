import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  ManyToMany,
  JoinTable,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Category } from './category.entity';

@Entity()
export class Mobile {
  @PrimaryGeneratedColumn()
  mobile_id: number;

  @Column()
  is_private: boolean;

  @Column({ unique: true })
  title: string;

  @Column()
  text_context: string;

  @ManyToMany(() => Category, { cascade: ['insert'] })
  @JoinTable()
  categories: Category[];
}
