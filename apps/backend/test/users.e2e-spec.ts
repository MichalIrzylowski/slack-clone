import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Users (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let adminToken: string;
  let userToken: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    prisma = moduleRef.get(PrismaService);
    await prisma.$connect();
    await prisma.channel.deleteMany();
    await prisma.user.deleteMany();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  it('creates initial admin', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/init-admin')
      .send({
        email: 'admin@example.com',
        username: 'Admin',
        password: 'Password123!',
      });
    expect(res.status).toBe(201);
  });

  it('admin login', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@example.com', password: 'Password123!' });
    expect(res.status).toBe(201);
    adminToken = res.body.accessToken;
  });

  it('admin can POST /users', async () => {
    const res = await request(app.getHttpServer())
      .post('/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        email: 'newuser@example.com',
        password: 'Password123!',
        name: 'New User',
        role: 'member',
      });
    expect(res.status).toBe(201);
    expect(res.body.email).toBe('newuser@example.com');
    expect(res.body.role).toBe('USER');
  });

  it('non-admin cannot POST /users', async () => {
    // create a regular user via register endpoint first
    const reg = await request(app.getHttpServer())
      .post('/auth/register')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        email: 'regular@example.com',
        username: 'regular',
        password: 'Password123!',
      });
    expect(reg.status).toBe(201);
    // login regular user
    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'regular@example.com', password: 'Password123!' });
    expect(login.status).toBe(201);
    userToken = login.body.accessToken;
    // attempt POST /users
    const res = await request(app.getHttpServer())
      .post('/users')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        email: 'blocked@example.com',
        password: 'Password123!',
        name: 'Blocked User',
        role: 'member',
      });
    expect(res.status).toBe(403);
  });
});
