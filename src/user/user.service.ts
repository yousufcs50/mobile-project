import { Injectable, BadRequestException } from '@nestjs/common';
import { User } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { toUserDto } from './touserdto';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { UserDto } from './dtos/User.dto';
import { LoginUserDto } from './dtos/login.dto';
const bcrypt = require('bcrypt');

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async findOne(options?: object) {
    const user = await this.userRepo.findOne(options);
    return toUserDto(user) || 0;
  } 

  async findByLogin({ username, password }: LoginUserDto) {
    const user = await this.userRepo.findOne({ where: { username } });

    // compare passwords
    try {
      const areEqual = await bcrypt.compare(password, user.password);
    } catch (err) {
      return 0;
    }

    return toUserDto(user);
  }

  async findByPayload({ username }: any) {
    return await this.findOne({
      where: { username },
    });
  }

  async create(userDto: CreateUserDto): Promise<UserDto> {
    let { username, password, email } = userDto;
    const userInDb = await this.userRepo.findOne({
      where: { username: username },
    });
    if (password.length < 8) {
      throw new BadRequestException('Password too short');
    }
    if (userInDb) {
      throw new BadRequestException('User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    // now we set user password to hashed password
    password = await bcrypt.hash(password, salt);

    // check if the user exists in the db
    const user = this.userRepo.create({ username, password, email });
    try {
      await this.userRepo.save(user);
    } catch (err) {
      //throw error
      console.log('err', err);
    }
    return toUserDto(user);
  }
}
