import { CustomLog } from './../logger/customLogger';
import { prismaInstance } from '../constants';
import { PrismaClient } from '@prisma/client';
import { Inject, Service } from 'typedi';
import { CreateUser, UpdateUser } from './user.types';

@Service()
class UserService {
  prisma: PrismaClient;
  constructor(@Inject(prismaInstance) prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getList() {
    const res = await this.prisma.user.findMany();
    return res;
  }

  async getListWithRelations() {
    return this.prisma.user.findMany({
      include: {
        posts: true,
      },
    });
  }

  async getOne(id: string) {
    const res = await this.prisma.user.findUnique({ where: { id: id } });
    return res;
  }

  async createOne(user: CreateUser) {
    const { email, posts } = user;
    if (posts && posts.length) {
      return this.prisma.user.create({
        data: {
          email,
          posts: {
            createMany: {
              data: [...posts],
            },
          },
        },
      });
    }
    return this.prisma.user.create({
      data: {
        email,
      },
    });
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
