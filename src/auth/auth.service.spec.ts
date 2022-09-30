import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/entity/user.entity';
import { CreateUserDto } from '../user/dtos/CreateUser.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';
import { LoginUserDto } from '../user/dtos/login.dto';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { doesNotMatch } from 'assert';
import { UserDto } from '../user/dtos/User.dto';
import { toUserDto } from '../user/touserdto';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UserService>;
  beforeEach(async () => {
    // Create a fake copy of the users service
    const users: User[] = [];
    fakeUsersService = {
      create: (userDto: CreateUserDto) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          userDto,
        } as unknown as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: fakeUsersService,
        },
        JwtService,
        UserService,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('throws if login is called with an unused username', async () => {
    const dto: UserDto = {
      username: 'sjfoiwej',
      email: '1@g.com',
      id: 1,
    };
    fakeUsersService.findOne = async () => Promise.resolve(dto as User);
    const result = await service.login({
      username: dto.username,
      password: 'skfngiregr',
    });
    const expectedValue = new BadRequestException('user not found');
    expect(result).toEqual(expectedValue);
  });

  it('throws if login is called with an incorrect password', async () => {
    const dto: UserDto = {
      username: 'yousuf',
      email: '1@g.com',
      id: 1,
    };
    fakeUsersService.findOne = async () => Promise.resolve(dto as User);
    const result = await service.login({
      username: 'yousuf',
      password: 'asdfwfewe',
    });
    const expectedValue = new BadRequestException('user not found');

    expect(result).toEqual(expectedValue);
  });

  it('validates if validateUser is called with a correct username', async () => {
    const dto: UserDto = {
      username: 'yousuf',
      email: '1@g.com',
      id: 1,
    };
    const username = 'ysdfsdf';
    fakeUsersService.findOne = async () => Promise.resolve(dto as User);
    const result = await service.validateUser({ username });
    expect(result).toEqual(dto);
  });

  it('throws an error if username in database', async () => {
    const dto: CreateUserDto = {
      username: 'yousuf',
      password: 'sdfsf23wfjwh',
      email: 'string@rgr.com',
    };

    fakeUsersService.findOne = async () => Promise.resolve(dto as User);
    const result = await service.register(dto);
    const expectedValue = new BadRequestException('User already exists');
    const status = {
      success: false,
      message: expectedValue,
    };
    expect(result).toEqual(status);
  });

  it('throws an error if email in database', async () => {
    const dto: CreateUserDto = {
      username: 'sfgsdf',
      password: 'sdfsf23wfjwh',
      email: 'u@gmail.com',
    };

    fakeUsersService.findOne = async () => Promise.resolve(dto as User);
    const result = await service.register(dto);
    const expectedValue = new BadRequestException('User already exists');
    const status = {
      success: false,
      message: expectedValue,
    };
    expect(result).toEqual(status);
  });
  it('throws an error if passowrd too short ', async () => {
    const dto: CreateUserDto = {
      username: 'sfgsdf',
      password: 'sdf',
      email: 'ued@gmail.com',
    };

    fakeUsersService.findOne = async () => Promise.resolve(dto as User);
    const result = await service.register(dto);
    const expectedValue = new BadRequestException('Password too short');
    const status = {
      success: false,
      message: expectedValue,
    };
    expect(result).toEqual(status);
  });
});
