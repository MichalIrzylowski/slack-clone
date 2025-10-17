import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { JwtService } from '@nestjs/jwt';
import { io, Socket } from 'socket.io-client';

describe('WebSocket Auth (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let token: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    await app.listen(0); // random free port
    const serverUrl = `http://127.0.0.1:${(app.getHttpServer() as any).address().port}`;

    jwtService = moduleRef.get(JwtService);
    token = await jwtService.signAsync({ sub: 'user-1', role: 'user' });

    (global as any).WS_TEST_SERVER_URL = serverUrl; // store for tests
  });

  afterAll(async () => {
    await app.close();
  });

  it('does NOT acknowledge protected event without token', (done) => {
    const url = (global as any).WS_TEST_SERVER_URL;
    const client: Socket = io(url, {
      autoConnect: true,
      reconnection: false,
    });
    let ackCalled = false;

    client.on('connect', () => {
      client.emit('dummy-event', { ping: true }, () => {
        ackCalled = true; // should not be called
      });
    });

    setTimeout(() => {
      try {
        expect(ackCalled).toBe(false);
        client.close();
        done();
      } catch (e) {
        client.close();
        done(e);
      }
    }, 1000);
  });

  it('allows authorized event and returns hello world', (done) => {
    const url = (global as any).WS_TEST_SERVER_URL;
    const client: Socket = io(url, {
      auth: { token: `Bearer ${token}` }, // socket.io client can send auth in handshake; our guard checks query/header. We'll also send in query.
      query: { token: `Bearer ${token}` },
      autoConnect: true,
    });

    client.on('connect', () => {
      client.emit('dummy-event', { any: 'data' }, (response: any) => {
        try {
          expect(response).toBeDefined();
          expect(response.message).toBe('hello world');
          client.close();
          done();
        } catch (e) {
          client.close();
          done(e);
        }
      });
    });

    // No extra timeout needed; ack callback handles completion.
  });
});
