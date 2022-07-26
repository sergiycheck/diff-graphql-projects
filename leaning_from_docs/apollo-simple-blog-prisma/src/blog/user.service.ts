import { prismaInstance } from '../constants';
import { PrismaClient } from '@prisma/client';
import { Inject, Service } from 'typedi';
import { CreateUser, UpdateUser } from './user.types';
import { intersection } from 'lodash';
import { BaseService } from './base.service';

@Service()
class UserService extends BaseService {
  constructor(@Inject(prismaInstance) prisma: PrismaClient) {
    super(prisma);

    this.relationFields = ['posts'];
  }

  async getList(requestedFields: any) {
    const relationsToInclude = this.getRelationsToInclude(requestedFields);

    const res = Object.keys(relationsToInclude).length
      ? await this.prisma.user.findMany({ include: { ...relationsToInclude } })
      : await this.prisma.user.findMany();
    return res;
  }

  async getListWithRelations() {
    return this.prisma.user.findMany({
      include: {
        posts: true,
      },
    });
  }

  async getOne(id: string, requestedFields: any) {
    const relationsToInclude = this.getRelationsToInclude(requestedFields);

    const res = Object.keys(relationsToInclude).length
      ? await this.prisma.user.findUnique({
          where: { id: id },
          include: { ...relationsToInclude },
        })
      : await this.prisma.user.findUnique({ where: { id: id } });
    return res;
  }

  async createOne(user: CreateUser) {
    const { email, posts } = user;
    let res;
    if (posts && posts.length) {
      res = await this.prisma.user.create({
        data: {
          email,
          posts: {
            createMany: {
              data: [...posts],
            },
          },
        },
      });
    } else {
      res = await this.prisma.user.create({
        data: {
          email,
        },
      });
    }

    return res;
  }

  async updateOne(data: UpdateUser) {
    const { id, ...update } = data;
    return this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        ...update,
      },
    });
  }

  async deleteOne(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
}

export default UserService;
