import { Module } from '@nestjs/common';
import { MobilesService } from './mobiles.service';
import { MobilesController } from './mobiles.controller';
import { Mobile } from './mobiles.entity';
import { Category } from './category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryService } from './category.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { LocalStrategy } from 'src/auth/locat.strategy';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';
import { UsersModule } from 'src/user/user.module';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    TypeOrmModule.forFeature([Mobile, Category]),
    UsersModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: false,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: process.env.KEY,
        expiresIn: '90s',
      }),
    }),
  ],
  providers: [MobilesService, CategoryService, JwtStrategy, AuthService],
  controllers: [MobilesController],
})
export class MobilesModule {}
