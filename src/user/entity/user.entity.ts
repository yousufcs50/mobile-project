
import {
    AfterInsert,
    AfterRemove,
    AfterUpdate,
    Entity,
    Column,
    BeforeInsert,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  import {bcrypt} from 'bcrypt'

  @Entity()
  export class User {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;
  
    @Column()
    password: string;

    @Column()
    email: string;


  
    @AfterInsert()
    logInsert() {
      console.log('Inserted User with id', this.id);
    }
  
    @AfterUpdate()
    logUpdate() {
      console.log('Updated User with id', this.id);
    }
  
    @AfterRemove()
    logRemove() {
      console.log('Removed User with id', this.id);
    }
  }
  