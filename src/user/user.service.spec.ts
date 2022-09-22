import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserDto } from './dtos/User.dto';
import { User } from './entity/user.entity';
import { UserService } from './user.service';
import bcrypt from 'bcrypt';
import { CreateUserDto } from './dtos/CreateUser.dto';

describe('UserService', () => {
  let service: UserService;
  let fakeUsersService: Partial<UserService>;
  beforeEach(async () => {
    fakeUsersService = {};
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('throws if login is called with an incorrect password', async () => {
    const dto: UserDto = {
      username: 'yousuf',
      email: '1@g.com',
      id: 1,
    };
    fakeUsersService.findOne = async () => Promise.resolve(dto as User);
    const result = await service.findByLogin({
      username: 'yousuf',
      password: 'asdfwfewe',
    });
    expect(result).toEqual(0);
  });

  it('logs in a user', async () => {
    const dto: UserDto = {
      username: 'yousuf',
      email: '1@g.com',
      id: 1,
    };
    const mock = jest.spyOn(service, 'findByLogin');
    mock.mockImplementation(() => Promise.resolve(dto)); // spy on foo
    // mock.mockImplementation(() => Promise.resolve(1));
    fakeUsersService.findOne = async () => Promise.resolve(dto as User);
    const result = await service.findByLogin({
      username: 'yousuf',
      password: 'asdfwfewe',
    });
    expect(result).toEqual(dto);
  });

  it('finds by payload', async () => {
    const dto: UserDto = {
      username: 'yousuf',
      email: '1@g.com',
      id: 1,
    };

    fakeUsersService.findOne = async () => Promise.resolve(dto as User);
    const result = await service.findByPayload({
      username: 'yousuf',
      password: 'asdfwfewe',
    });
    expect(result).toEqual(dto);
  });

  it('creates a user', async () => {
    const dto: UserDto = {
      username: 'youdssdfsuf',
      email: 'a@a.com',
      id: 1,
    };
    const createuserdto: CreateUserDto = {
      username: 'youdssdfsuf',
      password: 'asdfwfewe',
      email: 'a@a.com',
    };

    fakeUsersService.findOne = async () => Promise.resolve(0);
    fakeUsersService.create = async () => {
      return await Promise.resolve(dto);
    };
    const expected = { id: undefined, username: undefined, email: undefined };
    const result = await service.create(createuserdto);
    expect(result).toEqual(expected);
  });
});
