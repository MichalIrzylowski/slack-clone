import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

let prisma: PrismaClient | null = null;
function getPrisma() {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
}

const mockChannels = ['general', 'random', 'engineering', 'design'];

async function seed() {
  console.log('[Seed] Using DATABASE_URL=', process.env.DATABASE_URL);
  const seedChannels = mockChannels.map((c) => c.trim()).filter(Boolean);

  // Clear existing channels
  const client = getPrisma();
  await client.channel.deleteMany();
  await client.user.deleteMany();

  // Insert fresh channels
  // Ensure uniqueness manually (Channel.name is unique)
  const unique = Array.from(new Set(seedChannels));
  await client.channel.createMany({
    data: unique.map((name) => ({ name })),
  });
  // Seed initial admin and demo users (simple static passwords for dev only)
  const hash = (pwd: string) => bcrypt.hash(pwd, 12);
  const usersToCreate = [
    {
      email: 'admin@example.com',
      username: 'admin',
      passwordHash: await hash('Password123!'),
      role: 'ADMIN',
    },
    {
      email: 'alice@example.com',
      username: 'alice',
      passwordHash: await hash('Password123!'),
      role: 'USER',
    },
    {
      email: 'bob@example.com',
      username: 'bob',
      passwordHash: await hash('Password123!'),
      role: 'USER',
    },
  ];
  for (const u of usersToCreate) {
    try {
      await client.user.create({ data: u });
    } catch (e: any) {
      // Ignore duplicates on re-run
      if (e?.code !== 'P2002') throw e;
    }
  }
}

export async function runSeedOnBootstrap() {
  try {
    await seed();
    // eslint-disable-next-line no-console
    console.log('[Seed] Channels seeded');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[Seed] Error while seeding channels', err);
  } finally {
    if (prisma) await prisma.$disconnect();
  }
}
