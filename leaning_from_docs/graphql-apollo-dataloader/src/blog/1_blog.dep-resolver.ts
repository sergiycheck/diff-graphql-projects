import { ContextType } from './../types';
import { users, posts } from './1_db-data';
import { Post, User } from './1_types';

const resolver = {
  Query: {
    allUsers(_parent, _args, context: ContextType, info) {
      const usersFromDb = users;
      return usersFromDb.map((u) => context.userBlogLoader.load(u.id));
    },

    user(_parent, args: { id: string }, context: ContextType, info) {
      return context.userBlogLoader.load(args.id);
    },

    allPosts(_parent, _args, context: ContextType, info) {
      return posts.map((p) => context.postBlogLoader.load(p.id));
    },

    post(_parent, args: { id: string }, context: ContextType, info) {
      return context.postBlogLoader.load(args.id);
    },
  },

  User: {
    posts(parent: User, _args, context: ContextType, info) {
      console.log('User posts parent', parent);
      return posts.filter((p) => p.userId === parent.id);
    },
  },
  Post: {
    user(parent: Post, _args, context: ContextType, info) {
      console.log('Post user parent', parent);
      return context.userBlogLoader.load(parent.userId);
    },
  },

  // Mutation: {
  //   createUser(parent, args, context: ContextType, info) {
  //     const { dto }: { dto: CreateUser } = args;
  //     return context.userService.createOne(dto);
  //   },
  //   updateUser(parent, args, context: ContextType, info) {
  //     const { dto }: { dto: UpdateUser } = args;
  //     return context.userService.updateOne(dto);
  //   },
  //   deleteUser(parent, args: { id: string }, context: ContextType, info) {
  //     return context.userService.deleteOne(args.id);
  //   },

  //   createPost(parent, args, context: ContextType, info) {
  //     const { dto }: { dto: CreatePost } = args;
  //     return context.postsService.createOne(dto);
  //   },
  //   updatePost(parent, args, context: ContextType, info) {
  //     const { dto }: { dto: UpdatePost } = args;
  //     return context.postsService.updateOne(dto);
  //   },
  //   deletePost(parent, args: { id: string }, context: ContextType, info) {
  //     return context.postsService.deleteOne(args.id);
  //   },
  // },
};

export default resolver;
