import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entity/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MobilesModule } from './mobiles/mobiles.module';
import { Mobile } from './mobiles/mobiles.entity';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'sqlite',
          database: config.get<string>('DB_NAME'),
          synchronize: true,
          entities: [join(__dirname, '**', '*.entity.{ts,js}')],
        };
      },
    }),
    UsersModule,
    AuthModule,
    MobilesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
