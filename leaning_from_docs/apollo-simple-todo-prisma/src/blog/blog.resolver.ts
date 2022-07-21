import { CustomLog } from './../logger/customLogger';
import { CreatePost, UpdatePost, PostDb } from './post.types';
import { CreateUser, UpdateUser, User } from './user.types';
import { ContextType } from 'src/common.types';
import { Post } from './post.types';

const resolver = {
  Query: {
    allUsers(_parent, _args, context: ContextType, info) {
      return context.userService.getList();
    },

    user(_parent, args: { id: string }, context: ContextType, info) {
      return context.userService.getOne(args.id);
    },

    allPosts(_parent, _args, context: ContextType, info) {
      return context.postsService.getList();
    },

    post(_parent, args: { id: string }, context: ContextType, info) {
      return context.postsService.getOne(args.id);
    },
  },

  User: {
    posts(parent: User, _args, context: ContextType, info) {
      return context.postsService.getListByUser(parent.id);
    },
  },
  Post: {
    user(parent: PostDb, _args, context: ContextType, info) {
      return context.userService.getOne(parent.userId);
    },
  },

  Mutation: {
    createUser(parent, args, context: ContextType, info) {
      const { dto }: { dto: CreateUser } = args;
      return context.userService.createOne(dto);
    },
    updateUser(parent, args, context: ContextType, info) {
      const { dto }: { dto: UpdateUser } = args;
      return context.userService.updateOne(dto);
    },
    deleteUser(parent, args: { id: string }, context: ContextType, info) {
      return context.userService.deleteOne(args.id);
    },

    createPost(parent, args, context: ContextType, info) {
      const { dto }: { dto: CreatePost } = args;
      return context.postsService.createOne(dto);
    },
    updatePost(parent, args, context: ContextType, info) {
      const { dto }: { dto: UpdatePost } = args;
      return context.postsService.updateOne(dto);
    },
    deletePost(parent, args: { id: string }, context: ContextType, info) {
      return context.postsService.deleteOne(args.id);
    },
  },
};

export default resolver;
