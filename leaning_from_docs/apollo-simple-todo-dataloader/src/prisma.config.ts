import { PrismaClient } from '@prisma/client';
import { CustomLog } from './logger/customLogger';

const prisma = new PrismaClient();

prisma.$use(async (params, next) => {
  const before = Date.now();

  const result = await next(params);

  const after = Date.now();

  CustomLog.log(`Query ${params.model}.${params.action} took ${after - before}ms`);

  return result;
});

export default prisma;
