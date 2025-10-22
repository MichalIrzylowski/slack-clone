import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Messages (channel membership guard) (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let adminToken: string;
  let channelId: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    prisma = moduleRef.get(PrismaService);
    await prisma.$connect();
    // Clean relevant tables (order matters due to FKs)
    await prisma.message.deleteMany();
    await prisma.channelMembership.deleteMany();
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

  it('bootstraps admin', async () => {
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

  it('create channel (admin)', async () => {
    const res = await request(app.getHttpServer())
      .post('/channels')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'general' });
    expect(res.status).toBe(201);
    channelId = res.body.id;
  });

  it('GET /messages without auth returns 401', async () => {
    const res = await request(app.getHttpServer()).get(
      `/messages?channelId=${channelId}`,
    );
    expect(res.status).toBe(401);
  });

  it('GET /messages with auth but not a member returns 403', async () => {
    const res = await request(app.getHttpServer())
      .get(`/messages?channelId=${channelId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(403);
  });

  it('join channel', async () => {
    const res = await request(app.getHttpServer())
      .post(`/channels/${channelId}/join`)
      .set('Authorization', `Bearer ${adminToken}`);
    // Controller returns default 200 OK (no @HttpCode override)
    expect([200, 201]).toContain(res.status); // allow 201 if framework defaults differ
  });

  it('GET /messages succeeds after membership (empty list)', async () => {
    const res = await request(app.getHttpServer())
      .get(`/messages?channelId=${channelId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
