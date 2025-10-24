import { PrismaClient, UserRole, ChannelMemberRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

// Seed objectives:
// 1. Ensure core channels exist (general, random, engineering, design)
// 2. Ensure baseline users (admin + demo users) exist
// 3. Admin MUST be a member of 'general'
// 4. Provide sample messages across channels for initial UI population
// 5. Idempotent & safe on re-run (tolerate duplicates)

let prisma: PrismaClient | null = null;
function getPrisma() {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
}

const mockChannels = ['general', 'random', 'engineering', 'design'];

// Sample message seed definitions now include a prebuilt lexical JSON string in `content`
// This avoids runtime transformation and keeps seed deterministic.
const messageSeeds: Array<{
  channel: string;
  username: string;
  content: string;
}> = [
  {
    channel: 'general',
    username: 'admin',
    content: JSON.stringify({
      root: {
        children: [
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Welcome to #general – feel free to introduce yourself!',
                type: 'text',
                version: 1,
              },
            ],
            direction: null,
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1,
            textFormat: 0,
            textStyle: '',
          },
        ],
        direction: null,
        format: '',
        indent: 0,
        type: 'root',
        version: 1,
      },
    }),
  },
  {
    channel: 'general',
    username: 'alice',
    content: JSON.stringify({
      root: {
        children: [
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Hi everyone ',
                type: 'text',
                version: 1,
              },
              {
                detail: 0,
                format: 0,
                mode: 'token',
                style: '',
                text: '👋',
                type: 'emoji',
                version: 1,
                unifiedId: '1f44b',
              },
            ],
            direction: null,
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1,
            textFormat: 0,
            textStyle: '',
          },
        ],
        direction: null,
        format: '',
        indent: 0,
        type: 'root',
        version: 1,
      },
    }),
  },
  {
    channel: 'random',
    username: 'bob',
    content: JSON.stringify({
      root: {
        children: [
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Random thought of the day: use more tests.',
                type: 'text',
                version: 1,
              },
            ],
            direction: null,
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1,
            textFormat: 0,
            textStyle: '',
          },
        ],
        direction: null,
        format: '',
        indent: 0,
        type: 'root',
        version: 1,
      },
    }),
  },
  {
    channel: 'engineering',
    username: 'alice',
    content: JSON.stringify({
      root: {
        children: [
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Deployment succeeded, nice work team.',
                type: 'text',
                version: 1,
              },
            ],
            direction: null,
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1,
            textFormat: 0,
            textStyle: '',
          },
        ],
        direction: null,
        format: '',
        indent: 0,
        type: 'root',
        version: 1,
      },
    }),
  },
  {
    channel: 'design',
    username: 'bob',
    content: JSON.stringify({
      root: {
        children: [
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Uploaded new logo concept. Feedback welcome.',
                type: 'text',
                version: 1,
              },
            ],
            direction: null,
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1,
            textFormat: 0,
            textStyle: '',
          },
        ],
        direction: null,
        format: '',
        indent: 0,
        type: 'root',
        version: 1,
      },
    }),
  },
  {
    channel: 'general',
    username: 'admin',
    content: JSON.stringify({
      root: {
        children: [
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'witajcie ',
                type: 'text',
                version: 1,
              },
              {
                detail: 0,
                format: 0,
                mode: 'token',
                style: '',
                text: '🙂',
                type: 'emoji',
                version: 1,
                unifiedId: '1f642',
              },
            ],
            direction: null,
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1,
            textFormat: 0,
            textStyle: '',
          },
        ],
        direction: null,
        format: '',
        indent: 0,
        type: 'root',
        version: 1,
      },
    }),
  },
];

