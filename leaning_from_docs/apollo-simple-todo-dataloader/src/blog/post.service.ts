import { prismaInstance } from '../constants';
import { PrismaClient } from '@prisma/client';
import { Inject, Service } from 'typedi';
import { CreatePost, UpdatePost } from './post.types';

@Service()
class PostService {
  prisma: PrismaClient;
  constructor(@Inject(prismaInstance) prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getList() {
    return this.prisma.post.findMany();
  }

  async getOne(id: string) {
    return this.prisma.post.findFirst({ where: { id: id } });
  }

  async getListByUser(userId: string) {
    // return this.prisma.post.findMany({ where: { userId } });
    // the Prisma dataloader ✔ batches the findUnique queries
    return this.prisma.user.findUnique({ where: { id: userId } }).posts();
  }

  async createOne(dto: CreatePost) {
    return this.prisma.post.create({
      data: {
        ...dto,
      },
      include: {
        user: true,
      },
    });
  }

  async updateOne(dto: UpdatePost) {
    const { id, userId, ...update } = dto;
    return this.prisma.post.update({
      where: { id },
      data: {
        ...update,
      },
    });
  }

  async deleteOne(id: string) {
    return this.prisma.post.delete({
      where: {
        id,
      },
    });
  }
}

export default PostService;
