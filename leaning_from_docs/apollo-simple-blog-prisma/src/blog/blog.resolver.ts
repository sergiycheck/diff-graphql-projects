import { CreatePost, UpdatePost } from './post.types';
import { CreateUser, UpdateUser } from './user.types';
import { ContextType } from 'src/common.types';
import graphqlFields from 'graphql-fields';

const resolver = {
  Query: {
    allUsers(_parent, _args, context: ContextType, info) {
      const requestedFields = graphqlFields(info);
      return context.userService.getList(requestedFields);
    },

    user(_parent, args: { id: string }, context: ContextType, info) {
      const requestedFields = graphqlFields(info);

      return context.userService.getOne(args.id, requestedFields);
    },

    allPosts(_parent, _args, context: ContextType, info) {
      const requestedFields = graphqlFields(info);

      return context.postsService.getList(requestedFields);
    },

    post(_parent, args: { id: string }, context: ContextType, info) {
      const requestedFields = graphqlFields(info);

      return context.postsService.getOne(args.id, requestedFields);
    },
  },

  Mutation: {
    async createUser(parent, args, context: ContextType, info) {
      const { dto }: { dto: CreateUser } = args;
      const res = await context.userService.createOne(dto);
      return res;
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
