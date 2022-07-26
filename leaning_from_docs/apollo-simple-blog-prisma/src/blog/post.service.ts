import { prismaInstance } from '../constants';
import { PrismaClient } from '@prisma/client';
import { Inject, Service } from 'typedi';
import { CreatePost, UpdatePost } from './post.types';
import { BaseService } from './base.service';

@Service()
class PostService extends BaseService {
  prisma: PrismaClient;
  constructor(@Inject(prismaInstance) prisma: PrismaClient) {
    super(prisma);

    this.relationFields = ['user'];
  }

  async getList(requestedFields: any) {
    const relationsToInclude = this.getRelationsToInclude(requestedFields);

    const res = Object.keys(relationsToInclude).length
      ? await this.prisma.post.findMany({ include: { ...relationsToInclude } })
      : await this.prisma.post.findMany();
    return res;
  }

  async getOne(id: string, requestedFields: any) {
    const relationsToInclude = this.getRelationsToInclude(requestedFields);

    const res = Object.keys(relationsToInclude).length
      ? await this.prisma.post.findUnique({
          where: { id: id },
          include: { ...relationsToInclude },
        })
      : this.prisma.post.findUnique({ where: { id: id } });

    return res;
  }

  async getListByUser(userId: string) {
    // return this.prisma.post.findMany({ where: { userId } });
    // the Prisma dataloader ✔ batches the findUnique queries

    const res = await this.prisma.user.findUnique({ where: { id: userId } }).posts();
    return res;
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
