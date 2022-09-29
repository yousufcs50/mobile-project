import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as supertest from 'supertest';
import { AppModule } from './../src/app.module';
import { CreateUserDto } from '../src/user/dtos/CreateUser.dto';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../src/user/user.module';
import { AuthModule } from '../src/auth/auth.module';
import { join } from 'path';
import { User } from '../src/user/entity/user.entity';
import { Mobile } from '../src/mobiles/mobiles.entity';
import { Category } from '../src/mobiles/category.entity';
import { LoginUserDto } from '../src/user/dtos/login.dto';
import { MobilesModule } from '../src/mobiles/mobiles.module';
import { Repository } from 'typeorm';

const num = Math.random() * 9898989;
const mail = num + '@m.com';
const dto: CreateUserDto = {
  username: num.toString(),
  email: mail,
  password: 'sfnuweweifnw',
};
describe('AppController (e2e)', () => {
  let request;
  let app: INestApplication;
  let moduleFixture;
  let repository: Repository<Category>;

  beforeEach(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          synchronize: true,
          dropSchema: true,
          entities: [User, Mobile, Category],
        }),
        UsersModule,
        AuthModule,
        MobilesModule,
        Category,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    request = supertest.agent(app.getHttpServer());
    repository = moduleFixture.get('CategoryRepository');
  });
  afterEach(async () => {
    // await cat.query(`DELETE FROM Category;`);
    await moduleFixture.close();
  });

  it('handles a signup request', async () => {
    const res = await request.post('/auth/register ').send(dto).expect(201);
    const expected = { success: true, message: 'user registered' };
    expect(res.body).toEqual(expected);
  });

  it('login', async () => {
    const res = await request.post('/auth/register').send(dto).expect(201);

    const logindto: LoginUserDto = {
      username: dto.username,
      password: dto.password,
    };

    const request2 = await request
      .post('/auth/login')
      .set('Content-Type', 'application/json')
      .send(logindto)
      .expect(201);
  });

  it('doesnt login', async () => {
    const res = await request.post('/auth/register').send(dto).expect(201);

    const logindto: LoginUserDto = {
      username: 'sdfsdfdsdf',
      password: '8888888888',
    };

    const request2 = await request
      .post('/auth/login')
      .set('Content-Type', 'application/json')
      .send(logindto)
      .expect(400);
  });

  it('creates a mobile', async () => {
    const user_dto: CreateUserDto = {
      username: 'yousuf',
      email: mail,
      password: 'sfnuweweifnw',
    };
    const res = await request.post('/auth/register').send(user_dto).expect(201);

    const logindto: LoginUserDto = {
      username: 'yousuf',
      password: 'sfnuweweifnw',
    };

    const request2 = await request
      .post('/auth/login')
      .send(logindto)
      .expect(201);

    const token = 'Bearer ' + request2.body.accessToken;
    const mobile = {
      is_private: false,
      title: 'sdfsfd pro MAX',
      text_context: '2cameras 12mp',
      category: ['A', 'B'],
    };

    await repository.save([{ category: 'A' }, { category: 'B' }]);
    const request3 = await request
      .post('/mobiles/createitem')
      .set('Content-Type', 'application/json')
      .set('Authorization', token)
      .send(mobile)
      .expect(201);
  });

  it('deletes a mobile', async () => {
    const user_dto: CreateUserDto = {
      username: 'yousuf',
      email: mail,
      password: 'sfnuweweifnw',
    };
    const res = await request.post('/auth/register').send(user_dto).expect(201);

    const logindto: LoginUserDto = {
      username: 'yousuf',
      password: 'sfnuweweifnw',
    };

    const request2 = await request
      .post('/auth/login')
      .send(logindto)
      .expect(201);

    const token = 'Bearer ' + request2.body.accessToken;
    const mobile = {
      is_private: false,
      title: 'sdfsfd pro MAX',
      text_context: '2cameras 12mp',
      category: ['A', 'B'],
    };

    await repository.save([{ category: 'A' }, { category: 'B' }]);
    const request3 = await request
      .post('/mobiles/createitem')
      .set('Content-Type', 'application/json')
      .set('Authorization', token)
      .send(mobile)
      .expect(201);

    const title = { title: mobile.title };
    const request4 = await request
      .delete('/mobiles/deletelisting')
      .set('Content-Type', 'application/json')
      .set('Authorization', token)
      .send(title)
      .expect(200);
  });

  it('doesnt delete a mobile that doesnot exist', async () => {
    const user_dto: CreateUserDto = {
      username: 'yousuf',
      email: mail,
      password: 'sfnuweweifnw',
    };
    const res = await request.post('/auth/register').send(user_dto).expect(201);

    const logindto: LoginUserDto = {
      username: 'yousuf',
      password: 'sfnuweweifnw',
    };

    const request2 = await request
      .post('/auth/login')
      .send(logindto)
      .expect(201);

    const token = 'Bearer ' + request2.body.accessToken;
    const mobile = {
      is_private: false,
      title: 'sdfsfd pro MAX',
      text_context: '2cameras 12mp',
      category: ['A', 'B'],
    };

    await repository.save([{ category: 'A' }, { category: 'B' }]);
    const request3 = await request
      .post('/mobiles/createitem')
      .set('Content-Type', 'application/json')
      .set('Authorization', token)
      .send(mobile)
      .expect(201);

    const title = { title: 'asfgwsdfndwi' };
    const request4 = await request
      .delete('/mobiles/deletelisting')
      .set('Content-Type', 'application/json')
      .set('Authorization', token)
      .send(title)
      .expect(404);
  });

  it('shows a private mobile', async () => {
    const user_dto: CreateUserDto = {
      username: 'yousuf',
      email: mail,
      password: 'sfnuweweifnw',
    };
    const res = await request.post('/auth/register').send(user_dto).expect(201);

    const logindto: LoginUserDto = {
      username: 'yousuf',
      password: 'sfnuweweifnw',
    };

    const request2 = await request
      .post('/auth/login')
      .send(logindto)
      .expect(201);

    const token = 'Bearer ' + request2.body.accessToken;
    const mobile = {
      is_private: true,
      title: 'sdfsfd pro MAX',
      text_context: '2cameras 12mp',
      category: ['A', 'B'],
    };

    await repository.save([{ category: 'A' }, { category: 'B' }]);
    const request3 = await request
      .post('/mobiles/createitem')
      .set('Content-Type', 'application/json')
      .set('Authorization', token)
      .send(mobile)
      .expect(201);

    const request4 = await request
      .get('/mobiles/privatelistings')
      .set('Content-Type', 'application/json')
      .set('Authorization', token)
      .expect(200);
  });

  it('shows a public mobile', async () => {
    const user_dto: CreateUserDto = {
      username: 'yousuf',
      email: mail,
      password: 'sfnuweweifnw',
    };
    const res = await request.post('/auth/register').send(user_dto).expect(201);

    const logindto: LoginUserDto = {
      username: 'yousuf',
      password: 'sfnuweweifnw',
    };

    const request2 = await request
      .post('/auth/login')
      .send(logindto)
      .expect(201);

    const token = 'Bearer ' + request2.body.accessToken;
    const mobile = {
      is_private: false,
      title: 'sdfsfd pro MAX',
      text_context: '2cameras 12mp',
      category: ['A', 'B'],
    };

    await repository.save([{ category: 'A' }, { category: 'B' }]);
    const request3 = await request
      .post('/mobiles/createitem')
      .set('Content-Type', 'application/json')
      .set('Authorization', token)
      .send(mobile)
      .expect(201);

    const request4 = await request.get('/mobiles/phones').expect(200);
  });
});
