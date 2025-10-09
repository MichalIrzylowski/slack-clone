import { PrismaClient } from '@prisma/client';

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

  // Insert fresh channels
  // Ensure uniqueness manually (Channel.name is unique)
  const unique = Array.from(new Set(seedChannels));
  await client.channel.createMany({
    data: unique.map((name) => ({ name })),
  });
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
