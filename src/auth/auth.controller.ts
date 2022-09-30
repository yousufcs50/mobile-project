import { AuthService } from './auth.service';
import {
  Controller,
  Body,
  Session,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  UseGuards,
  Request,
  NotFoundException,
  HttpException,
} from '@nestjs/common';
import { CreateUserDto } from '../user/dtos/CreateUser.dto';
import { RegistrationStatus } from './RegistrationStatus';
import { LoginUserDto } from '../user/dtos/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBody,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOkResponse({ description: 'user created' })
  @ApiUnauthorizedResponse({ description: 'unable to add user' })
  public async register(@Body() createUserDto: CreateUserDto) {
    const result: RegistrationStatus = await this.authService.register(
      createUserDto,
    );
    if (!result.success) {
      return new NotFoundException('unable to add user');
    }
    return result;
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiOkResponse({ description: 'User Login' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiBody({ type: LoginUserDto })
  public async login(@Body() loginUserDto: LoginUserDto) {
    return await this.authService.login(loginUserDto);
  }
}