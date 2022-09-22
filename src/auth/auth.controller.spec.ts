import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './locat.strategy';
import { User } from '../user/entity/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from '../user/dtos/CreateUser.dto';
import { JwtService } from '@nestjs/jwt';
import { NotFoundException } from '@nestjs/common';
import { async } from 'rxjs';
import { RegistrationStatus } from './RegistrationStatus';
import { LoginUserDto } from 'src/user/dtos/login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let fakeUsersService: Partial<UserService>;
  let authService: Partial<AuthService>;

  beforeEach(async () => {
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
    authService = {
      register: () => {
        return Promise.resolve({
          success: true,
          message: 'user registered',
        });
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        UserService,
        JwtService,
        LocalStrategy,
        {
          provide: getRepositoryToken(User),
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('register user ', async () => {
    const dto: CreateUserDto = {
      username: 'sdfs',
      email: 'm@m.com',
      password: 'sfnuweweifnw',
    };

    const result = await controller.register(dto);
    const expected = new NotFoundException('unable to add user');
    jest.clearAllMocks();
    expect(result).toEqual(expected);
  });

  it('register user ', async () => {
    const dto: CreateUserDto = {
      username: 'sdfs',
      email: 'm@m.com',
      password: 'sfnuweweifnw',
    };
    const status = {
      success: true,
      message: 'user registered',
    };
    const mock = jest.spyOn(controller, 'register');

    mock.mockImplementation(() => Promise.resolve(status));
    const result = await controller.register(dto);
    expect(result).toEqual(status);
    jest.clearAllMocks();
  });

  it('login user ', async () => {
    const dto: LoginUserDto = {
      username: 'sdfs',
      password: 'sfnuweweifnw',
    };
    const status = {
      username: 'yousuf',
      expiresIn: '90s',
      accessToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InlvdXN1ZiIsImlhdCI6MTY2MzU5NjY0M30.jaIHLIhAUdn63xFWILDuIREXrFw_HRZxhVwAn3zSuMI',
    };
    authService.login = async () => {
      Promise.resolve(status);
      const result = await controller.login(dto);
      expect(result).toEqual(status);
    };

    jest.clearAllMocks();
  });
});
