const { PrismaClient } = await import('../prisma-client');

export type IRepository = InstanceType<typeof PrismaClient>;
