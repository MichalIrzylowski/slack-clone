import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Auth & Channels (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let adminToken: string;
  let userToken: string;

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
      .send({
        email: 'admin@example.com',
        username: 'AdminUser',
        password: 'Password123!',
      });
    expect(res.status).toBe(201);
    expect(res.body.role).toBe('ADMIN');
    expect(res.body.email).toBe('admin@example.com');
    expect(res.body.username).toBe('adminuser');
  });

  it('initial admin creation blocked when users exist', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/init-admin')
      .send({
        email: 'second@example.com',
        username: 'AnotherAdmin',
        password: 'Password123!',
      });
    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  it('login returns JWT token', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@example.com', password: 'Password123!' });
    expect(res.status).toBe(201); // Created? default for Post without override
    expect(res.body.accessToken).toBeDefined();
    adminToken = res.body.accessToken;
  });

  it('non-admin user can login (seeded alice) but cannot register new user', async () => {
    // Seed a normal user directly (since register is admin-only)
    const bcryptMod = await import('bcrypt');
    await prisma.user.create({
      data: {
        email: 'alice@example.com',
        username: 'alice',
        passwordHash: await bcryptMod.hash('Password123!', 12),
        role: 'USER',
      },
    });
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'alice@example.com', password: 'Password123!' });
    expect(res.status).toBe(201);
    userToken = res.body.accessToken;
    // Attempt registration without admin role
    const reg = await request(app.getHttpServer())
      .post('/auth/register')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        email: 'newuser@example.com',
        username: 'newuser',
        password: 'Password123!',
      });
    expect(reg.status).toBe(403); // Forbidden due to role guard
  });

  it('register endpoint blocked when unauthenticated', async () => {
    const res = await request(app.getHttpServer()).post('/auth/register').send({
      email: 'nouser@example.com',
      username: 'nouser',
      password: 'Password123!',
    });
    expect(res.status).toBe(401);
  });

  it('admin can register a new user', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        email: 'charlie@example.com',
        username: 'charlie',
        password: 'Password123!',
      });
    expect(res.status).toBe(201);
    expect(res.body.email).toBe('charlie@example.com');
    expect(res.body.username).toBe('charlie');
    expect(res.body.role).toBe('USER');
  });

  it('me endpoint returns current user', async () => {
    const res = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.email).toBe('admin@example.com');
    expect(res.body.username).toBe('adminuser');
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