async function seed() {
  console.log('[Seed] Using DATABASE_URL=', process.env.DATABASE_URL);
  const seedChannels = mockChannels.map((c) => c.trim()).filter(Boolean);

  const client = getPrisma();

  // Wipe dependent data first (messages -> memberships -> channels/users) for clean slate
  // If you prefer additive seeding, remove these deleteMany calls.
  await client.message.deleteMany();
  await client.channelMembership.deleteMany();
  await client.channel.deleteMany();
  await client.user.deleteMany();

  // (Re)create channels
  const unique = Array.from(new Set(seedChannels));
  await client.channel.createMany({ data: unique.map((name) => ({ name })) });

  // Seed users (idempotent via try/catch on uniqueness)
  const hash = (pwd: string) => bcrypt.hash(pwd, 12);
  const usersToCreate = [
    {
      email: 'admin@example.com',
      username: 'admin',
      passwordHash: await hash('Password123!'),
      role: UserRole.ADMIN,
    },
    {
      email: 'alice@example.com',
      username: 'alice',
      passwordHash: await hash('Password123!'),
      role: UserRole.USER,
    },
    {
      email: 'bob@example.com',
      username: 'bob',
      passwordHash: await hash('Password123!'),
      role: UserRole.USER,
    },
  ];
  for (const u of usersToCreate) {
    try {
      await client.user.create({ data: u });
    } catch (e: any) {
      if (e?.code !== 'P2002') throw e; // ignore duplicates
    }
  }

  // Fetch created records for mapping
  const channels = await client.channel.findMany({
    select: { id: true, name: true },
  });
  const users = await client.user.findMany({
    select: { id: true, username: true },
  });
  const channelMap = new Map(channels.map((c) => [c.name, c.id]));
  const userMap = new Map(users.map((u) => [u.username, u.id]));

  // Ensure admin membership in 'general'
  const adminId = userMap.get('admin');
  const generalId = channelMap.get('general');
  if (adminId && generalId) {
    await client.channelMembership
      .create({
        data: {
          channelId: generalId,
          userId: adminId,
          role: ChannelMemberRole.ADMIN,
        },
      })
      .catch(() => void 0);
  }

  // Conversion helper from lexical JSON to plain text + very naive HTML
  function lexicalJsonToPlainAndHtml(serialized: string): {
    plain: string;
    html: string;
  } {
    try {
      const obj = JSON.parse(serialized);
      const texts: string[] = [];
      function walk(n: any) {
        if (!n) return;
        if (Array.isArray(n)) {
          n.forEach(walk);
          return;
        }
        if (typeof n === 'object') {
          if (typeof n.text === 'string') texts.push(n.text);
          if (n.children) walk(n.children);
        }
      }
      walk(obj.root?.children);
      const plain = texts.join('');
      let html = '';
      const paragraphs = obj.root?.children || [];
      for (const p of paragraphs) {
        if (p?.type === 'paragraph') {
          const parts: string[] = [];
          (p.children || []).forEach((cn: any) => {
            if (cn.text) {
              const escaped = cn.text
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
              parts.push(escaped);
            }
          });
          html += `<p>${parts.join('')}</p>`;
        }
      }
      return { plain, html: html || plain };
    } catch {
      return { plain: '', html: '' };
    }
  }

  // Prepare message data (only if channel + user exist) aligned with Message model
  const messagesData = messageSeeds
    .map((m) => {
      const channelId = channelMap.get(m.channel);
      const authorId = userMap.get(m.username);
      if (!channelId || !authorId) return null;
      const { plain, html } = lexicalJsonToPlainAndHtml(m.content);
      return {
        authorId,
        channelId,
        serializedMessage: m.content,
        plainTextMessage: plain,
        htmlMessage: html,
      };
    })
    .filter(Boolean) as Array<{
    authorId: string;
    channelId: string;
    serializedMessage: string;
    plainTextMessage: string;
    htmlMessage: string;
  }>;

  if (messagesData.length) {
    await client.message.createMany({ data: messagesData });
  }

  // Log summary
  console.log('[Seed] Channels:', channels.length);
  console.log('[Seed] Users:', users.length);
  console.log('[Seed] Messages inserted:', messagesData.length);
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

// Allow running this file directly: `ts-node src/seed/seed.ts` or after transpile `node dist/seed/seed.js`
// eslint-disable-next-line @typescript-eslint/no-floating-promises
if (require.main === module) {
  runSeedOnBootstrap()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
