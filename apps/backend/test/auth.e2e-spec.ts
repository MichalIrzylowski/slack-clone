import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Auth & Channels (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let adminToken: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    prisma = moduleRef.get(PrismaService);
    // Reset db tables
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

  it('initial admin creation succeeds when no users', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/init-admin')
      .send({ name: 'AdminUser', password: 'Password123!' });
    expect(res.status).toBe(201);
    expect(res.body.role).toBe('ADMIN');
  });

  it('initial admin creation blocked when users exist', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/init-admin')
      .send({ name: 'AnotherAdmin', password: 'Password123!' });
    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  it('login returns JWT token', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ name: 'AdminUser', password: 'Password123!' });
    expect(res.status).toBe(201); // Created? default for Post without override
    expect(res.body.accessToken).toBeDefined();
    adminToken = res.body.accessToken;
  });

  it('me endpoint returns current user', async () => {
    const res = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('adminuser');
  });

  it('admin-check passes with ADMIN role', async () => {
    const res = await request(app.getHttpServer())
      .get('/auth/admin-check')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  it('channel create blocked without token', async () => {
    const res = await request(app.getHttpServer())
      .post('/channels')
      .send({ name: 'general', isPrivate: false });
    expect(res.status).toBe(401);
  });

  it('channel create succeeds with token', async () => {
    const res = await request(app.getHttpServer())
      .post('/channels')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'general', isPrivate: false });
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('general');
  });
});
