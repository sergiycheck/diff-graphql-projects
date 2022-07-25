import { PrismaClient } from '@prisma/client';
import { intersection } from 'lodash';

export class BaseService {
  prisma: PrismaClient;
  protected relationFields: string[];

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  protected getRelationsToInclude(requestedFields: any) {
    const intersectionRes = intersection(
      this.relationFields,
      Object.keys(requestedFields)
    );

    const relationsToInclude = intersectionRes.reduce((prev, curr) => {
      prev[curr] = true;
      return prev;
    }, {}) as any;

    return relationsToInclude;
  }
}
