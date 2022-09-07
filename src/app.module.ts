import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entity/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MobilesModule } from './mobiles/mobiles.module';


@Module({
  imports: [    ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: `.env.${process.env.NODE_ENV}`,
  }),TypeOrmModule.forRoot({
      type: 'sqlite',
    database: 'db.sqlite',
     entities: [User],
      synchronize: true,
     }),
    UsersModule, AuthModule, MobilesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
