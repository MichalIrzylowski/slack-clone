import { Test } from '@nestjs/testing';
import { ChannelService } from './channel.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('ChannelService.create', () => {
  let service: ChannelService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [ChannelService, PrismaService],
    }).compile();
    service = moduleRef.get(ChannelService);
    prisma = moduleRef.get(PrismaService);
    await prisma.$connect();
  });

  beforeEach(async () => {
    await prisma.channel.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('creates and normalizes name to lowercase', async () => {
    const created = await service.create({
      name: 'Engineering',
      isPrivate: false,
    });
    expect(created.name).toBe('engineering');
    expect(created.isPrivate).toBe(false);
    expect(created.id).toBeDefined();
  });

  it('rejects empty name', async () => {
    await expect(
      service.create({ name: '   ', isPrivate: false }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects duplicate name after normalization', async () => {
    await service.create({ name: 'Design', isPrivate: false });
    await expect(
      service.create({ name: 'design', isPrivate: false }),
    ).rejects.toHaveProperty('code', 'P2002');
  });

  it('lists all results (no pagination)', async () => {
    const names = ['general', 'random', 'design'];
    for (const n of names) await service.create({ name: n, isPrivate: false });
    const list = await service.list();
    expect(list.map((c) => c.name)).toEqual(names);
  });

  it('filters by search (case-insensitive)', async () => {
    await service.create({ name: 'general', isPrivate: false });
    await service.create({ name: 'design', isPrivate: false });
    await service.create({ name: 'engineering', isPrivate: false });
    const res = await service.list({ search: 'DES' });
    expect(res.map((i) => i.name)).toEqual(['design']);
    const res2 = await service.list({ search: 'eng' });
    expect(res2.map((i) => i.name)).toEqual(['engineering']);
  });

  it('updates channel name and normalizes', async () => {
    const c = await service.create({ name: 'alpha', isPrivate: false });
    const updated = await service.update(c.id, { name: 'NewName' });
    expect(updated.name).toBe('newname');
  });

  it('rejects update with empty name', async () => {
    const c = await service.create({ name: 'beta', isPrivate: false });
    await expect(service.update(c.id, { name: '   ' })).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('updates isPrivate flag', async () => {
    const c = await service.create({ name: 'secure', isPrivate: false });
    const updated = await service.update(c.id, { isPrivate: true });
    expect(updated.isPrivate).toBe(true);
  });

  it('archives channel and excludes from default list', async () => {
    const c = await service.create({ name: 'archive-me', isPrivate: false });
    const archived = await service.update(c.id, { archived: true });
    expect(archived.archivedAt).toBeInstanceOf(Date);
    const listDefault = await service.list();
    expect(listDefault.find((i) => i.id === c.id)).toBeUndefined();
    const listInclude = await service.list({ includeArchived: true });
    expect(listInclude.find((i) => i.id === c.id)).toBeDefined();
  });

  it('soft deletes channel and excludes from list', async () => {
    const c = await service.create({ name: 'remove-me', isPrivate: false });
    const removed = await service.remove(c.id);
    expect(removed.deletedAt).toBeInstanceOf(Date);
    const list = await service.list();
    expect(list.find((i) => i.id === c.id)).toBeUndefined();
  });

  it('throws NotFoundException when removing already deleted channel', async () => {
    const c = await service.create({ name: 'double-remove', isPrivate: false });
    await service.remove(c.id);
    await expect(service.remove(c.id)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('rejects duplicate rename (unique constraint)', async () => {
    await service.create({ name: 'alpha', isPrivate: false });
    const b = await service.create({ name: 'beta', isPrivate: false });
    await expect(
      service.update(b.id, { name: 'Alpha' }),
    ).rejects.toHaveProperty('code', 'P2002');
    // ensure originals remain
    const list = await service.list();
    expect(list.map((i) => i.name).sort()).toEqual(['alpha', 'beta']);
  });
});
