import { logger } from './../utils/logger';
import { CacheScope } from 'apollo-server-types';
import { GraphQLResolveInfo } from 'graphql';
import { ContextType } from './../types';
import { users, posts } from './db-data';
import { CreatePost, CreateUser, Post, UpdatePost, UpdateUser, User } from './types';

const resolver = {
  Query: {
    allUsers(_parent, _args, context: ContextType, info: GraphQLResolveInfo) {
      const usersFromDb = users;
      return usersFromDb.map((u) => context.userBlogLoader.load(u.id));
    },

    user(_parent, args: { id: string }, context: ContextType, info: GraphQLResolveInfo) {
      return context.userBlogLoader.load(args.id);
    },

    getUserFromToken(parent, args, context: ContextType, info: GraphQLResolveInfo) {
      return context.usersAuth.getUserFromToken(context.token);
    },

    allPosts(_parent, _args, context: ContextType, info: GraphQLResolveInfo) {
      return posts.map((p) => context.postBlogLoader.load(p.id));
    },

    post(_parent, args: { id: string }, context: ContextType, info: GraphQLResolveInfo) {
      info.cacheControl.setCacheHint({ maxAge: 60, scope: CacheScope.Private });
      return context.postBlogLoader.load(args.id);
    },
  },

  User: {
    posts(parent: User, _args, context: ContextType, info: GraphQLResolveInfo) {
      logger.log(`info`, `User posts parent ${JSON.stringify(parent)}`);
      return posts.filter((p) => p.userId === parent.id);
    },
  },
  Post: {
    user(parent: Post, _args, context: ContextType, info: GraphQLResolveInfo) {
      logger.log(`info`, `Post user parent ${JSON.stringify(parent)}`);
      return context.userBlogLoader.load(parent.userId);
    },
  },

  Mutation: {
    createUser(parent, args, context: ContextType, info: GraphQLResolveInfo) {
      const { dto }: { dto: CreateUser } = args;

      const newUser: User = {
        id: `${Number(users[users.length - 1].id) + 1}`,
        ...dto,
      };

      users.push(newUser);

      return newUser;
    },
    updateUser(parent, args, context: ContextType, info: GraphQLResolveInfo) {
      const { dto }: { dto: UpdateUser } = args;
      const userToUpdate = users.find((u) => u.id === dto.id);

      if (!userToUpdate) throw new Error(`user was not found`);

      userToUpdate.email = dto.email;

      return userToUpdate;
    },
    deleteUser(
      parent,
      args: { id: string },
      context: ContextType,
      info: GraphQLResolveInfo
    ) {
      const user = users.find((u) => u.id === args.id);

      if (!user) throw new Error(`user was not found`);

      users.splice(users.indexOf(user), 1);

      return user;
    },

    signInUser(
      parent,
      args: { email: string },
      context: ContextType,
      info: GraphQLResolveInfo
    ) {
      return context.usersAuth.genTokenForUser({ email: args.email });
    },

    async createPost(parent, args, context: ContextType, info: GraphQLResolveInfo) {
      if (!context.user) throw new Error(`you must be signed in to create post`);
      const { user } = context;

      const userFromDb = await context.userBlogLoader.load(user.id);
      if (!userFromDb) throw new Error(`no such user with id ${user.id}`);

      const { dto }: { dto: CreatePost } = args;

      if (userFromDb.id !== dto.userId) throw new Error(`you don't own this token`);

      const newItem: Post = {
        id: `${Number(posts[posts.length - 1].id) + 1}`,
        ...dto,
      };

      posts.push(newItem);

      return newItem;
    },
    updatePost(parent, args, context: ContextType, info: GraphQLResolveInfo) {
      const { dto }: { dto: UpdatePost } = args;

      const { id, ...update } = dto;
      let itemToUpdate = posts.find((u) => u.id === id);

      if (!itemToUpdate) throw new Error(`post was not found`);

      posts[posts.indexOf(itemToUpdate)] = {
        ...itemToUpdate,
        ...update,
      };

      return itemToUpdate;
    },
    deletePost(
      parent,
      args: { id: string },
      context: ContextType,
      info: GraphQLResolveInfo
    ) {
      const post = posts.find((u) => u.id === args.id);

      if (!post) throw new Error(`post was not found`);

      posts.splice(posts.indexOf(post), 1);

      return post;
    },
  },
};

export default resolver;
