import { PrismaClient } from '@prisma/client';
import { CustomLog } from './logger/customLogger';

const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'stdout',
      level: 'error',
    },
    {
      emit: 'stdout',
      level: 'info',
    },
    {
      emit: 'stdout',
      level: 'warn',
    },
  ],
});

prisma.$on('query', (e) => {
  CustomLog.log('Query: ' + e.query);
});

prisma.$use(async (params, next) => {
  const before = Date.now();

  const result = await next(params);

  const after = Date.now();

  CustomLog.log(`Query ${params.model}.${params.action} took ${after - before}ms`);

  return result;
});

export default prisma;
